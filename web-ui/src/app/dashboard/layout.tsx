'use client'

import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const getBreadcrumbItems = () => {
    const segments = pathname.split('/').filter(Boolean)
    const items = []
    
    // Sempre começa com Sistema Vitalia
    items.push({
      label: 'Sistema Vitalia',
      href: '/dashboard',
      isCurrent: false
    })
    
    // Adiciona segmentos dinâmicos
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i]
      const href = '/' + segments.slice(0, i + 1).join('/')
      const isCurrent = i === segments.length - 1
      
      // Mapeia segmentos para labels mais amigáveis
      const labelMap: Record<string, string> = {
        'questionnaires': 'Questionários',
        'patients': 'Pacientes',
        'calendar': 'Calendário',
        'images': 'Imagens',
        'comparison': 'Comparação',
        'facial-complaints': 'Queixas Faciais',
        'builder': 'Construtor',
        'questions': 'Perguntas',
        'new': 'Novo',
        'edit': 'Editar'
      }
      
      items.push({
        label: labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isCurrent ? undefined : href,
        isCurrent
      })
    }
    
    return items
  }
  
  const breadcrumbItems = getBreadcrumbItems()
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator
            orientation='vertical'
            className='mr-2 data-[orientation=vertical]:h-4'
          />
          {mounted && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator className='hidden md:block' />}
                    <BreadcrumbItem className='hidden md:block'>
                      {item.isCurrent ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href!}>
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
          <div className='ml-auto'>
            <ThemeToggle />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
