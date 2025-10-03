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

    // 3. Atribuir Power BI padrão ao novo usuário
    if (userRecord) {
      try {
        // Buscar o Power BI padrão
        const { data: defaultDashboard } = await supabase
          .from("dashboards")
          .select("id")
          .eq("name", "Painel de Produção - Gontijo Fundações")
          .single()

        if (defaultDashboard) {
          // Atribuir o Power BI ao novo usuário
          await supabase
            .from("user_dashboards")
            .insert({
              user_id: userRecord.id,
              dashboard_id: defaultDashboard.id,
              assigned_by: userRecord.id, // Auto-atribuição
            })
        }
      } catch (error) {
        console.error("Erro ao atribuir Power BI padrão:", error)
        // Não falha a criação do usuário se não conseguir atribuir o Power BI
      }
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

export const assignDefaultPowerBI = async () => {
  try {
    // 1. Criar o Power BI padrão se não existir
    const { data: existingDashboard } = await supabase
      .from("dashboards")
      .select("id")
      .eq("name", "Painel de Produção - Gontijo Fundações")
      .single()

    let dashboardId: string

    if (!existingDashboard) {
      // Criar o Power BI padrão
      const { data: newDashboard, error: createError } = await supabase
        .from("dashboards")
        .insert({
          name: "Painel de Produção - Gontijo Fundações",
          type: "iframe",
          url: "https://app.powerbi.com/view?r=eyJrIjoiYzQ4Y2Y3MzktYjI0MC00NzY5LWE4YjMtN2QxYzUyZDE3OGQ4IiwidCI6IjQ4YzY4NDJkLTRhOWItNGVhZC05ODU3LWY4OTQ5N2E3NGM1ZCIsImMiOjF9",
          description: "Dashboard de produção da Gontijo Fundações com métricas e indicadores em tempo real",
          created_by: (await getCurrentUser())?.id || null,
        })
        .select()
        .single()

      if (createError) throw createError
      dashboardId = newDashboard.id
    } else {
      dashboardId = existingDashboard.id
    }

    // 2. Atribuir o Power BI a todos os usuários ativos que ainda não o possuem
    const { data: usersWithoutPowerBI } = await supabase
      .from("users")
      .select("id")
      .eq("status", "active")
      .not("id", "in", `(
        SELECT user_id 
        FROM user_dashboards 
        WHERE dashboard_id = '${dashboardId}'
      )`)

    if (usersWithoutPowerBI && usersWithoutPowerBI.length > 0) {
      const assignments = usersWithoutPowerBI.map((user) => ({
        user_id: user.id,
        dashboard_id: dashboardId,
        assigned_by: (await getCurrentUser())?.id || user.id,
      }))

      const { error: assignError } = await supabase
        .from("user_dashboards")
        .insert(assignments)

      if (assignError) throw assignError
    }

    return { success: true, assignedCount: usersWithoutPowerBI?.length || 0 }
  } catch (error: any) {
    console.error("Assign default Power BI error:", error)
    throw new Error(error.message || "Erro ao atribuir Power BI padrão")
  }
}
