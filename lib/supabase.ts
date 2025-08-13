import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vtoxvhdjsgvtzvruferw.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0b3h2aGRqc2d2dHp2cnVmZXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NjUyNjYsImV4cCI6MjA3MDQ0MTI2Nn0.UkF0priF_ALNt8sKlvauqslCJMeg05evf26avXMtxfc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  status: "active" | "inactive"
  created_at: string
}

export interface Dashboard {
  id: string
  name: string
  type: "iframe" | "external"
  url: string
  description?: string
  created_at: string
  created_by: string
}

export interface UserDashboard {
  id: string
  user_id: string
  dashboard_id: string
  assigned_at: string
  assigned_by: string
}
