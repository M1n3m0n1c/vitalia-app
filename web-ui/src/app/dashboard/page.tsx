'use client'

import {
  Users,
  FileText,
  Calendar,
  ImageIcon,
  BarChart3,
  Plus,
  TrendingUp,
  Clock,
  Activity,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Star,
  Eye,
  Download,
} from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'

const stats = [
  {
    name: 'Total de Pacientes',
    value: '156',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    href: '/dashboard/patients',
  },
  {
    name: 'Questionários Ativos',
    value: '23',
    change: '+5%',
    changeType: 'positive',
    icon: FileText,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    href: '/dashboard/questionnaires',
  },
  {
    name: 'Consultas Hoje',
    value: '8',
    change: '+2',
    changeType: 'positive',
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    href: '/dashboard/calendar',
  },
  {
    name: 'Imagens Analisadas',
    value: '89',
    change: '+18%',
    changeType: 'positive',
    icon: ImageIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    href: '/dashboard/images',
  },
]

const quickActions = [
  {
    name: 'Novo Paciente',
    description: 'Cadastrar um novo paciente no sistema',
    icon: Users,
    href: '/dashboard/patients/new',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Criar Questionário',
    description: 'Criar um novo questionário personalizado',
    icon: FileText,
    href: '/dashboard/questionnaires/builder',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    name: 'Agendar Consulta',
    description: 'Agendar uma nova consulta',
    icon: Calendar,
    href: '/dashboard/calendar',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Análise de Imagem',
    description: 'Fazer upload e análise de imagens',
    icon: ImageIcon,
    href: '/dashboard/images',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
]

const recentActivity = [
  {
    id: 1,
    type: 'patient',
    title: 'Novo paciente cadastrado',
    description: 'Maria Silva foi adicionada ao sistema',
    time: '2 horas atrás',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 2,
    type: 'questionnaire',
    title: 'Questionário respondido',
    description: 'Avaliação Inicial - João Santos',
    time: '4 horas atrás',
    icon: CheckCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 3,
    type: 'appointment',
    title: 'Consulta agendada',
    description: 'Amanhã às 14:00 - Ana Costa',
    time: '1 dia atrás',
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 4,
    type: 'image',
    title: 'Imagem analisada',
    description: 'Análise facial concluída',
    time: '2 dias atrás',
    icon: Eye,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
]

const upcomingAppointments = [
  {
    id: 1,
    patient: 'Maria Silva',
    time: '09:00',
    type: 'Consulta Inicial',
    avatar: 'MS',
  },
  {
    id: 2,
    patient: 'João Santos',
    time: '10:30',
    type: 'Retorno',
    avatar: 'JS',
  },
  {
    id: 3,
    patient: 'Ana Costa',
    time: '14:00',
    type: 'Avaliação',
    avatar: 'AC',
  },
]

export default function DashboardPage() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
          <p className='text-muted-foreground text-sm'>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Bem-vindo, Dr. {profile?.full_name?.split(' ')[0] || 'Doutor'}!
          </h1>
          <p className='text-muted-foreground mt-1'>
            Aqui está um resumo das suas atividades médicas de hoje.
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Badge variant='secondary' className='text-xs'>
            <Activity className='mr-1 h-3 w-3' />
            Sistema Ativo
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map(stat => (
          <Card
            key={stat.name}
            className={`cursor-pointer transition-shadow hover:shadow-md ${stat.borderColor} border-l-4`}
          >
            <Link href={stat.href}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-muted-foreground text-sm font-medium'>
                  {stat.name}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stat.value}</div>
                <div className='text-muted-foreground flex items-center text-xs'>
                  <TrendingUp className='mr-1 h-3 w-3 text-emerald-600' />
                  <span className='font-medium text-emerald-600'>
                    {stat.change}
                  </span>
                  <span className='ml-1'>desde o último mês</span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Quick Actions */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Plus className='mr-2 h-5 w-5' />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades mais utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2'>
              {quickActions.map(action => (
                <Link key={action.name} href={action.href}>
                  <div className='hover:bg-accent group flex cursor-pointer items-center space-x-4 rounded-lg border p-4 transition-colors'>
                    <div
                      className={`rounded-lg p-2 ${action.bgColor} transition-transform group-hover:scale-110`}
                    >
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='text-sm font-medium'>{action.name}</p>
                      <p className='text-muted-foreground truncate text-xs'>
                        {action.description}
                      </p>
                    </div>
                    <ArrowUpRight className='text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors' />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Clock className='mr-2 h-5 w-5' />
              Consultas de Hoje
            </CardTitle>
            <CardDescription>Próximas consultas agendadas</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {upcomingAppointments.map((appointment, index) => (
              <div key={appointment.id} className='flex items-center space-x-3'>
                <Avatar className='h-8 w-8'>
                  <AvatarFallback className='bg-blue-50 text-xs text-blue-600'>
                    {appointment.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>
                    {appointment.patient}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    {appointment.type}
                  </p>
                </div>
                <Badge variant='outline' className='text-xs'>
                  {appointment.time}
                </Badge>
              </div>
            ))}
            <Separator />
            <Button variant='outline' size='sm' className='w-full'>
              <Calendar className='mr-2 h-4 w-4' />
              Ver Agenda Completa
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Activity className='mr-2 h-5 w-5' />
              Atividade Recente
            </CardTitle>
            <CardDescription>Últimas atividades do sistema</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {recentActivity.map(activity => (
              <div key={activity.id} className='flex items-start space-x-3'>
                <div className={`rounded-lg p-2 ${activity.bgColor} mt-0.5`}>
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-medium'>{activity.title}</p>
                  <p className='text-muted-foreground text-xs'>
                    {activity.description}
                  </p>
                  <p className='text-muted-foreground mt-1 text-xs'>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <BarChart3 className='mr-2 h-5 w-5' />
              Status do Sistema
            </CardTitle>
            <CardDescription>Métricas de desempenho e uso</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Armazenamento</span>
                <span className='text-muted-foreground'>2.1GB / 10GB</span>
              </div>
              <Progress value={21} className='h-2' />
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Questionários Ativos</span>
                <span className='text-muted-foreground'>23 / 50</span>
              </div>
              <Progress value={46} className='h-2' />
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Pacientes Cadastrados</span>
                <span className='text-muted-foreground'>156 / 500</span>
              </div>
              <Progress value={31} className='h-2' />
            </div>

            <Separator />

            <div className='grid grid-cols-2 gap-4 text-center'>
              <div>
                <div className='text-2xl font-bold text-emerald-600'>99.9%</div>
                <div className='text-muted-foreground text-xs'>Uptime</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-blue-600'>1.2s</div>
                <div className='text-muted-foreground text-xs'>Tempo Resp.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
