import {
  Stethoscope,
  Minus,
  Plus,
  Home,
  Users,
  FileText,
  Calendar,
  ImageIcon,
  BarChart3,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  HelpCircle,
  ChevronDown,
  Activity,
  Database,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { SearchForm } from '@/components/ui/search-form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'

// Tipos para a navegação
type SubItem = {
  title: string
  url: string
}

type NavItem = {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge: string | null
  subItems?: SubItem[]
}

type NavGroup = {
  title: string
  items: NavItem[]
}

// Dados de navegação do sistema organizados por grupos
const data: { navMain: NavGroup[] } = {
  navMain: [
    {
      title: 'Visão Geral',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: Home,
          badge: null,
        },
        {
          title: 'Atividades',
          url: '/dashboard/activities',
          icon: Activity,
          badge: '3',
        },
      ],
    },
    {
      title: 'Gestão Clínica',
      items: [
        {
          title: 'Pacientes',
          url: '/dashboard/patients',
          icon: Users,
          badge: '156',
          subItems: [
            {
              title: 'Lista de Pacientes',
              url: '/dashboard/patients',
            },
            {
              title: 'Novo Paciente',
              url: '/dashboard/patients/new',
            },
          ],
        },
        {
          title: 'Agenda',
          url: '/dashboard/calendar',
          icon: Calendar,
          badge: '8',
        },
      ],
    },
    {
      title: 'Questionários',
      items: [
        {
          title: 'Construtor',
          url: '/dashboard/questionnaires/builder',
          icon: FileText,
          badge: null,
        },
        {
          title: 'Respostas',
          url: '/dashboard/questionnaires/responses',
          icon: Database,
          badge: '42',
        },
      ],
    },
    {
      title: 'Análises',
      items: [
        {
          title: 'Imagens Médicas',
          url: '/dashboard/images',
          icon: ImageIcon,
          badge: null,
          subItems: [
            {
              title: 'Galeria de Imagens',
              url: '/dashboard/images',
            },
            {
              title: 'Comparação',
              url: '/dashboard/comparison',
            },
          ],
        },
        {
          title: 'Queixas Estéticas',
          url: '/dashboard/facial-complaints',
          icon: User,
          badge: null,
        },
        {
          title: 'Relatórios',
          url: '/dashboard/reports',
          icon: BarChart3,
          badge: null,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

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

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/dashboard' className='flex items-center gap-2'>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <Stethoscope className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Vitalia</span>
                  <span className='text-muted-foreground truncate text-xs'>
                    Sistema de Anamnese
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className='px-2 py-2'>
          <SearchForm />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group, index) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className='text-muted-foreground text-xs font-medium'>
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => {
                  const isActive =
                    pathname === item.url ||
                    (item.url !== '/dashboard' && pathname.startsWith(item.url))

                  // Se não tem subitens, renderiza como item simples
                  if (!item.subItems || item.subItems.length === 0) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link
                            href={item.url}
                            className='flex items-center gap-2'
                          >
                            <item.icon className='size-4' />
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge
                                variant='secondary'
                                className='ml-auto h-5 px-1.5 text-xs'
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  }

                  // Se tem subitens, renderiza como collapsible
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={item.subItems.some(
                        subItem => pathname === subItem.url
                      )}
                      className='group/collapsible'
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className='flex items-center gap-2'>
                            <item.icon className='size-4' />
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge
                                variant='secondary'
                                className='ml-auto h-5 px-1.5 text-xs'
                              >
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronDown className='ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180' />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map(subItem => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className='p-2'>
          <Separator className='mb-2' />
          <div className='flex items-center gap-2 rounded-lg border p-2'>
            <div className='flex size-6 items-center justify-center rounded-full bg-emerald-100'>
              <div className='size-2 rounded-full bg-emerald-600' />
            </div>
            <div className='flex-1 text-left text-sm'>
              <div className='font-medium'>Sistema Online</div>
              <div className='text-muted-foreground text-xs'>99.9% uptime</div>
            </div>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarFallback className='rounded-lg bg-blue-50 text-blue-600'>
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      Dr. {profile?.full_name?.split(' ')[0] || 'Médico'}
                    </span>
                    <span className='text-muted-foreground truncate text-xs'>
                      {profile?.email || 'email@exemplo.com'}
                    </span>
                  </div>
                  <ChevronDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarFallback className='rounded-lg bg-blue-50 text-blue-600'>
                        {getInitials(profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>
                        Dr. {profile?.full_name?.split(' ')[0] || 'Médico'}
                      </span>
                      <span className='text-muted-foreground truncate text-xs'>
                        {profile?.email || 'email@exemplo.com'}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className='mr-2 h-4 w-4' />
                  <span>Notificações</span>
                  <Badge
                    variant='secondary'
                    className='ml-auto h-5 px-1.5 text-xs'
                  >
                    3
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className='mr-2 h-4 w-4' />
                  <span>Ajuda & Suporte</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className='text-red-600'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
