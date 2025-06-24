'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Stethoscope } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
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
import { supabase } from '@/lib/supabase/client'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        toast.error('Erro ao enviar e-mail', {
          description: error.message,
        })
        return
      }

      setEmailSent(true)
      toast.success('E-mail enviado!', {
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      })
    } catch (error) {
      toast.error('Erro inesperado', {
        description: 'Tente novamente em alguns instantes.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader className='space-y-1'>
            <div className='mb-4 flex items-center justify-center'>
              <div className='flex items-center space-x-2'>
                <Stethoscope className='h-8 w-8 text-blue-600' />
                <span className='text-2xl font-bold text-gray-900'>
                  Vitalia
                </span>
              </div>
            </div>
            <CardTitle className='text-center text-2xl'>
              E-mail enviado
            </CardTitle>
            <CardDescription className='text-center'>
              Verifique sua caixa de entrada para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className='text-center'>
            <p className='mb-4 text-sm text-gray-600'>
              Enviamos um link de redefinição de senha para{' '}
              <span className='font-medium'>{form.getValues('email')}</span>
            </p>
            <p className='text-xs text-gray-500'>
              Não recebeu o e-mail? Verifique sua pasta de spam ou{' '}
              <button
                onClick={() => setEmailSent(false)}
                className='font-medium text-blue-600 hover:underline'
              >
                tente novamente
              </button>
            </p>
          </CardContent>
          <CardFooter>
            <div className='w-full text-center text-sm text-gray-600'>
              <Link
                href='/login'
                className='flex items-center justify-center font-medium text-blue-600 hover:underline'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Voltar para o login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <div className='mb-4 flex items-center justify-center'>
            <div className='flex items-center space-x-2'>
              <Stethoscope className='h-8 w-8 text-blue-600' />
              <span className='text-2xl font-bold text-gray-900'>Vitalia</span>
            </div>
          </div>
          <CardTitle className='text-center text-2xl'>
            Esqueceu sua senha?
          </CardTitle>
          <CardDescription className='text-center'>
            Digite seu e-mail para receber um link de redefinição
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
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar link de redefinição'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className='w-full text-center text-sm text-gray-600'>
            <Link
              href='/login'
              className='flex items-center justify-center font-medium text-blue-600 hover:underline'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Voltar para o login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
