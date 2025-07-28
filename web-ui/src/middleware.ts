import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/utils/logger'

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/public', // Para questionários públicos
  '/', // Página inicial
]

// Rotas que só usuários não autenticados podem acessar
const authOnlyRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
]

// Rotas protegidas que precisam de autenticação
const protectedRoutes = [
  '/dashboard',
  '/patients',
  '/questionnaires',
  '/calendar',
  '/images',
  '/comparison',
  '/facial-complaints',
]

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    // Obter sessão do usuário
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      logger.error('Erro no middleware ao obter a sessão', sessionError, 'Middleware')
      // Se houver um erro na sessão, assumir que não está autenticado
      return res
    }

    let user = null
    if (session) {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) {
        logger.error(
          'Erro no middleware ao obter o usuário autenticado',
          userError,
          'Middleware'
        )
        // Se houver um erro ao obter o usuário, assumir que não está autenticado
        return res
      }
      user = userData.user
    }

    const { pathname } = req.nextUrl
    const isAuthenticated = !!user

    logger.debug(
      'Middleware verificando rota',
      { pathname, isAuthenticated },
      'Middleware'
    )

    // Verificar se é uma rota pública
    const isPublicRoute = publicRoutes.some(
      route => pathname === route || pathname.startsWith(`${route}/`)
    )

    // Verificar se é uma rota que só usuários não autenticados podem acessar
    const isAuthOnlyRoute = authOnlyRoutes.some(
      route => pathname === route || pathname.startsWith(`${route}/`)
    )

    // Verificar se é uma rota protegida
    const isProtectedRoute = protectedRoutes.some(
      route => pathname === route || pathname.startsWith(`${route}/`)
    )

    // Se usuário autenticado tenta acessar rotas de auth (login, register)
    if (isAuthenticated && isAuthOnlyRoute) {
      logger.info('Redirecionando usuário autenticado para dashboard', { pathname }, 'Middleware')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Se usuário não autenticado tenta acessar rota protegida
    if (!isAuthenticated && isProtectedRoute) {
      logger.info('Redirecionando usuário não autenticado para login', { pathname }, 'Middleware')
      // Evitar loop infinito de redirecionamentos
      if (pathname === '/login') {
        return res
      }

      const redirectUrl = new URL('/login', req.url)
      // Adicionar parâmetro de redirecionamento para voltar após login
      if (pathname !== '/dashboard') {
        redirectUrl.searchParams.set('redirect', pathname)
      }
      return NextResponse.redirect(redirectUrl)
    }

    // Redirecionar página inicial para dashboard se autenticado
    if (isAuthenticated && pathname === '/') {
      logger.info('Redirecionando página inicial para dashboard', undefined, 'Middleware')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Verificar acesso a questionários públicos
    if (pathname.startsWith('/public/')) {
      const token = pathname.split('/public/')[1]

      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }

      // Para links públicos, permitir acesso sem validação no middleware
      // A validação será feita na página/API route específica
      return res
    }

    // Verificar permissões de administrador para rotas específicas
    if (pathname.startsWith('/admin/')) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', req.url))
      }

      // Buscar perfil do usuário para verificar role
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user!.id)
        .single()

      if (profileError || userProfile?.role !== 'admin') {
        // Usuário não é admin, redirecionar para dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    logger.debug('Middleware permitindo acesso', { pathname }, 'Middleware')
    return res
  } catch (error) {
    logger.error('Erro inesperado no middleware', error, 'Middleware')
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
