'use client'

import { User, Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase/client'
import { logger } from '@/lib/utils/logger'

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
      logger.debug('Obtendo sessão inicial...', undefined, 'AuthProvider')
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        logger.error('Erro ao obter sessão', error, 'AuthProvider')
      } else {
        logger.info(
          'Sessão inicial obtida',
          { email: session?.user?.email || 'nenhuma' },
          'AuthProvider'
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
      logger.debug(
        'Auth state changed',
        { event, email: session?.user?.email },
        'AuthProvider'
      )

      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Forçar refresh da página em mudanças críticas para sincronizar cookies
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        logger.info(
          'Forçando refresh para sincronizar cookies',
          { event },
          'AuthProvider'
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
