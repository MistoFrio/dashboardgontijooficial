"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { LogOut, ExternalLink, Monitor, Globe } from "lucide-react"
import { getCurrentUser, signOut } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import type { Dashboard } from "@/lib/supabase"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface UserDashboard extends Dashboard {
  assigned_at: string
}

export default function UserDashboard() {
  const [user, setUser] = useState<any | null>(null)
  const [dashboards, setDashboards] = useState<UserDashboard[]>([])
  const [selectedDashboard, setSelectedDashboard] = useState<UserDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/")
        return
      }

      setUser(currentUser)
      await loadUserDashboards(currentUser.id)
    } catch (error) {
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserDashboards = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_dashboards")
        .select(`
          assigned_at,
          dashboards (
            id,
            name,
            type,
            url,
            description,
            created_at,
            created_by
          )
        `)
        .eq("user_id", userId)

      if (error) throw error

      const userDashboards =
        data?.map((item) => ({
          ...item.dashboards,
          assigned_at: item.assigned_at,
        })) || []

      setDashboards(userDashboards)
    } catch (error) {
      console.error("Error loading user dashboards:", error)
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

  const openDashboard = (dashboard: UserDashboard) => {
    if (dashboard.type === "external") {
      window.open(dashboard.url, "_blank", "noopener,noreferrer")
    } else {
      setSelectedDashboard(dashboard)
    }
  }

  const breadcrumbItems = [
    { label: "Dashboards", onClick: () => setSelectedDashboard(null), isActive: !selectedDashboard },
    ...(selectedDashboard ? [{ label: selectedDashboard.name, isActive: true }] : []),
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
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
            <p className="text-gray-600">Carregando seus dashboards...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

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
                <p className="text-sm text-gray-500">Dashboard do Usuário</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">Usuário</p>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {!selectedDashboard ? (
          <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
<<<<<<< HEAD
              title={`Olá, ${user.name.split(" ")[0]}!`}
=======
              title={`Olá, ${user.name.split(" ")[0]}! 👋`}
>>>>>>> f4e8eb30c9e4417e05e072b9a8054e4648e7927a
              description="Acesse os dashboards disponíveis para você"
            />

            {/* Dashboard Grid */}
            {dashboards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboards.map((dashboard) => (
                  <Card
                    key={dashboard.id}
<<<<<<< HEAD
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm bg-white/80 backdrop-blur-sm hover:bg-white flex flex-col h-full"
                    onClick={() => openDashboard(dashboard)}
                  >
                    <CardHeader className="space-y-3 flex-1">
=======
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm bg-white/80 backdrop-blur-sm hover:bg-white"
                    onClick={() => openDashboard(dashboard)}
                  >
                    <CardHeader className="space-y-3">
>>>>>>> f4e8eb30c9e4417e05e072b9a8054e4648e7927a
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                          {dashboard.name}
                        </CardTitle>
                        <Badge
                          variant={dashboard.type === "iframe" ? "default" : "secondary"}
                          className={cn(
                            "transition-all duration-200",
                            dashboard.type === "iframe"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : "bg-gray-100 text-gray-700 border-gray-200",
                          )}
                        >
                          {dashboard.type === "iframe" ? (
                            <Monitor className="h-3 w-3 mr-1" />
                          ) : (
                            <Globe className="h-3 w-3 mr-1" />
                          )}
                          {dashboard.type === "iframe" ? "Embed" : "Externa"}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-600 line-clamp-2">
                        {dashboard.description || "Dashboard disponível para visualização"}
                      </CardDescription>
                    </CardHeader>
<<<<<<< HEAD
                    <CardFooter className="pt-0">
=======
                    <CardContent className="pt-0">
>>>>>>> f4e8eb30c9e4417e05e072b9a8054e4648e7927a
                      <Button
                        className={cn(
                          "w-full transition-all duration-200 group-hover:shadow-md",
                          dashboard.type === "external"
<<<<<<< HEAD
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white",
=======
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-red-600 hover:bg-red-700",
>>>>>>> f4e8eb30c9e4417e05e072b9a8054e4648e7927a
                        )}
                      >
                        {dashboard.type === "external" ? (
                          <>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Abrir Link Externo
                          </>
                        ) : (
                          <>
                            <Monitor className="h-4 w-4 mr-2" />
                            Visualizar Dashboard
                          </>
                        )}
                      </Button>
<<<<<<< HEAD
                    </CardFooter>
=======
                    </CardContent>
>>>>>>> f4e8eb30c9e4417e05e072b9a8054e4648e7927a
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Monitor}
                title="Nenhum dashboard disponível"
                description="Você ainda não tem acesso a nenhum dashboard. Entre em contato com o administrador para solicitar acesso."
                action={{
                  label: "Contatar Administrador",
                  onClick: () => window.open("mailto:admin@gontijo.com", "_blank"),
                }}
              />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Dashboard Header */}
            <PageHeader
              title={selectedDashboard.name}
              description={selectedDashboard.description}
              showBack
              onBack={() => setSelectedDashboard(null)}
              action={{
                label: "Abrir em Nova Aba",
                onClick: () => window.open(selectedDashboard.url, "_blank", "noopener,noreferrer"),
                variant: "outline",
              }}
            />

            {/* Dashboard Iframe */}
            <Card className="border-0 shadow-lg bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="relative" style={{ height: "calc(100vh - 240px)", minHeight: "600px" }}>
                  <iframe
                    src={selectedDashboard.url}
                    className="w-full h-full border-0"
                    title={selectedDashboard.name}
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts allow-forms"
                  />

                  {/* Loading overlay */}
                  <div className="absolute inset-0 bg-white flex items-center justify-center transition-opacity duration-300 pointer-events-none">
                    <div className="text-center space-y-4">
                      <LoadingSpinner size="lg" className="text-red-600" />
                      <p className="text-gray-500">Carregando dashboard...</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
