import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key-for-build'

if (
  process.env.NODE_ENV !== 'development' &&
  (!supabaseUrl || !supabaseServiceRoleKey)
) {
  throw new Error('Missing Supabase server environment variables')
}

// Cliente administrativo - apenas para uso no servidor
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Função para criar cliente Supabase server com autenticação via cookies
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key',
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Função para criar usuário administrativamente
export const createUserAdmin = async (
  email: string,
  password: string,
  metadata?: any
) => {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  })
  return { data, error }
}

// Função para listar usuários (admin)
export const listUsers = async (page = 1, perPage = 50) => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page,
    perPage,
  })
  return { data, error }
}

// Função para deletar usuário (admin)
export const deleteUser = async (userId: string) => {
  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  return { data, error }
}
