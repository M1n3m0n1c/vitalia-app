'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Stethoscope } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Nome completo é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(6, 'Senha deve ter pelo menos 6 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'
      ),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
    crm: z
      .string()
      .min(1, 'CRM é obrigatório')
      .regex(/^\d{4,6}$/, 'CRM deve conter apenas números (4-6 dígitos)'),
    specialty: z.string().min(1, 'Especialidade é obrigatória'),
    phone: z
      .string()
      .min(1, 'Telefone é obrigatório')
      .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato: (11) 99999-9999'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

const specialties = [
  'Cardiologia',
  'Dermatologia',
  'Endocrinologia',
  'Gastroenterologia',
  'Ginecologia',
  'Neurologia',
  'Oftalmologia',
  'Ortopedia',
  'Pediatria',
  'Psiquiatria',
  'Radiologia',
  'Urologia',
  'Medicina Estética',
  'Cirurgia Plástica',
  'Medicina Geral',
  'Outro',
]

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      crm: '',
      specialty: '',
      phone: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)

    try {
      // Registrar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            crm: data.crm,
            specialty: data.specialty,
            phone: data.phone,
          },
        },
      })

      if (authError) {
        toast.error('Erro ao criar conta', {
          description: authError.message,
        })
        return
      }

      if (authData.user) {
        // Atualizar dados do usuário na tabela users
        const { error: updateError } = await supabase
          .from('users')
          .update({
            full_name: data.fullName,
            crm: data.crm,
            specialty: data.specialty,
            phone: data.phone,
          })
          .eq('id', authData.user.id)

        if (updateError) {
          console.error('Erro ao atualizar dados do usuário:', updateError)
        }

        toast.success('Conta criada com sucesso!', {
          description: 'Verifique seu e-mail para confirmar sua conta.',
        })

        router.push('/login')
      }
    } catch (error) {
      toast.error('Erro inesperado', {
        description: 'Tente novamente em alguns instantes.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return value
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
              <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                Vitalia
              </span>
            </div>
          </div>
          <CardTitle className='text-center text-2xl'>Criar Conta</CardTitle>
          <CardDescription className='text-center'>
            Crie sua conta para começar a usar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Dr. João Silva'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='crm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CRM</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='123456'
                          disabled={isLoading}
                          {...field}
                          onChange={e => {
                            const value = e.target.value.replace(/\D/g, '')
                            field.onChange(value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='specialty'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specialties.map(specialty => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='(11) 99999-9999'
                        disabled={isLoading}
                        {...field}
                        onChange={e => {
                          const formatted = formatPhone(e.target.value)
                          field.onChange(formatted)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          autoComplete='new-password'
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

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='Confirme sua senha'
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete='new-password'
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
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
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className='w-full text-center text-sm text-gray-600'>
            Já tem uma conta?{' '}
            <Link
              href='/login'
              className='font-medium text-blue-600 hover:underline'
            >
              Faça login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
