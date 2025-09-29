-- Este script deve ser executado no SQL Editor do Supabase
-- para criar os usuários iniciais no Supabase Auth também

-- Primeiro, vamos verificar se os usuários já existem na tabela
SELECT email, name, role FROM users;

-- Se os usuários existem na tabela mas não no Auth, 
-- você precisa criar eles manualmente no Auth ou usar a função JavaScript

-- Alternativa: Remover usuários existentes e recriar tudo
-- DELETE FROM users WHERE email IN ('admin@gontijo.com', 'usuario@gontijo.com');

-- Recriar usuários (eles serão criados no Auth via JavaScript)
-- INSERT INTO users (email, name, role, status) VALUES 
-- ('admin@gontijo.com', 'Administrador', 'admin', 'active'),
-- ('usuario@gontijo.com', 'João Silva', 'user', 'active');
