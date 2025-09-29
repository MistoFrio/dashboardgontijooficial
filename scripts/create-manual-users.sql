-- Script para criar usuários manualmente no Supabase
-- Execute este script no SQL Editor se quiser criar usuários de teste

-- Verificar usuários existentes
SELECT email, name, role, status FROM users;

-- Criar usuários de teste na tabela (sem Auth ainda)
INSERT INTO users (email, name, role, status) VALUES 
('admin@gontijo.com', 'Administrador', 'admin', 'active'),
('usuario@gontijo.com', 'João Silva', 'user', 'active')
ON CONFLICT (email) DO NOTHING;

-- Verificar se foram criados
SELECT * FROM users;

-- IMPORTANTE: Para estes usuários funcionarem, você precisa:
-- 1. Ir na página de cadastro
-- 2. Criar cada usuário manualmente com email e senha
-- 3. Ou usar o Supabase Dashboard em Authentication > Users > Invite User
