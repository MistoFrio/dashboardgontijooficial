"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCard } from "@/components/ui/stats-card"
import { PageHeader } from "@/components/ui/page-header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Users, Monitor, Settings, LogOut, Shield, Activity } from "lucide-react"
import { UserManagement } from "@/components/user-management"
import { DashboardManagement } from "@/components/dashboard-management"
import { getCurrentUser, signOut, assignDefaultPowerBI } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import type { User, Dashboard } from "@/lib/supabase"
import Image from "next/image"

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAssigningPowerBI, setIsAssigningPowerBI] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadData()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/")
        return
      }

      if (currentUser.role !== "admin") {
        router.push("/dashboard")
        return
      }

      setUser(currentUser)
    } catch (error) {
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const loadData = async () => {
    try {
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      if (usersError) throw usersError
      setUsers(usersData || [])

      // Load dashboards
      const { data: dashboardsData, error: dashboardsError } = await supabase
        .from("dashboards")
        .select("*")
        .order("created_at", { ascending: false })

      if (dashboardsError) throw dashboardsError
      setDashboards(dashboardsData || [])
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      localStorage.removeItem("user")
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleAssignDefaultPowerBI = async () => {
    setIsAssigningPowerBI(true)
    try {
      const result = await assignDefaultPowerBI()
      alert(`Power BI atribuído com sucesso! ${result.assignedCount} usuários receberam acesso.`)
      await loadData() // Recarregar dados
    } catch (error: any) {
      alert(`Erro ao atribuir Power BI: ${error.message}`)
    } finally {
      setIsAssigningPowerBI(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 relative mx-auto">
            <Image
              src="/images/gontijo-logo.png"
              alt="Gontijo Fundações Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            <p className="text-gray-600">Carregando painel administrativo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const activeUsers = users.filter((u) => u.status === "active").length
  const iframeCount = dashboards.filter((d) => d.type === "iframe").length
  const externalCount = dashboards.filter((d) => d.type === "external").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 relative">
                <Image
                  src="/images/gontijo-logo.png"
                  alt="Gontijo Fundações Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gontijo Fundações</h1>
                <p className="text-sm text-gray-500">Painel Administrativo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <PageHeader
          title="Dashboard Administrativo"
          description="Gerencie usuários, dashboards e configurações do sistema"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Usuários"
            value={users.length}
            description={`${activeUsers} ativos`}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Dashboards Ativos"
            value={dashboards.length}
            description={`${iframeCount} iframe, ${externalCount} externos`}
            icon={Monitor}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Sistema"
            value="Online"
            description="Supabase conectado"
            icon={Activity}
            className="lg:col-span-1"
          />
          <StatsCard
            title="Configurações"
            value="Ativo"
            description="Todas funcionalidades"
            icon={Settings}
            className="lg:col-span-1"
          />
        </div>

        {/* Power BI Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Power BI Padrão</h3>
              <p className="text-sm text-gray-600 mt-1">
                Atribua o "Painel de Produção - Gontijo Fundações" para todos os usuários ativos
              </p>
            </div>
            <Button
              onClick={handleAssignDefaultPowerBI}
              disabled={isAssigningPowerBI}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isAssigningPowerBI ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Atribuindo...
                </>
              ) : (
                "Atribuir Power BI"
              )}
            </Button>
          </div>
        </div>

        {/* Management Tabs */}
        <div className="bg-white rounded-lg border shadow-sm">
          <Tabs defaultValue="users" className="w-full">
            <div className="border-b border-gray-200 px-6 py-4">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100">
                <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-red-600">
                  <Users className="h-4 w-4 mr-2" />
                  Usuários
                </TabsTrigger>
                <TabsTrigger
                  value="dashboards"
                  className="data-[state=active]:bg-white data-[state=active]:text-red-600"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Dashboards
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="users" className="p-6 pt-6">
              <UserManagement users={users} setUsers={setUsers} onDataChange={loadData} />
            </TabsContent>

            <TabsContent value="dashboards" className="p-6 pt-6">
              <DashboardManagement
                dashboards={dashboards}
                setDashboards={setDashboards}
                users={users}
                currentUser={user}
                onDataChange={loadData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
