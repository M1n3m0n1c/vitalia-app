'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'

export default function DebugPage() {
  const { user, profile, session, loading, isAuthenticated } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      console.log('Debug - Session check:', { data, error })
      setSessionInfo(data)
    }
    checkSession()
  }, [])

  const handleRefreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession()
    console.log('Debug - Refresh session:', { data, error })
    setSessionInfo(data)
  }

  return (
    <div className='container mx-auto space-y-6 p-6'>
      <h1 className='text-2xl font-bold'>Debug - Estado de Autenticação</h1>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>useAuth Hook</CardTitle>
            <CardDescription>Estado do hook de autenticação</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <p>
              <strong>Loading:</strong> {loading ? 'true' : 'false'}
            </p>
            <p>
              <strong>Is Authenticated:</strong>{' '}
              {isAuthenticated ? 'true' : 'false'}
            </p>
            <p>
              <strong>User ID:</strong> {user?.id || 'null'}
            </p>
            <p>
              <strong>User Email:</strong> {user?.email || 'null'}
            </p>
            <p>
              <strong>Profile Name:</strong> {profile?.full_name || 'null'}
            </p>
            <p>
              <strong>Session:</strong> {session ? 'exists' : 'null'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supabase Session</CardTitle>
            <CardDescription>Sessão direta do Supabase</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <p>
              <strong>Session exists:</strong>{' '}
              {sessionInfo?.session ? 'true' : 'false'}
            </p>
            <p>
              <strong>User ID:</strong>{' '}
              {sessionInfo?.session?.user?.id || 'null'}
            </p>
            <p>
              <strong>User Email:</strong>{' '}
              {sessionInfo?.session?.user?.email || 'null'}
            </p>
            <p>
              <strong>Access Token:</strong>{' '}
              {sessionInfo?.session?.access_token ? 'exists' : 'null'}
            </p>
            <Button onClick={handleRefreshSession} className='mt-4'>
              Refresh Session
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Raw Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className='overflow-auto rounded bg-gray-100 p-4 text-xs'>
            {JSON.stringify(
              {
                user,
                profile,
                session: session ? 'exists' : null,
                sessionInfo,
              },
              null,
              2
            )}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Páginas de Teste</CardTitle>
          <CardDescription>Links para páginas de debug específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/debug/test-existing-questionnaire'}>
              Teste: Questionário Existente
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/debug/test-builder-sync'}>
              Teste: Sincronização Builder
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/debug/test-store-persistence'}>
              Teste: Persistência do Store
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/debug/test-questions'}>
              Teste: Perguntas
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/debug/facial-svg-test'}>
              Teste: SVG Facial
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/debug/body-svg-test'}>
              Teste: SVG Corporal
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/debug/leaflet-face-test'}>
              Teste: Leaflet Face
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
