/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertCircle, CheckCircle, Info, Star } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function TestShadcnPage() {
  const [progress, setProgress] = useState(33)
  const [switchValue, setSwitchValue] = useState(false)
  const [checkboxValue, setCheckboxValue] = useState(false)

  return (
    <div className='container mx-auto max-w-6xl space-y-8 p-8'>
      <div className='mb-8 text-center'>
        <div className='mb-4 flex items-center justify-between'>
          <div></div>
          <h1 className='text-primary text-4xl font-bold'>
            🎨 Teste ShadCN UI
          </h1>
          <ThemeToggle />
        </div>
        <p className='text-muted-foreground'>
          Testando todos os componentes e estilos do sistema
        </p>
      </div>

      {/* Teste de Cores Base */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Teste de Cores Base</CardTitle>
          <CardDescription>
            Verificando se as variáveis CSS estão funcionando
          </CardDescription>
        </CardHeader>
        <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded bg-blue-500 p-4 text-white'>
            ✅ Tailwind CSS funcionando - Esta caixa deve estar azul
          </div>

          <div className='bg-primary text-primary-foreground rounded p-4'>
            🎯 Teste classes Tailwind - Esta caixa deve ter a cor primária
          </div>

          <div className='bg-secondary text-secondary-foreground rounded p-4'>
            🔹 Teste secundário - Esta caixa deve ter a cor secundária
          </div>

          <div className='bg-muted text-muted-foreground rounded p-4'>
            🔸 Teste muted - Esta caixa deve ter a cor muted
          </div>
        </CardContent>
      </Card>

      {/* Teste de Botões */}
      <Card>
        <CardHeader>
          <CardTitle>🔘 Botões</CardTitle>
          <CardDescription>Diferentes variantes de botões</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-wrap gap-4'>
          <Button variant='default'>Default</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='destructive'>Destructive</Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='link'>Link</Button>
          <Button size='sm'>Small</Button>
          <Button size='lg'>Large</Button>
          <Button disabled>Disabled</Button>
        </CardContent>
      </Card>

      {/* Teste de Formulários */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Formulários</CardTitle>
          <CardDescription>Componentes de entrada de dados</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='name'>Nome</Label>
                <Input id='name' placeholder='Digite seu nome' />
              </div>

              <div>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' placeholder='seu@email.com' />
              </div>

              <div>
                <Label htmlFor='message'>Mensagem</Label>
                <Textarea
                  id='message'
                  placeholder='Digite sua mensagem aqui...'
                />
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <Label htmlFor='select'>Selecione uma opção</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Escolha uma opção' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='option1'>Opção 1</SelectItem>
                    <SelectItem value='option2'>Opção 2</SelectItem>
                    <SelectItem value='option3'>Opção 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-3'>
                <Label>Opções de Radio</Label>
                <RadioGroup defaultValue='option1'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='option1' id='r1' />
                    <Label htmlFor='r1'>Opção 1</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='option2' id='r2' />
                    <Label htmlFor='r2'>Opção 2</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='terms'
                  checked={checkboxValue}
                  onCheckedChange={checked =>
                    setCheckboxValue(checked === true)
                  }
                />
                <Label htmlFor='terms'>Aceito os termos e condições</Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Switch
                  id='notifications'
                  checked={switchValue}
                  onCheckedChange={setSwitchValue}
                />
                <Label htmlFor='notifications'>Receber notificações</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teste de Alertas e Badges */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>🚨 Alertas</CardTitle>
            <CardDescription>Diferentes tipos de alertas</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Alert>
              <Info className='h-4 w-4' />
              <AlertTitle>Informação</AlertTitle>
              <AlertDescription>
                Este é um alerta informativo padrão.
              </AlertDescription>
            </Alert>

            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                Este é um alerta de erro destrutivo.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏷️ Badges e Progress</CardTitle>
            <CardDescription>Indicadores visuais</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-wrap gap-2'>
              <Badge>Default</Badge>
              <Badge variant='secondary'>Secondary</Badge>
              <Badge variant='destructive'>Destructive</Badge>
              <Badge variant='outline'>Outline</Badge>
            </div>

            <Separator />

            <div className='space-y-2'>
              <div className='flex justify-between'>
                <Label>Progresso</Label>
                <span className='text-muted-foreground text-sm'>
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className='w-full' />
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  onClick={() => setProgress(Math.max(0, progress - 10))}
                >
                  -10%
                </Button>
                <Button
                  size='sm'
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                >
                  +10%
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teste de Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>📑 Abas (Tabs)</CardTitle>
          <CardDescription>Organização de conteúdo em abas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='tab1' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='tab1'>Primeira Aba</TabsTrigger>
              <TabsTrigger value='tab2'>Segunda Aba</TabsTrigger>
              <TabsTrigger value='tab3'>Terceira Aba</TabsTrigger>
            </TabsList>
            <TabsContent value='tab1' className='mt-4'>
              <div className='bg-muted rounded-lg p-4'>
                <h3 className='mb-2 font-semibold'>Conteúdo da Primeira Aba</h3>
                <p className='text-muted-foreground'>
                  Este é o conteúdo da primeira aba. Aqui você pode colocar
                  qualquer informação relevante.
                </p>
              </div>
            </TabsContent>
            <TabsContent value='tab2' className='mt-4'>
              <div className='bg-muted rounded-lg p-4'>
                <h3 className='mb-2 font-semibold'>Conteúdo da Segunda Aba</h3>
                <p className='text-muted-foreground'>
                  Este é o conteúdo da segunda aba com informações diferentes.
                </p>
              </div>
            </TabsContent>
            <TabsContent value='tab3' className='mt-4'>
              <div className='bg-muted rounded-lg p-4'>
                <h3 className='mb-2 font-semibold'>Conteúdo da Terceira Aba</h3>
                <p className='text-muted-foreground'>
                  Este é o conteúdo da terceira aba para completar o exemplo.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Teste de Avatar e Card com Footer */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='text-center'>
            <Avatar className='mx-auto mb-4 h-20 w-20'>
              <AvatarImage src='https://github.com/shadcn.png' alt='Avatar' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <CardTitle>João Silva</CardTitle>
            <CardDescription>Desenvolvedor Frontend</CardDescription>
          </CardHeader>
          <CardContent className='text-center'>
            <div className='mb-2 flex justify-center gap-1'>
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className='h-4 w-4 fill-yellow-400 text-yellow-400'
                />
              ))}
            </div>
            <p className='text-muted-foreground text-sm'>
              Especialista em React e Next.js
            </p>
          </CardContent>
          <CardFooter>
            <Button className='w-full'>Ver Perfil</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Estatísticas</CardTitle>
            <CardDescription>Resumo dos dados</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex justify-between'>
              <span>Usuários Ativos</span>
              <Badge>1,234</Badge>
            </div>
            <div className='flex justify-between'>
              <span>Vendas do Mês</span>
              <Badge variant='secondary'>R$ 45,678</Badge>
            </div>
            <div className='flex justify-between'>
              <span>Taxa de Conversão</span>
              <Badge variant='outline'>12.5%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚙️ Configurações</CardTitle>
            <CardDescription>Preferências do sistema</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Label>Tema</Label>
              <ThemeToggle />
            </div>
            <div className='flex items-center justify-between'>
              <Label htmlFor='notifications'>Notificações</Label>
              <Switch id='notifications' defaultChecked />
            </div>
            <div className='flex items-center justify-between'>
              <Label htmlFor='auto-save'>Salvamento Automático</Label>
              <Switch id='auto-save' />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant='outline' className='w-full'>
              Salvar Configurações
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>🐛 Debug Info</CardTitle>
          <CardDescription>Informações para depuração</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='bg-muted space-y-2 rounded p-4 text-sm'>
            <p>
              <strong>Status das Cores:</strong>
            </p>
            <p>
              • Se as caixas coloridas não aparecerem, há problema com as
              variáveis CSS.
            </p>
            <p>
              • Se apenas a azul aparecer, o Tailwind funciona mas as variáveis
              customizadas não.
            </p>
            <p>
              • Se todos os componentes estão estilizados, o ShadCN UI está
              funcionando perfeitamente!
            </p>

            <p className='mt-2'>
              <strong>Teste de Tema:</strong>
            </p>
            <p>
              • Use o botão 🌙/☀️ no cabeçalho para alternar entre modo claro e
              escuro
            </p>
            <p>
              • O ThemeProvider está configurado com suporte a tema do sistema
            </p>

            <div className='mt-4 flex gap-2'>
              <Button
                onClick={() => window.location.reload()}
                variant='outline'
                size='sm'
              >
                🔄 Recarregar Página
              </Button>
              <Button
                onClick={() => console.log('Teste de console')}
                variant='ghost'
                size='sm'
              >
                📝 Teste Console
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
