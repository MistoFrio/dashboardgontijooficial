# Dashboard Gontijo - Sistema de Gerenciamento

Sistema de dashboards desenvolvido com Next.js 15, React 19 e Supabase.

## 🚀 Tecnologias

- **Next.js 15.2.4** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Supabase** - Backend e autenticação
- **Radix UI** - Componentes acessíveis

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## 🌐 Deploy no Netlify

### Passos para Deploy

1. **Instalar dependências no Netlify:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente no Netlify:**
   - Vá em Site Settings > Environment Variables
   - Adicione as seguintes variáveis:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://vtoxvhdjsgvtzvruferw.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0b3h2aGRqc2d2dHp2cnVmZXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NjUyNjYsImV4cCI6MjA3MDQ0MTI2Nn0.UkF0priF_ALNt8sKlvauqslCJMeg05evf26avXMtxfc
     ```

3. **Configuração de Build:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 20

4. **Plugin do Netlify:**
   O plugin `@netlify/plugin-nextjs` está configurado no `netlify.toml` e será instalado automaticamente.

### Solução de Problemas

#### Erro: "object is not iterable"

Se você encontrar o erro `TypeError - object is not iterable (cannot read property Symbol(Symbol.iterator))`, certifique-se de que:

1. ✅ O arquivo `netlify.toml` está na raiz do projeto
2. ✅ O plugin `@netlify/plugin-nextjs` está instalado
3. ✅ As variáveis de ambiente estão configuradas no Netlify
4. ✅ O Node version está definido como 20 nas configurações de build

#### Clear Cache and Redeploy

Se o problema persistir:
1. Vá em Deploys > Trigger deploy
2. Selecione "Clear cache and deploy site"

## 🔒 Autenticação

O sistema usa Supabase para autenticação. Há dois tipos de usuários:

- **Admin**: Acesso completo ao painel administrativo
- **User**: Acesso aos dashboards atribuídos

## 📝 Estrutura do Projeto

```
├── app/                    # Páginas do Next.js App Router
│   ├── admin/             # Painel administrativo
│   ├── dashboard/         # Dashboard do usuário
│   ├── register/          # Registro de usuários
│   └── page.tsx           # Página de login
├── components/            # Componentes React
│   ├── ui/               # Componentes UI reutilizáveis
│   └── ...               # Componentes específicos
├── lib/                   # Utilitários e configurações
│   ├── auth.ts           # Lógica de autenticação
│   ├── supabase.ts       # Cliente Supabase
│   └── utils.ts          # Funções utilitárias
└── public/               # Arquivos estáticos
```

## 🛠️ Supabase Setup

Execute os scripts SQL na ordem:

1. `scripts/create-tables.sql` - Cria as tabelas
2. `scripts/create-initial-auth-users.sql` - Cria usuários de autenticação
3. `scripts/create-manual-users.sql` - Popula tabela de usuários

## 📄 Licença

© 2024 Gontijo Fundações. Todos os direitos reservados.

