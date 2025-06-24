'use client'

import {
  Search,
  Plus,
  Filter,
  Calendar,
  Phone,
  Mail,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCpf, formatPhone } from '@/lib/validations/patient'

interface Patient {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  cpf: string | null
  birth_date: string | null
  gender: 'male' | 'female' | 'other' | null
  address: any
  medical_history: string | null
  created_at: string
  updated_at: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface ApiResponse {
  data: Patient[]
  pagination: PaginationInfo
}

export default function PatientsPage() {
  const router = useRouter()

  // Estados
  const [patients, setPatients] = useState<Patient[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState<string>('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)

  // Função para buscar pacientes
  const fetchPatients = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder,
      })

      if (search.trim()) {
        params.append('search', search.trim())
      }

      if (gender && gender !== 'all') {
        params.append('gender', gender)
      }

      const response = await fetch(`/api/patients?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao carregar pacientes')
      }

      const data: ApiResponse = await response.json()
      setPatients(data.data)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [search, gender, sortBy, sortOrder, currentPage])

  // Carregar pacientes quando os filtros mudarem
  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  // Reset página quando filtros mudarem
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [search, gender, sortBy, sortOrder])

  // Função para calcular idade
  const calculateAge = (birthDate: string | null): number | null => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--
    }
    return age
  }

  // Função para obter iniciais do nome
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Função para navegar para edição
  const handleEdit = (patientId: string) => {
    router.push(`/patients/${patientId}/edit`)
  }

  // Função para excluir paciente
  const handleDelete = async (patientId: string, patientName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o paciente ${patientName}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao excluir paciente')
      }

      // Recarregar lista
      fetchPatients()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir paciente')
    }
  }

  return (
    <div className='container mx-auto space-y-6 py-6'>
      {/* Cabeçalho */}
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Pacientes</h1>
          <p className='text-gray-600'>
            Gerencie seus pacientes e suas informações
          </p>
        </div>
        <Button
          onClick={() => router.push('/patients/new')}
          className='flex items-center gap-2'
        >
          <Plus className='h-4 w-4' />
          Novo Paciente
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {/* Busca */}
            <div className='relative'>
              <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
              <Input
                placeholder='Buscar por nome, CPF ou telefone...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                className='pl-10'
              />
            </div>

            {/* Gênero */}
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder='Todos os gêneros' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos os gêneros</SelectItem>
                <SelectItem value='male'>Masculino</SelectItem>
                <SelectItem value='female'>Feminino</SelectItem>
                <SelectItem value='other'>Outro</SelectItem>
              </SelectContent>
            </Select>

            {/* Ordenação */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='created_at'>Data de Cadastro</SelectItem>
                <SelectItem value='full_name'>Nome</SelectItem>
                <SelectItem value='birth_date'>Idade</SelectItem>
              </SelectContent>
            </Select>

            {/* Ordem */}
            <Select
              value={sortOrder}
              onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='desc'>Mais recente</SelectItem>
                <SelectItem value='asc'>Mais antigo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo */}
      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className='flex flex-row items-center space-y-0 pb-2'>
                <Skeleton className='h-12 w-12 rounded-full' />
                <div className='ml-4 space-y-1'>
                  <Skeleton className='h-4 w-[200px]' />
                  <Skeleton className='h-3 w-[150px]' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <Skeleton className='h-3 w-full' />
                  <Skeleton className='h-3 w-[80%]' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : patients.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <div className='space-y-2 text-center'>
              <h3 className='text-lg font-medium text-gray-900'>
                Nenhum paciente encontrado
              </h3>
              <p className='text-gray-600'>
                {search || (gender && gender !== 'all')
                  ? 'Tente ajustar os filtros para encontrar pacientes.'
                  : 'Comece cadastrando seu primeiro paciente.'}
              </p>
              {!search && (!gender || gender === 'all') && (
                <Button
                  onClick={() => router.push('/patients/new')}
                  className='mt-4'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Cadastrar Primeiro Paciente
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Grid de Pacientes */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {patients.map(patient => {
              const age = calculateAge(patient.birth_date)

              return (
                <Card
                  key={patient.id}
                  className='transition-shadow hover:shadow-lg'
                >
                  <CardHeader className='flex flex-row items-center space-y-0 pb-2'>
                    <Avatar className='h-12 w-12'>
                      <AvatarFallback className='bg-blue-100 text-blue-600'>
                        {getInitials(patient.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='ml-4 flex-1'>
                      <h3 className='text-lg font-semibold'>
                        {patient.full_name}
                      </h3>
                      <div className='flex items-center gap-2'>
                        {age && (
                          <span className='text-sm text-gray-600'>
                            {age} anos
                          </span>
                        )}
                        {patient.gender && (
                          <Badge variant='secondary' className='text-xs'>
                            {patient.gender === 'male'
                              ? 'M'
                              : patient.gender === 'female'
                                ? 'F'
                                : 'O'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className='space-y-2'>
                    {patient.email && (
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <Mail className='h-4 w-4' />
                        <span className='truncate'>{patient.email}</span>
                      </div>
                    )}

                    {patient.phone && (
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <Phone className='h-4 w-4' />
                        <span>{formatPhone(patient.phone)}</span>
                      </div>
                    )}

                    {patient.cpf && (
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <span className='font-mono'>
                          {formatCpf(patient.cpf)}
                        </span>
                      </div>
                    )}

                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                      <Calendar className='h-4 w-4' />
                      <span>
                        Cadastrado em{' '}
                        {new Date(patient.created_at).toLocaleDateString(
                          'pt-BR'
                        )}
                      </span>
                    </div>

                    {/* Ações */}
                    <div className='flex gap-2 pt-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEdit(patient.id)}
                        className='flex-1'
                      >
                        <Edit className='mr-1 h-4 w-4' />
                        Editar
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          handleDelete(patient.id, patient.full_name)
                        }
                        className='text-red-600 hover:bg-red-50 hover:text-red-700'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <Card>
              <CardContent className='flex items-center justify-between py-4'>
                <div className='text-sm text-gray-600'>
                  Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{' '}
                  de {pagination.total} pacientes
                </div>

                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCurrentPage(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                  >
                    <ChevronLeft className='h-4 w-4' />
                    Anterior
                  </Button>

                  <span className='px-3 text-sm font-medium'>
                    Página {pagination.page} de {pagination.totalPages}
                  </span>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCurrentPage(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Próxima
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
