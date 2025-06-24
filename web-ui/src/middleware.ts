import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
      console.error('❌ Erro no middleware ao obter a sessão:', sessionError)
      // Se houver um erro na sessão, assumir que não está autenticado
      return res
    }

    let user = null
    if (session) {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error(
          '❌ Erro no middleware ao obter o usuário autenticado:',
          userError
        )
        // Se houver um erro ao obter o usuário, assumir que não está autenticado
        return res
      }
      user = userData.user
    }

    const { pathname } = req.nextUrl
    const isAuthenticated = !!user

    console.log(
      `🔍 Middleware - Rota: ${pathname}, Autenticado: ${isAuthenticated}`
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
      console.log('🔄 Redirecionando usuário autenticado para dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Se usuário não autenticado tenta acessar rota protegida
    if (!isAuthenticated && isProtectedRoute) {
      console.log('🔒 Redirecionando usuário não autenticado para login')
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
      console.log('🏠 Redirecionando página inicial para dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Verificar acesso a questionários públicos
    if (pathname.startsWith('/public/')) {
      const token = pathname.split('/public/')[1]

      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }

      // Verificar se o token é válido
      const { data: linkData, error: linkError } = await supabase
        .from('public_links')
        .select('*')
        .eq('token', token)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (linkError || !linkData) {
        // Token inválido ou expirado
        return NextResponse.redirect(new URL('/login', req.url))
      }

      // Token válido, permitir acesso
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

    console.log('✅ Middleware - Permitindo acesso')
    return res
  } catch (error) {
    console.error('❌ Erro inesperado no middleware:', error)
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
