<div align="center">

# 🔧 GBIT-FIX CLI

### *Auto-repair, dependency conflict resolver & smart launcher for Node.js projects.*

![npm version](https://img.shields.io/npm/v/gbit-fix?color=8b6cff&style=for-the-badge)
![npm downloads](https://img.shields.io/npm/dm/gbit-fix?color=08c0ff&style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-3ddc84?style=for-the-badge)
![Node Support](https://img.shields.io/badge/node-%3E%3D14.0.0-ff61ef?style=for-the-badge)

<br/>

```bash
npx gbit-fix


📸 O Problema
Quem nunca clonou um repositório ou abriu um projeto antigo e se deparou com:

❌ node_modules corrompido ou quebrado

❌ Erros de conflito de versão (peer dependencies)

❌ Dúvida se deve rodar na raiz, no /frontend ou no /backend

❌ Ter que rodar manualmente 5 comandos no terminal para limpar e reiniciar

🚀 A Solução: gbit-fix

O gbit-fix é uma CLI inteligente parte do Ecossistema GBIT. Com um único comando, ele analisa o projeto, limpa arquivos corrompidos, resolve conflitos de dependência automaticamente e inicia o servidor do seu app!

========================================
     🔧 GBIT-FIX — Auto Repair & Start   
  ========================================

  🔎 'package.json' encontrado em: ./frontend
  📂 Diretório do Projeto: /meu-projeto/frontend
  
  🧹 Limpando cache e arquivos corrompidos...
  🗑️  Removendo: node_modules...
  🗑️  Removendo: package-lock.json...
  ⚡ Limpando npm cache...
  
  📦 Instalando dependências (Tentativa Padrão)...
  ⚠️ Falha na instalação padrão (Peer Dependency Conflict).
  🔄 Tentando novamente com "--legacy-peer-deps"...
  ✅ Dependências instaladas com sucesso!
  
  🚀 Inicializando o projeto com: "npm run dev"...
  🌐 Servidor rodando! Abra a URL no seu navegador.


  ✨ FuncionalidadesÍconeRecursosDescrição🔍Detecção InteligenteLocaliza automaticamente o package.json na raiz ou em pastas como /frontend, /backend, /server, /client.🧹Deep Clean & PurgeRemove node_modules, package-lock.json, yarn.lock, pnpm-lock.yaml e limpa o cache do NPM (--force).🛡️Auto Fallback FixTenta a instalação normal do NPM. Se houver conflitos de versão, executa --legacy-peer-deps automaticamente.🎯Smart Start StrategyDetecta scripts de inicialização (dev, start, serve, server.js) e sobe o app imediatamente.🌐Cross-PlatformFunciona perfeitamente em Windows, macOS e Linux.
  
  
🛠️ Como Usar

Execução Direta (Recomendado)
Não precisa instalar nada globalmente, basta rodar na pasta do seu projeto:

```bash
npx gbit-fix
```

Instalação Global (Opcional)
Se preferir ter o comando sempre disponível no seu terminal:

```bash
npm install -g gbit-fix
```