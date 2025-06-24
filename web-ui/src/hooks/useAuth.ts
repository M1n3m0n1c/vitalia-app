import { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

import { supabase } from '@/lib/supabase/client'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  crm: string | null
  specialty: string | null
  phone: string | null
  organization_id: string | null
  role: 'doctor' | 'admin'
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  console.log('useAuth hook called')
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
  })
  const router = useRouter()

  const fetchUserProfile = useCallback(
    async (userId: string): Promise<UserProfile | null> => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) {
          console.error(
            '❌ Erro ao buscar perfil do usuário (fetchUserProfile):',
            error
          )
          return null
        }
        console.log('✅ Perfil do usuário buscado (fetchUserProfile):', data)
        return data
      } catch (error) {
        console.error(
          '❌ Erro inesperado ao buscar perfil (fetchUserProfile):',
          error
        )
        return null
      }
    },
    []
  )

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { success: false, error: error.message }
      }

      if (data.user && data.session) {
        const profile = await fetchUserProfile(data.user.id)
        setState({
          user: data.user,
          profile,
          session: data.session,
          loading: false,
          error: null,
        })

        return { success: true, data }
      }

      // Fallback em caso de dados inesperados
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Resposta de login inválida.',
      }))
      return { success: false, error: 'Resposta de login inválida.' }
    } catch (error) {
      const errorMessage = 'Erro inesperado ao fazer login'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    userData: {
      full_name: string
      crm: string
      specialty: string
      phone: string
    }
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { success: false, error: error.message }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { success: true, data }
    } catch (error) {
      const errorMessage = 'Erro inesperado ao criar conta'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { success: false, error: error.message }
      }

      // Limpar estado imediatamente
      setState({
        user: null,
        profile: null,
        session: null,
        loading: false,
        error: null,
      })

      // Redirecionar para login após logout
      router.push('/login')
      return { success: true }
    } catch (error) {
      const errorMessage = 'Erro inesperado ao fazer logout'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) return { success: false, error: 'Usuário não autenticado' }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', state.user.id)
        .select()
        .single()

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { success: false, error: error.message }
      }

      setState(prev => ({
        ...prev,
        profile: data,
        loading: false,
      }))

      return { success: true, data }
    } catch (error) {
      const errorMessage = 'Erro inesperado ao atualizar perfil'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }

  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { success: false, error: error.message }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { success: true }
    } catch (error) {
      const errorMessage = 'Erro inesperado ao enviar e-mail de recuperação'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, error: errorMessage }
    }
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('❌ Erro ao atualizar sessão:', error)
        return { success: false, error: error.message }
      }
      return { success: true, data }
    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar sessão:', error)
      return { success: false, error: 'Erro inesperado ao atualizar sessão' }
    }
  }

  // Inicialização e listener de auth
  useEffect(() => {
    let mounted = true
    console.log('useEffect in useAuth triggered. Initial state:', state)

    const initializeAuth = async () => {
      console.log('initializeAuth called. Current state:', state)
      try {
        // Obter sessão inicial
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('❌ Erro ao obter sessão inicial:', sessionError)
          if (mounted) {
            setState(prev => ({
              ...prev,
              loading: false,
              error: sessionError.message,
            }))
            console.log(
              'State updated: sessionError. New loading:',
              false,
              'profile:',
              null
            )
          }
          return
        }

        let user = null
        if (session) {
          console.log('Session found, attempting to get user...')
          const { data: userData, error: userError } =
            await supabase.auth.getUser()
          if (userError) {
            console.error(
              '❌ Erro ao obter o usuário autenticado na inicialização:',
              userError
            )
            if (mounted) {
              setState(prev => ({
                ...prev,
                loading: false,
                user: null,
                profile: null,
                error: userError.message,
              }))
              console.log(
                'State updated: userError. New loading:',
                false,
                'user:',
                null,
                'profile:',
                null
              )
            }
            return
          }
          user = userData.user
          console.log('User data from getUser (initializeAuth):', user)
        }

        if (user && mounted) {
          console.log('✅ Usuário encontrado, buscando perfil...')
          const profile = await fetchUserProfile(user.id)
          setState({
            user: user,
            profile: profile,
            session: session,
            loading: false,
            error: null,
          })
          console.log(
            'State updated: user and profile found. New loading:',
            false,
            'user:',
            user,
            'profile:',
            profile
          )
        } else if (mounted) {
          console.log(
            'No user or session after initialization. Setting loading to false and nulling user/profile.'
          )
          setState(prev => ({
            ...prev,
            loading: false,
            user: null,
            profile: null,
            session: null,
          }))
          console.log(
            'State updated: no user/session. New loading:',
            false,
            'user:',
            null,
            'profile:',
            null
          )
        }
      } catch (error) {
        console.error('❌ Erro na inicialização (catch):', error)
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Erro na inicialização',
          }))
          console.log(
            'State updated: catch error. New loading:',
            false,
            'profile:',
            null
          )
        }
      }
    }

    initializeAuth()

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log('🔄 Auth state changed:', event, session?.user?.email)
      console.log('Auth state changed - Current state:', state)

      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            console.log(
              '✅ Usuário logado, verificando autenticidade e buscando perfil...'
            )
            const { data: userData, error: userError } =
              await supabase.auth.getUser()
            if (userError) {
              console.error(
                '❌ Erro ao obter o usuário autenticado após login:',
                userError
              )
              setState(prev => ({
                ...prev,
                loading: false,
                user: null,
                profile: null,
                error: userError.message,
              }))
              console.log(
                'State updated: SIGNED_IN userError. New loading:',
                false,
                'user:',
                null,
                'profile:',
                null
              )
              return
            }
            if (userData.user) {
              console.log('User data from getUser (SIGNED_IN):', userData.user)
              const profile = await fetchUserProfile(userData.user.id)
              setState({
                user: userData.user,
                profile,
                session,
                loading: false,
                error: null,
              })
              console.log(
                'State updated: SIGNED_IN user found. New loading:',
                false,
                'user:',
                userData.user,
                'profile:',
                profile
              )
            } else {
              // Caso o getUser() retorne sem usuário (embora improvável para SIGNED_IN com session?.user)
              console.log(
                'getUser returned no user for SIGNED_IN event. Nulling state.'
              )
              setState(prev => ({
                ...prev,
                loading: false,
                user: null,
                profile: null,
                session: null,
                error: 'Usuário não encontrado após login.',
              }))
              console.log(
                'State updated: SIGNED_IN no user from getUser. New loading:',
                false,
                'user:',
                null,
                'profile:',
                null
              )
            }
          } else {
            // Caso session?.user não exista no evento SIGNED_IN (improvável, mas para robustez)
            console.log('SIGNED_IN event with no session.user. Nulling state.')
            setState(prev => ({
              ...prev,
              loading: false,
              user: null,
              profile: null,
              session: null,
              error: 'Sessão inválida ao fazer login.',
            }))
            console.log(
              'State updated: SIGNED_IN no session.user. New loading:',
              false,
              'user:',
              null,
              'profile:',
              null
            )
          }
          break

        case 'SIGNED_OUT':
          console.log('❌ Usuário deslogado')
          setState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            error: null,
          })
          console.log(
            'State updated: SIGNED_OUT. New loading:',
            false,
            'user:',
            null,
            'profile:',
            null
          )
          break

        case 'TOKEN_REFRESHED':
          if (session) {
            console.log('🔄 Token atualizado')
            setState(prev => ({
              ...prev,
              session,
              loading: false,
            }))
            console.log(
              'State updated: TOKEN_REFRESHED. New loading:',
              false,
              'session:',
              session
            )
          }
          break

        default:
          // Para outros eventos, apenas atualizamos a sessão se necessário
          if (session) {
            setState(prev => ({
              ...prev,
              session,
              loading: false,
            }))
            console.log(
              'State updated: default event. New loading:',
              false,
              'session:',
              session
            )
          }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchUserProfile])

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    refreshSession,
    isAuthenticated: !!state.user,
    isDoctor: state.profile?.role === 'doctor',
    isAdmin: state.profile?.role === 'admin',
  }
}
