-- Script para criar o Power BI padrão e atribuir a todos os usuários
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos inserir o Power BI padrão na tabela dashboards
INSERT INTO dashboards (name, type, url, description, created_by)
VALUES (
  'Painel de Produção - Gontijo Fundações',
  'iframe',
  'https://app.powerbi.com/view?r=eyJrIjoiYzQ4Y2Y3MzktYjI0MC00NzY5LWE4YjMtN2QxYzUyZDE3OGQ4IiwidCI6IjQ4YzY4NDJkLTRhOWItNGVhZC05ODU3LWY4OTQ5N2E3NGM1ZCIsImMiOjF9',
  'Dashboard de produção da Gontijo Fundações com métricas e indicadores em tempo real',
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
)
ON CONFLICT DO NOTHING;

-- 2. Obter o ID do Power BI criado
-- (Vamos usar uma variável temporária para isso)

-- 3. Atribuir o Power BI a todos os usuários existentes
INSERT INTO user_dashboards (user_id, dashboard_id, assigned_by)
SELECT 
  u.id as user_id,
  d.id as dashboard_id,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1) as assigned_by
FROM users u
CROSS JOIN dashboards d
WHERE d.name = 'Painel de Produção - Gontijo Fundações'
AND u.status = 'active'
ON CONFLICT (user_id, dashboard_id) DO NOTHING;

-- 4. Verificar se foi criado corretamente
SELECT 
  d.name as dashboard_name,
  COUNT(ud.user_id) as total_users_assigned,
  COUNT(CASE WHEN u.role = 'user' THEN 1 END) as regular_users,
  COUNT(CASE WHEN u.role = 'admin' THEN 1 END) as admin_users
FROM dashboards d
LEFT JOIN user_dashboards ud ON d.id = ud.dashboard_id
LEFT JOIN users u ON ud.user_id = u.id
WHERE d.name = 'Painel de Produção - Gontijo Fundações'
GROUP BY d.id, d.name;

-- 5. Listar todos os usuários que receberam o Power BI
SELECT 
  u.name as user_name,
  u.email,
  u.role,
  d.name as dashboard_name,
  ud.assigned_at
FROM users u
JOIN user_dashboards ud ON u.id = ud.user_id
JOIN dashboards d ON ud.dashboard_id = d.id
WHERE d.name = 'Painel de Produção - Gontijo Fundações'
ORDER BY u.name;
