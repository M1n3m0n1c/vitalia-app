'use client'

import { User, Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obter sessão inicial
    const getInitialSession = async () => {
      console.log('🔄 AuthProvider - Obtendo sessão inicial...')
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('❌ AuthProvider - Erro ao obter sessão:', error)
      } else {
        console.log(
          '✅ AuthProvider - Sessão inicial:',
          session?.user?.email || 'nenhuma'
        )
        setSession(session)
        setUser(session?.user ?? null)
      }

      setLoading(false)
    }

    getInitialSession()

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        '🔄 AuthProvider - Auth state changed:',
        event,
        session?.user?.email
      )

      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Forçar refresh da página em mudanças críticas para sincronizar cookies
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        console.log(
          '🔄 AuthProvider - Forçando refresh para sincronizar cookies...'
        )
        // Aguardar um pouco para os cookies serem definidos
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
