'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Stethoscope } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, loading, signIn } = useAuth()

  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, loading, redirectTo, router])

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)

    try {
      const result = await signIn(data.email, data.password)

      if (result.success) {
        toast.success('Login realizado com sucesso!')

        // Com o Supabase SSR, os cookies são gerenciados automaticamente
        // Aguardar um momento e redirecionar
        setTimeout(() => {
          window.location.href = redirectTo
        }, 500)
      } else {
        toast.error('Erro ao fazer login', {
          description: result.error,
        })
      }
    } catch (error) {
      console.error('Erro inesperado:', error)
      toast.error('Erro inesperado', {
        description: 'Tente novamente em alguns instantes.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar loading se estiver verificando autenticação
  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600'></div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800'>
      {/* Theme Toggle */}
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>
      
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <div className='mb-4 flex items-center justify-center'>
            <div className='flex items-center space-x-2'>
              <Stethoscope className='h-8 w-8 text-blue-600' />
              <span className='text-2xl font-bold text-gray-900 dark:text-white'>Vitalia</span>
            </div>
          </div>
          <CardTitle className='text-center text-2xl'>Entrar</CardTitle>
          <CardDescription className='text-center'>
            Faça login para acessar sua conta médica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='seu@email.com'
                        type='email'
                        autoComplete='email'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='Sua senha'
                          type={showPassword ? 'text' : 'password'}
                          autoComplete='current-password'
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-center text-sm text-gray-600'>
            <Link
              href='/forgot-password'
              className='text-blue-600 hover:underline'
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <div className='text-center text-sm text-gray-600'>
            Não tem uma conta?{' '}
            <Link
              href='/register'
              className='font-medium text-blue-600 hover:underline'
            >
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
          <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600'></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
