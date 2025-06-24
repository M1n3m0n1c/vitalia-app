'use client'

import {
  Calendar,
  FileText,
  Users,
  ImageIcon,
  BarChart3,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Stethoscope,
  Home,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Pacientes',
    href: '/patients',
    icon: Users,
  },
  {
    name: 'Questionários',
    href: '/questionnaires',
    icon: FileText,
  },
  {
    name: 'Agenda',
    href: '/calendar',
    icon: Calendar,
  },
  {
    name: 'Imagens',
    href: '/images',
    icon: ImageIcon,
  },
  {
    name: 'Comparação',
    href: '/comparison',
    icon: BarChart3,
  },
  {
    name: 'Queixas Estéticas',
    href: '/facial-complaints',
    icon: User,
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { profile, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    try {
      const result = await signOut()
      if (result.success) {
        toast.success('Logout realizado com sucesso!')
      } else {
        toast.error('Erro ao fazer logout', {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error('Erro inesperado ao fazer logout')
    }
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
          <p className='text-muted-foreground text-sm'>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className='fixed inset-0 z-50 md:hidden'>
          <div
            className='bg-opacity-50 fixed inset-0 bg-black'
            onClick={() => setSidebarOpen(false)}
          />
          <div className='relative flex h-full w-64 flex-col bg-white shadow-xl'>
            <div className='flex items-center justify-between border-b p-4'>
              <div className='flex items-center space-x-2'>
                <Stethoscope className='h-8 w-8 text-blue-600' />
                <span className='text-foreground text-xl font-bold'>
                  Vitalia
                </span>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSidebarOpen(false)}
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className='hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col'>
        <div className='bg-background flex min-h-0 flex-1 flex-col border border-r'>
          <div className='flex h-16 items-center border border-b px-4'>
            <div className='flex items-center space-x-2'>
              <Stethoscope className='h-8 w-8 text-blue-600' />
              <span className='text-foreground text-xl font-bold'>Vitalia</span>
            </div>
          </div>
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className='md:pl-64'>
        {/* Mobile header */}
        <div className='bg-background sticky top-0 z-40 flex h-16 items-center gap-x-4 border border-b px-4 md:hidden'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className='h-6 w-6' />
          </Button>
          <div className='flex items-center space-x-2'>
            <Stethoscope className='h-6 w-6 text-blue-600' />
            <span className='text-foreground text-lg font-semibold'>
              Vitalia
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className='py-6'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            {children}
          </div>
        </main>
      </div>
    </div>
  )

  function Sidebar() {
    return (
      <div className='flex flex-1 flex-col overflow-y-auto'>
        {/* Navigation */}
        <nav className='flex-1 space-y-1 p-4'>
          {navigation.map(item => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-r-2 border-blue-600 bg-blue-50 text-blue-700'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive
                      ? 'text-blue-600'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User profile */}
        <div className='border border-t p-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='h-auto w-full justify-start p-0'
              >
                <div className='flex w-full items-center space-x-3'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src='' alt='' />
                    <AvatarFallback className='bg-blue-100 text-sm text-blue-600'>
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 text-left'>
                    <p className='text-foreground truncate text-sm font-medium'>
                      {profile?.full_name || 'Usuário'}
                    </p>
                    <p className='text-muted-foreground truncate text-xs'>
                      {profile?.specialty || 'Médico'}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href='/profile' className='flex items-center'>
                  <Settings className='mr-2 h-4 w-4' />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className='text-red-600 focus:text-red-600'
              >
                <LogOut className='mr-2 h-4 w-4' />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }
}
