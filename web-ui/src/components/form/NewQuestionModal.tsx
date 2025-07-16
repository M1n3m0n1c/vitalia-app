'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Question } from '@/types/questionnaire'

interface NewQuestionModalProps {
  onClose: () => void
  onAddQuestion: (question: Question) => void
}

const QUESTION_TYPES = [
  { value: 'text', label: 'Texto Livre' },
  { value: 'radio', label: 'Escolha Única' },
  { value: 'checkbox', label: 'Múltipla Escolha' },
  { value: 'scale', label: 'Escala Numérica' },
  { value: 'slider', label: 'Escala Visual' },
  { value: 'date', label: 'Data' },
  { value: 'file', label: 'Upload de Arquivo' },
  { value: 'yes_no', label: 'Sim/Não/Não Sei' },
  { value: 'facial_complaints', label: 'Queixas Faciais' },
  { value: 'body_complaints', label: 'Queixas Corporais' }
]

const questionSchema = z.object({
  question_text: z.string().min(5, 'A pergunta deve ter pelo menos 5 caracteres'),
  question_type: z.enum(['text', 'radio', 'checkbox', 'scale', 'slider', 'date', 'file', 'yes_no', 'facial_complaints', 'body_complaints']),
  required: z.boolean(),
  options: z.string().optional(),
  placeholder: z.string().optional(),
  max_length: z.number().optional(),
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  step: z.number().optional()
})

type QuestionFormData = z.infer<typeof questionSchema>

export function NewQuestionModal({ onClose, onAddQuestion }: NewQuestionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_text: '',
      question_type: 'text',
      required: false,
      options: '',
      placeholder: '',
      max_length: undefined,
      min_value: 1,
      max_value: 10,
      step: 1
    }
  })

  const watchedType = form.watch('question_type')

  const handleSubmit = async (data: QuestionFormData) => {
    setIsSubmitting(true)
    try {
      // Processar opções se necessário
      let processedOptions = undefined
      if ((data.question_type === 'radio' || data.question_type === 'checkbox') && data.options) {
        const optionsList = data.options.split(';').map(opt => opt.trim()).filter(opt => opt)
        if (optionsList.length === 0) {
          toast.error('Adicione pelo menos uma opção')
          setIsSubmitting(false)
          return
        }
        processedOptions = optionsList.map((opt, index) => ({
          id: `option_${index}`,
          label: opt,
          value: opt.toLowerCase().replace(/\s+/g, '_')
        }))
      }

      // Criar pergunta base
      const questionBase = {
        id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        question_text: data.question_text,
        question_type: data.question_type,
        required: data.required,
        order: 0
      }

      // Criar pergunta específica por tipo
      let question: Question
      
      if (data.question_type === 'text') {
        question = {
          ...questionBase,
          question_type: 'text',
          placeholder: data.placeholder,
          max_length: data.max_length
        }
      } else if (data.question_type === 'radio') {
        question = {
          ...questionBase,
          question_type: 'radio',
          options: processedOptions || []
        }
      } else if (data.question_type === 'checkbox') {
        question = {
          ...questionBase,
          question_type: 'checkbox',
          options: processedOptions || []
        }
      } else if (data.question_type === 'scale') {
        question = {
          ...questionBase,
          question_type: 'scale',
          min_value: data.min_value || 1,
          max_value: data.max_value || 10,
          step: data.step || 1
        }
      } else if (data.question_type === 'slider') {
        question = {
          ...questionBase,
          question_type: 'slider',
          min_value: data.min_value || 1,
          max_value: data.max_value || 10,
          step: data.step || 1
        }
      } else if (data.question_type === 'date') {
        question = {
          ...questionBase,
          question_type: 'date'
        }
      } else if (data.question_type === 'file') {
        question = {
          ...questionBase,
          question_type: 'file',
          accepted_types: ['image/*', 'application/pdf'],
          max_size_mb: 10
        }
      } else if (data.question_type === 'facial_complaints') {
        question = {
          ...questionBase,
          question_type: 'facial_complaints'
        }
      } else if (data.question_type === 'body_complaints') {
        question = {
          ...questionBase,
          question_type: 'body_complaints'
        }
      } else {
        question = {
          ...questionBase,
          question_type: 'yes_no'
        }
      }

      onAddQuestion(question)
      toast.success('Pergunta criada com sucesso!')
      onClose()
    } catch (error) {
      console.error('Erro ao criar pergunta:', error)
      toast.error('Erro ao criar pergunta')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Pergunta</DialogTitle>
          <DialogDescription>
            Crie uma nova pergunta personalizada para seu questionário
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto da Pergunta *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite sua pergunta..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Pergunta *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {QUESTION_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Pergunta Obrigatória</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      O usuário deve responder esta pergunta para continuar
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Configurações específicas por tipo */}
            {watchedType === 'text' && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="placeholder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placeholder</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Digite sua resposta aqui..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite de Caracteres</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 500"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {(watchedType === 'radio' || watchedType === 'checkbox') && (
              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opções (separe por ponto e vírgula: Ex: Opção 1; Opção 2; Opção 3) *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Opção 1; Opção 2; Opção 3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(watchedType === 'scale' || watchedType === 'slider') && (
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="min_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Mínimo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Máximo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="step"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incremento</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Plus className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Criando...' : 'Criar Pergunta'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 