'use client'

import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  FileText, 
  Calendar, 
  Image, 
  BarChart3, 
  Plus,
  TrendingUp,
  Clock
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    name: 'Total de Pacientes',
    value: '0',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    href: '/patients',
  },
  {
    name: 'Questionários Ativos',
    value: '0',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    href: '/questionnaires',
  },
  {
    name: 'Consultas Hoje',
    value: '0',
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    href: '/calendar',
  },
  {
    name: 'Imagens Médicas',
    value: '0',
    icon: Image,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    href: '/images',
  },
]

const quickActions = [
  {
    name: 'Novo Paciente',
    description: 'Cadastrar um novo paciente no sistema',
    icon: Users,
    href: '/patients/new',
    color: 'text-blue-600',
  },
  {
    name: 'Criar Questionário',
    description: 'Criar um novo questionário personalizado',
    icon: FileText,
    href: '/questionnaires/builder',
    color: 'text-green-600',
  },
  {
    name: 'Agendar Consulta',
    description: 'Agendar uma nova consulta',
    icon: Calendar,
    href: '/calendar/new',
    color: 'text-purple-600',
  },
  {
    name: 'Upload de Imagem',
    description: 'Fazer upload de imagens médicas',
    icon: Image,
    href: '/images/upload',
    color: 'text-orange-600',
  },
]

const recentActivity = [
  {
    id: 1,
    type: 'patient',
    description: 'Novo paciente cadastrado: Maria Silva',
    time: '2 horas atrás',
    icon: Users,
  },
  {
    id: 2,
    type: 'questionnaire',
    description: 'Questionário "Avaliação Inicial" foi respondido',
    time: '4 horas atrás',
    icon: FileText,
  },
  {
    id: 3,
    type: 'appointment',
    description: 'Consulta agendada para amanhã às 14:00',
    time: '1 dia atrás',
    icon: Calendar,
  },
]

export default function DashboardPage() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bem-vindo, {profile?.full_name || 'Doutor'}!
          </h1>
          <p className="text-gray-600">
            Aqui está um resumo das suas atividades médicas hoje.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Acesse rapidamente as funcionalidades mais usadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action) => (
                <Link key={action.name} href={action.href}>
                  <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex-shrink-0">
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{action.name}</p>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Últimas atividades do seu sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="flex-shrink-0">
                        <activity.icon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">
                    Nenhuma atividade recente ainda.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Comece cadastrando seu primeiro paciente!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Primeiros Passos
            </CardTitle>
            <CardDescription>
              Configure seu sistema para começar a usar todas as funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Cadastre Pacientes</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Adicione seus pacientes ao sistema
                </p>
                <Button size="sm" asChild>
                  <Link href="/patients/new">Começar</Link>
                </Button>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Crie Questionários</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Monte questionários personalizados
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/questionnaires/builder">Criar</Link>
                </Button>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Configure Agenda</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Organize seus horários
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/calendar">Ver Agenda</Link>
                </Button>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Image className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Banco de Imagens</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Organize imagens médicas
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/images">Explorar</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 