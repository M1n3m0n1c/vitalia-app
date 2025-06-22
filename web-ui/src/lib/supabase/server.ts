import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase server environment variables')
}

// Cliente administrativo - apenas para uso no servidor
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Função para criar usuário administrativamente
export const createUserAdmin = async (email: string, password: string, metadata?: any) => {
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