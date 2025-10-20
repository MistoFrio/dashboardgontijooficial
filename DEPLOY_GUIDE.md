# 🚀 Guia de Deploy no Netlify

## Problema Identificado

O erro `TypeError - object is not iterable (cannot read property Symbol(Symbol.iterator))` ocorre quando o Next.js não está configurado corretamente para o ambiente serverless do Netlify.

## ✅ Solução Implementada

### 1. Arquivos Criados/Modificados

- ✅ `netlify.toml` - Configuração do Netlify
- ✅ `next.config.mjs` - Ajustes para compatibilidade
- ✅ `app/layout.tsx` - Correções no carregamento de fontes
- ✅ `package.json` - Plugin do Netlify adicionado
- ✅ `public/_headers` - Cabeçalhos de segurança

### 2. Passo a Passo para Deploy

#### Opção 1: Deploy Automático (Recomendado)

1. **Commit e Push**
   ```bash
   git add .
   git commit -m "fix: Configuração para deploy no Netlify"
   git push origin main
   ```

2. **No Netlify Dashboard:**
   - O site será reconstruído automaticamente
   - Aguarde o build completar (3-5 minutos)

#### Opção 2: Deploy Manual

1. **Instalar dependências localmente:**
   ```bash
   npm install
   ```

2. **Build local (opcional para testar):**
   ```bash
   npm run build
   ```

3. **No Netlify Dashboard:**
   - Vá em **Deploys**
   - Clique em **Trigger deploy**
   - Selecione **Clear cache and deploy site**

### 3. Configurações no Netlify

#### Build Settings
Verifique se as configurações estão corretas:

```
Build command: npm run build
Publish directory: .next
```

#### Environment Variables
Configure as variáveis de ambiente no painel do Netlify:

1. Vá em **Site settings** > **Environment variables**
2. Adicione:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://vtoxvhdjsgvtzvruferw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0b3h2aGRqc2d2dHp2cnVmZXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NjUyNjYsImV4cCI6MjA3MDQ0MTI2Nn0.UkF0priF_ALNt8sKlvauqslCJMeg05evf26avXMtxfc
   ```

#### Build Settings Avançadas (netlify.toml já configura isso)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  node_bundler = "esbuild"

[build.environment]
  NODE_VERSION = "20"
```

### 4. Verificações Pós-Deploy

Após o deploy, verifique:

1. ✅ **Homepage carrega?** - Acesse a URL do site
2. ✅ **Login funciona?** - Teste fazer login
3. ✅ **Rotas funcionam?** - Teste `/dashboard` e `/admin`
4. ✅ **Imagens carregam?** - Verifique se o logo aparece

### 5. Solução de Problemas Comuns

#### Erro persiste após deploy

1. **Limpar cache:**
   ```
   Deploys > Trigger deploy > Clear cache and deploy site
   ```

2. **Verificar logs:**
   ```
   Deploys > [Latest Deploy] > Deploy log
   ```

3. **Verificar Functions:**
   ```
   Functions > Check if functions are deployed
   ```

#### Build falha

1. **Verificar Node version:**
   - Deve ser Node 20 (configurado no netlify.toml)

2. **Verificar dependências:**
   ```bash
   npm install
   npm run build
   ```

3. **Verificar erros TypeScript:**
   - O build ignora erros TS (configurado)

#### Página em branco

1. **Verificar console do navegador:**
   - F12 > Console > Procurar por erros

2. **Verificar variáveis de ambiente:**
   - Site settings > Environment variables
   - Todas devem estar configuradas

3. **Verificar Network tab:**
   - F12 > Network > Ver se há erros 404/500

### 6. O que foi Corrigido

#### Antes (Causava Erro)
- ❌ Sem configuração do Netlify
- ❌ Fonte Inter sem configuração adequada
- ❌ Plugin do Next.js não instalado
- ❌ Output standalone causava conflitos

#### Depois (Corrigido)
- ✅ netlify.toml configurado
- ✅ Fonte Inter com display: 'swap'
- ✅ Plugin @netlify/plugin-nextjs instalado
- ✅ suppressHydrationWarning adicionado
- ✅ Configuração de build otimizada

### 7. Comandos Úteis

```bash
# Testar build localmente
npm run build

# Verificar sintaxe do netlify.toml
netlify build --dry

# Limpar cache local
rm -rf .next node_modules
npm install
npm run build
```

### 8. Monitoramento

Após o deploy bem-sucedido:

1. **Logs em tempo real:**
   - Functions > View logs

2. **Analytics:**
   - Analytics > Ver métricas de uso

3. **Status:**
   - Status page > Ver uptime

## 📞 Suporte

Se o problema persistir após seguir todos os passos:

1. Verifique os logs de deploy no Netlify
2. Copie a mensagem de erro completa
3. Verifique se todas as dependências foram instaladas
4. Tente um deploy limpo (clear cache)

## ✨ Resultado Esperado

Após o deploy bem-sucedido:

- ✅ Site carrega normalmente
- ✅ Login funciona
- ✅ Dashboard de usuário funciona
- ✅ Painel admin funciona
- ✅ Imagens carregam
- ✅ Supabase conecta corretamente

---

**Última atualização:** 2024
**Status:** ✅ Pronto para deploy

