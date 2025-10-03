import { supabase } from "./supabase"
import type { User } from "./supabase"

export interface AuthUser extends User {
  auth_id: string
}

export const signIn = async (email: string, password: string) => {
  try {
    // Fazer login com Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      throw new Error("Email ou senha incorretos")
    }

    if (!authData.user) {
      throw new Error("Erro na autenticação")
    }

    // Buscar dados do usuário na nossa tabela
    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("email", email).single()

    if (userError || !userData) {
      throw new Error("Usuário não encontrado no sistema")
    }

    // Verificar se o usuário está ativo
    if (userData.status !== "active") {
      throw new Error("Usuário inativo")
    }

    return { user: userData, auth: authData.user }
  } catch (error: any) {
    console.error("SignIn error:", error)
    throw new Error(error.message || "Erro na autenticação")
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) return null

    const { data: userData, error } = await supabase.from("users").select("*").eq("email", authUser.email).single()

    if (error || !userData) return null

    return { ...userData, auth_id: authUser.id }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export const createUser = async (userData: {
  email: string
  name: string
  role: "admin" | "user"
  password: string
}) => {
  try {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
        },
      },
    })

    if (authError) {
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error("Erro ao criar usuário na autenticação")
    }

    // 2. Criar usuário na nossa tabela
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .insert({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: "active",
      })
      .select()
      .single()

    if (userError) {
      console.error("Erro ao criar usuário na tabela:", userError)
    }

    return {
      user: userRecord || null,
      authUser: authData.user,
    }
  } catch (error: any) {
    throw new Error(error.message || "Erro ao criar usuário")
  }
}

export const resetPassword = async (email: string) => {
  try {
    // Verificar se o usuário existe na nossa tabela
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email, status")
      .eq("email", email)
      .single()

    if (userError || !userData) {
      throw new Error("Email não encontrado no sistema")
    }

    // Verificar se o usuário está ativo
    if (userData.status !== "active") {
      throw new Error("Usuário inativo")
    }

    // Enviar email de reset de senha
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      throw new Error("Erro ao enviar email de reset")
    }

    return { success: true }
  } catch (error: any) {
    console.error("Reset password error:", error)
    throw new Error(error.message || "Erro ao enviar email de reset")
  }
}
