#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Estilização simples de terminal sem dependências externas (ANSI colors)
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

function banner() {
  log('\n========================================', colors.cyan);
  log('   🔧 GBIT-FIX — Auto Repair & Start   ', colors.bright + colors.cyan);
  log('========================================\n', colors.cyan);
}

// Procura recursivamente o package.json nas subpastas mais comuns caso não esteja na raiz atual
function findProjectDirectory(baseDir) {
  if (fs.existsSync(path.join(baseDir, 'package.json'))) {
    return baseDir;
  }

  const commonSubdirs = ['frontend', 'backend', 'server', 'client', 'app', 'api'];
  for (const sub of commonSubdirs) {
    const candidate = path.join(baseDir, sub);
    if (fs.existsSync(candidate) && fs.existsSync(path.join(candidate, 'package.json'))) {
      log(`🔎 'package.json' encontrado na subpasta: ./${sub}`, colors.yellow);
      return candidate;
    }
  }

  return null;
}

// Remove arquivos e diretórios com segurança (cross-platform)
function removePath(targetPath) {
  if (fs.existsSync(targetPath)) {
    log(`🗑️  Removendo: ${path.basename(targetPath)}...`, colors.dim);
    try {
      fs.rmSync(targetPath, { recursive: true, force: true });
    } catch (err) {
      // Fallback para caso ocorra erro no Windows
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${targetPath}"`, { stdio: 'ignore' });
      } else {
        execSync(`rm -rf "${targetPath}"`, { stdio: 'ignore' });
      }
    }
  }
}

// Analisa as scripts e define o melhor comando de inicialização
function detectStartCommand(pkgJsonPath) {
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  const scripts = pkg.scripts || {};

  if (scripts.dev) return 'npm run dev';
  if (scripts.start) return 'npm start';
  if (scripts.serve) return 'npm run serve';
  if (scripts.build) return 'npm run build';
  
  if (pkg.main && fs.existsSync(path.join(path.dirname(pkgJsonPath), pkg.main))) {
    return `node ${pkg.main}`;
  }

  if (fs.existsSync(path.join(path.dirname(pkgJsonPath), 'server.js'))) {
    return 'node server.js';
  }

  if (fs.existsSync(path.join(path.dirname(pkgJsonPath), 'index.js'))) {
    return 'node index.js';
  }

  return null;
}

async function runFix() {
  banner();

  const currentDir = process.cwd();
  const targetDir = findProjectDirectory(currentDir);

  if (!targetDir) {
    log('❌ Erro: Nenhum arquivo package.json encontrado no diretório atual ou nas pastas comuns (frontend/backend).', colors.red);
    process.exit(1);
  }

  log(`📂 Diretório do Projeto: ${targetDir}`, colors.bright);

  // 1. Limpeza do ambiente corrompido
  log('\n🧹 Limpando cache e arquivos corrompidos...', colors.yellow);
  removePath(path.join(targetDir, 'node_modules'));
  removePath(path.join(targetDir, 'package-lock.json'));
  removePath(path.join(targetDir, 'yarn.lock'));
  removePath(path.join(targetDir, 'pnpm-lock.yaml'));

  try {
    log('⚡ Limpando npm cache...', colors.dim);
    execSync('npm cache clean --force', { cwd: targetDir, stdio: 'ignore' });
  } catch (e) {
    // Ignora erros menores no cache clean
  }

  // 2. Instalação das dependências
  log('\n📦 Instalando dependências (Tentativa Padrão)...', colors.cyan);
  let installSuccess = false;

  try {
    execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
    installSuccess = true;
    log('✅ Dependências instaladas com sucesso!', colors.green);
  } catch (error) {
    log('\n⚠️ Falha na instalação padrão devido a conflitos de versões/peer dependencies.', colors.yellow);
    log('🔄 Tentando novamente com "--legacy-peer-deps"...', colors.yellow);

    try {
      execSync('npm install --legacy-peer-deps', { cwd: targetDir, stdio: 'inherit' });
      installSuccess = true;
      log('✅ Dependências instaladas com sucesso usando --legacy-peer-deps!', colors.green);
    } catch (legacyErr) {
      log('❌ Falha ao instalar dependências mesmo com --legacy-peer-deps.', colors.red);
      process.exit(1);
    }
  }

  // 3. Descobrir e Rodar o Comando do Projeto
  const pkgPath = path.join(targetDir, 'package.json');
  const startCmd = detectStartCommand(pkgPath);

  if (!startCmd) {
    log('⚠️ Nenhum comando de start (dev, start, server.js) foi identificado no package.json.', colors.yellow);
    log('✅ As dependências foram corrigidas com sucesso!', colors.green);
    process.exit(0);
  }

  log(`\n🚀 Inicializando o projeto com: "${startCmd}"...`, colors.bright + colors.green);
  log('🌐 Verifique o terminal abaixo para a URL de acesso no seu navegador.\n', colors.cyan);

  // Dividir o comando em binário e argumentos para o spawn
  const [cmd, ...args] = startCmd.split(' ');

  const runner = spawn(cmd, args, {
    cwd: targetDir,
    stdio: 'inherit',
    shell: true
  });

  runner.on('error', (err) => {
    log(`❌ Erro ao iniciar o servidor: ${err.message}`, colors.red);
  });
}

runFix();