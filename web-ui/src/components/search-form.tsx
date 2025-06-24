'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar'

export function SearchForm() {
  const [searchQuery, setSearchQuery] = useState('')
  const { isMobile } = useSidebar()

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de busca aqui
    console.log('Buscar por:', searchQuery)
  }

  return (
    <SidebarGroup className='py-0'>
      <SidebarGroupContent className='relative'>
        <form onSubmit={handleSubmit} className='relative'>
          <Label htmlFor='search' className='sr-only'>
            Pesquisar no sistema
          </Label>
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2' />
            <Input
              id='search'
              placeholder='Pesquisar no sistema...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='h-8 pr-8 pl-8'
            />
            {searchQuery && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={handleClearSearch}
                className='absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent'
              >
                <X className='h-3 w-3' />
                <span className='sr-only'>Limpar busca</span>
              </Button>
            )}
          </div>
        </form>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
