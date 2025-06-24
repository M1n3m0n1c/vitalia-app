'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  User,
  MapPin,
  FileText,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  createPatientSchema,
  formatCpf,
  formatPhone,
  formatZipCode,
  type CreatePatientInput,
} from '@/lib/validations/patient'

interface PatientFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<CreatePatientInput & { id?: string }>
  onSubmit: (data: CreatePatientInput & { id?: string }) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function PatientForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: PatientFormProps) {
  const [isAddressOpen, setIsAddressOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const form = useForm<CreatePatientInput>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      full_name: initialData?.full_name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      cpf: initialData?.cpf || '',
      birth_date: initialData?.birth_date || '',
      gender: initialData?.gender || undefined,
      address: initialData?.address || {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      },
      medical_history: initialData?.medical_history || '',
    },
  })

  const handleSubmit = async (data: CreatePatientInput) => {
    try {
      const submitData =
        mode === 'edit' && initialData?.id
          ? { ...data, id: initialData.id }
          : data

      await onSubmit(submitData)

      toast.success(
        mode === 'create'
          ? 'Paciente cadastrado com sucesso!'
          : 'Paciente atualizado com sucesso!'
      )
    } catch (error) {
      toast.error(
        mode === 'create'
          ? 'Erro ao cadastrar paciente'
          : 'Erro ao atualizar paciente'
      )
      console.error('Erro no formulário de paciente:', error)
    }
  }

  return (
    <Card className='mx-auto w-full max-w-4xl'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <User className='h-5 w-5' />
          {mode === 'create' ? 'Cadastrar Novo Paciente' : 'Editar Paciente'}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Preencha os dados do paciente. Campos marcados com * são obrigatórios.'
            : 'Atualize os dados do paciente conforme necessário.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            {/* Dados Pessoais */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <User className='h-4 w-4' />
                <h3 className='text-lg font-medium'>Dados Pessoais</h3>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='full_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Digite o nome completo'
                          {...field}
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='email@exemplo.com'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='(00) 00000-0000'
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
                  name='cpf'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='000.000.000-00'
                          {...field}
                          onChange={e => {
                            const formatted = formatCpf(e.target.value)
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
                  name='birth_date'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gênero</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione o gênero' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='male'>Masculino</SelectItem>
                          <SelectItem value='female'>Feminino</SelectItem>
                          <SelectItem value='other'>Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Endereço */}
            <Collapsible open={isAddressOpen} onOpenChange={setIsAddressOpen}>
              <CollapsibleTrigger className='flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-50'>
                <div className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4' />
                  <h3 className='text-lg font-medium'>Endereço</h3>
                </div>
                {isAddressOpen ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </CollapsibleTrigger>

              <CollapsibleContent className='space-y-4 pt-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  <FormField
                    control={form.control}
                    name='address.zipCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='00000-000'
                            {...field}
                            onChange={e => {
                              const formatted = formatZipCode(e.target.value)
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
                    name='address.street'
                    render={({ field }) => (
                      <FormItem className='md:col-span-2'>
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input placeholder='Nome da rua' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.number'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder='123' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.complement'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder='Apto, bloco, etc.' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.neighborhood'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder='Nome do bairro' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.city'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder='Nome da cidade' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.state'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='SP'
                            maxLength={2}
                            {...field}
                            onChange={e => {
                              field.onChange(e.target.value.toUpperCase())
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Histórico Médico */}
            <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <CollapsibleTrigger className='flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-50'>
                <div className='flex items-center gap-2'>
                  <FileText className='h-4 w-4' />
                  <h3 className='text-lg font-medium'>Histórico Médico</h3>
                </div>
                {isHistoryOpen ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </CollapsibleTrigger>

              <CollapsibleContent className='space-y-4 pt-4'>
                <FormField
                  control={form.control}
                  name='medical_history'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Histórico Médico</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Descreva o histórico médico do paciente, alergias, medicamentos em uso, cirurgias anteriores, etc.'
                          className='min-h-[120px]'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Máximo de 2000 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* Botões de Ação */}
            <div className='flex justify-end gap-4 pt-6'>
              {onCancel && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}

              <Button
                type='submit'
                disabled={isLoading}
                className='min-w-[120px]'
              >
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {mode === 'create' ? 'Cadastrar' : 'Atualizar'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
