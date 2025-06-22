#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script de Deploy para Sistema Digital de Anamnese
 * Suporta deploy para staging e produção
 * 
 * Uso:
 * npm run deploy:staging
 * npm run deploy:production
 */

const ENVIRONMENTS = {
  staging: {
    name: 'Staging',
    branch: 'develop',
    url: process.env.STAGING_URL || 'https://vitalia-staging.vercel.app',
    supabaseUrl: process.env.STAGING_SUPABASE_URL,
    supabaseKey: process.env.STAGING_SUPABASE_ANON_KEY
  },
  production: {
    name: 'Produção',
    branch: 'main',
    url: process.env.PRODUCTION_URL || 'https://vitalia-app.vercel.app',
    supabaseUrl: process.env.PRODUCTION_SUPABASE_URL,
    supabaseKey: process.env.PRODUCTION_SUPABASE_ANON_KEY
  }
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

function executeCommand(command, description) {
  log(`Executando: ${description}`, 'info');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} concluído`, 'success');
  } catch (error) {
    log(`❌ Erro ao executar: ${description}`, 'error');
    log(`Comando: ${command}`, 'error');
    log(`Erro: ${error.message}`, 'error');
    process.exit(1);
  }
}

function validateEnvironment(env) {
  const config = ENVIRONMENTS[env];
  if (!config) {
    log(`❌ Ambiente inválido: ${env}. Use 'staging' ou 'production'`, 'error');
    process.exit(1);
  }
  
  if (!config.supabaseUrl || !config.supabaseKey) {
    log(`❌ Variáveis de ambiente não configuradas para ${config.name}`, 'error');
    log('Configure STAGING_SUPABASE_URL/STAGING_SUPABASE_ANON_KEY ou PRODUCTION_SUPABASE_URL/PRODUCTION_SUPABASE_ANON_KEY', 'warning');
    process.exit(1);
  }
  
  return config;
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      log('⚠️ Existem mudanças não commitadas:', 'warning');
      log(status, 'warning');
      
      const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--allow-dirty');
      if (!isDev) {
        log('❌ Commit suas mudanças antes do deploy ou use --allow-dirty', 'error');
        process.exit(1);
      }
    }
  } catch (error) {
    log('❌ Erro ao verificar status do Git', 'error');
    process.exit(1);
  }
}

function runPreDeployChecks() {
  log('🔍 Executando verificações pré-deploy...', 'info');
  
  // Verificar tipos TypeScript
  executeCommand('npm run type-check', 'Verificação de tipos TypeScript');
  
  // Executar linting
  executeCommand('npm run lint', 'Linting do código');
  
  // Executar testes
  executeCommand('npm run test:ci', 'Execução dos testes');
  
  log('✅ Todas as verificações pré-deploy passaram', 'success');
}

function buildApplication(environment) {
  const config = ENVIRONMENTS[environment];
  
  log(`🏗️ Construindo aplicação para ${config.name}...`, 'info');
  
  // Configurar variáveis de ambiente para o build
  const buildEnv = {
    ...process.env,
    NODE_ENV: environment === 'production' ? 'production' : 'staging',
    NEXT_PUBLIC_SUPABASE_URL: config.supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: config.supabaseKey
  };
  
  try {
    execSync('npm run build', { 
      stdio: 'inherit',
      env: buildEnv
    });
    log('✅ Build concluído com sucesso', 'success');
  } catch (error) {
    log('❌ Erro durante o build', 'error');
    process.exit(1);
  }
}

function deployToVercel(environment) {
  const config = ENVIRONMENTS[environment];
  
  log(`🚀 Fazendo deploy para ${config.name}...`, 'info');
  
  if (!process.env.VERCEL_TOKEN) {
    log('❌ VERCEL_TOKEN não configurado', 'error');
    log('Configure o token do Vercel nas variáveis de ambiente', 'warning');
    process.exit(1);
  }
  
  const deployCommand = environment === 'production' 
    ? 'npx vercel --prod --confirm --token $VERCEL_TOKEN'
    : 'npx vercel --confirm --token $VERCEL_TOKEN';
  
  try {
    execSync(deployCommand, { stdio: 'inherit' });
    log(`✅ Deploy para ${config.name} concluído!`, 'success');
    log(`🌐 URL: ${config.url}`, 'info');
  } catch (error) {
    log(`❌ Erro durante deploy para ${config.name}`, 'error');
    process.exit(1);
  }
}

function generateDeployReport(environment, startTime) {
  const config = ENVIRONMENTS[environment];
  const duration = Date.now() - startTime;
  const durationMinutes = Math.round(duration / 1000 / 60 * 100) / 100;
  
  const report = {
    environment: config.name,
    timestamp: new Date().toISOString(),
    duration: `${durationMinutes} minutos`,
    url: config.url,
    branch: config.branch,
    commit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
    version: require('../package.json').version
  };
  
  const reportPath = path.join(__dirname, '..', 'deploy-reports', `${environment}-${Date.now()}.json`);
  
  // Criar diretório se não existir
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log('📊 Relatório de Deploy:', 'info');
  log(`   Ambiente: ${report.environment}`, 'info');
  log(`   Duração: ${report.duration}`, 'info');
  log(`   URL: ${report.url}`, 'info');
  log(`   Commit: ${report.commit.substring(0, 8)}`, 'info');
  log(`   Relatório salvo em: ${reportPath}`, 'info');
}

function main() {
  const startTime = Date.now();
  const environment = process.argv[2];
  
  if (!environment) {
    log('❌ Especifique o ambiente: staging ou production', 'error');
    log('Uso: npm run deploy:staging ou npm run deploy:production', 'info');
    process.exit(1);
  }
  
  const config = validateEnvironment(environment);
  
  log(`🚀 Iniciando deploy para ${config.name}...`, 'info');
  log(`📍 Branch: ${config.branch}`, 'info');
  log(`🌐 URL: ${config.url}`, 'info');
  
  // Verificações pré-deploy
  checkGitStatus();
  runPreDeployChecks();
  
  // Build e deploy
  buildApplication(environment);
  deployToVercel(environment);
  
  // Relatório final
  generateDeployReport(environment, startTime);
  
  log(`🎉 Deploy para ${config.name} concluído com sucesso!`, 'success');
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { main, checkEnvironment: validateEnvironment }; 