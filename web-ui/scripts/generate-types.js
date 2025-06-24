#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Verificar se as variáveis de ambiente estão configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente do Supabase não configuradas')
  console.log('📝 Configure as seguintes variáveis no arquivo .env.local:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here')
  process.exit(1)
}

const projectId = supabaseUrl.split('//')[1].split('.')[0]

console.log('🔄 Gerando tipos TypeScript do Supabase...')
console.log(`📡 Projeto: ${projectId}`)

try {
  // Gerar tipos usando a CLI do Supabase
  const command = `npx supabase gen types typescript --project-id ${projectId} > src/lib/supabase/database.types.ts`

  console.log('⚡ Executando comando:', command)
  execSync(command, { stdio: 'inherit' })

  console.log('✅ Tipos TypeScript gerados com sucesso!')
  console.log('📁 Arquivo: src/lib/supabase/database.types.ts')

  // Verificar se o arquivo foi criado
  const typesPath = path.join(
    __dirname,
    '../src/lib/supabase/database.types.ts'
  )
  if (fs.existsSync(typesPath)) {
    const stats = fs.statSync(typesPath)
    console.log(`📊 Tamanho do arquivo: ${Math.round(stats.size / 1024)}KB`)
    console.log(`🕒 Última modificação: ${stats.mtime.toLocaleString()}`)
  }
} catch (error) {
  console.error('❌ Erro ao gerar tipos:', error.message)
  console.log('\n💡 Dicas para resolver:')
  console.log('   1. Verifique se o projeto Supabase existe')
  console.log('   2. Confirme se as variáveis de ambiente estão corretas')
  console.log('   3. Certifique-se de ter acesso ao projeto no Supabase')
  process.exit(1)
}

console.log('\n🎉 Processo concluído!')
console.log('💻 Agora você pode usar os tipos TypeScript em seu código.')
