#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n🔄 ${description}...`, 'blue');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} concluído!`, 'green');
  } catch (error) {
    log(`❌ Erro ao executar: ${description}`, 'red');
    process.exit(1);
  }
}

function checkEnvironment() {
  log('\n🔍 Verificando variáveis de ambiente...', 'blue');
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    log(`❌ Variáveis de ambiente faltando: ${missingVars.join(', ')}`, 'red');
    log('📝 Crie um arquivo .env.local com as variáveis necessárias', 'yellow');
    process.exit(1);
  }
  
  log('✅ Variáveis de ambiente OK!', 'green');
}

function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || 'development';
  
  log('🚀 Iniciando processo de deploy...', 'blue');
  log(`📦 Ambiente: ${environment}`, 'yellow');
  
  // Verificar variáveis de ambiente
  checkEnvironment();
  
  // Executar verificações pré-deploy
  runCommand('npm run type-check', 'Verificação de tipos TypeScript');
  runCommand('npm run lint', 'Verificação de linting');
  runCommand('npm run format:check', 'Verificação de formatação');
  runCommand('npm run test:ci', 'Execução de testes');
  
  // Build da aplicação
  runCommand('npm run build', 'Build da aplicação');
  
  // Gerar tipos do Supabase
  runCommand('npm run db:types', 'Geração de tipos do banco de dados');
  
  if (environment === 'production') {
    log('\n🔐 Deploy de produção detectado!', 'yellow');
    log('⚠️  Certifique-se de que todas as migrações foram aplicadas', 'yellow');
    log('⚠️  Verifique se o backup do banco foi realizado', 'yellow');
    
    // Aqui seria integrado com serviços como Vercel, Netlify, etc.
    log('\n🚀 Deploy para produção seria executado aqui', 'green');
  } else if (environment === 'staging') {
    log('\n🧪 Deploy para staging...', 'yellow');
    // Deploy para ambiente de staging
    log('\n🚀 Deploy para staging seria executado aqui', 'green');
  } else {
    log('\n💻 Ambiente de desenvolvimento configurado!', 'green');
    log('🔧 Execute "npm run dev" para iniciar o servidor local', 'blue');
  }
  
  log('\n✨ Deploy concluído com sucesso!', 'green');
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { main, checkEnvironment }; 