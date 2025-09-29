"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Monitor, Globe } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Dashboard, User } from "@/lib/supabase"

interface DashboardManagementProps {
  dashboards: Dashboard[]
  setDashboards: (dashboards: Dashboard[]) => void
  users: User[]
  currentUser: User
  onDataChange: () => void
}

export function DashboardManagement({
  dashboards,
  setDashboards,
  users,
  currentUser,
  onDataChange,
}: DashboardManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDashboard, setEditingDashboard] = useState<Dashboard | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "iframe" as "iframe" | "external",
    url: "",
    description: "",
    assignedUsers: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let dashboardId: string

      if (editingDashboard) {
        // Update existing dashboard
        const { error } = await supabase
          .from("dashboards")
          .update({
            name: formData.name,
            type: formData.type,
            url: formData.url,
            description: formData.description,
          })
          .eq("id", editingDashboard.id)

        if (error) throw error
        dashboardId = editingDashboard.id

        // Remove existing assignments
        await supabase.from("user_dashboards").delete().eq("dashboard_id", dashboardId)
      } else {
        // Create new dashboard
        const { data, error } = await supabase
          .from("dashboards")
          .insert({
            name: formData.name,
            type: formData.type,
            url: formData.url,
            description: formData.description,
            created_by: currentUser.id,
          })
          .select()
          .single()

        if (error) throw error
        dashboardId = data.id
      }

      // Add new assignments
      if (formData.assignedUsers.length > 0) {
        const assignments = formData.assignedUsers.map((userId) => ({
          user_id: userId,
          dashboard_id: dashboardId,
          assigned_by: currentUser.id,
        }))

        const { error: assignError } = await supabase.from("user_dashboards").insert(assignments)

        if (assignError) throw assignError
      }

      await onDataChange()
      resetForm()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", type: "iframe", url: "", description: "", assignedUsers: [] })
    setEditingDashboard(null)
    setIsDialogOpen(false)
    setError("")
  }

  const handleEdit = async (dashboard: Dashboard) => {
    setEditingDashboard(dashboard)

    // Load current assignments
    const { data: assignments } = await supabase
      .from("user_dashboards")
      .select("user_id")
      .eq("dashboard_id", dashboard.id)

    const assignedUserIds = assignments?.map((a) => a.user_id) || []

    setFormData({
      name: dashboard.name,
      type: dashboard.type,
      url: dashboard.url,
      description: dashboard.description || "",
      assignedUsers: assignedUserIds,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (dashboardId: string) => {
    if (confirm("Tem certeza que deseja excluir este dashboard?")) {
      try {
        const { error } = await supabase.from("dashboards").delete().eq("id", dashboardId)

        if (error) throw error
        await onDataChange()
      } catch (error) {
        console.error("Error deleting dashboard:", error)
      }
    }
  }

  const handleUserAssignment = (userId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        assignedUsers: [...formData.assignedUsers, userId],
      })
    } else {
      setFormData({
        ...formData,
        assignedUsers: formData.assignedUsers.filter((id) => id !== userId),
      })
    }
  }

  const getAssignedUserNames = async (dashboardId: string) => {
    const { data } = await supabase
      .from("user_dashboards")
      .select(`
        users (name)
      `)
      .eq("dashboard_id", dashboardId)

    return data?.map((item) => item.users?.name).join(", ") || "Nenhum usuário"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Dashboards do Sistema</CardTitle>
            <CardDescription>Gerencie dashboards e direcionamentos</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Novo Dashboard
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingDashboard ? "Editar Dashboard" : "Novo Dashboard"}</DialogTitle>
                <DialogDescription>
                  {editingDashboard ? "Edite as informações do dashboard" : "Adicione um novo dashboard ao sistema"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Dashboard</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descrição opcional do dashboard"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "iframe" | "external") => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iframe">Iframe (Incorporado)</SelectItem>
                        <SelectItem value="external">Link Externo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://exemplo.com/dashboard"
                      required
                    />
                  </div>
                  <div>
                    <Label>Usuários com Acesso</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                      {users
                        .filter((user) => user.role !== "admin")
                        .map((user) => (
                          <div key={user.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`user-${user.id}`}
                              checked={formData.assignedUsers.includes(user.id)}
                              onCheckedChange={(checked) => handleUserAssignment(user.id, checked as boolean)}
                            />
                            <Label htmlFor={`user-${user.id}`} className="text-sm">
                              {user.name} ({user.email})
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                {error && <div className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                    {isLoading ? "Salvando..." : editingDashboard ? "Salvar" : "Criar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dashboards.map((dashboard) => (
              <TableRow key={dashboard.id}>
                <TableCell className="font-medium">{dashboard.name}</TableCell>
                <TableCell>
                  <Badge variant={dashboard.type === "iframe" ? "default" : "secondary"}>
                    {dashboard.type === "iframe" ? (
                      <Monitor className="h-3 w-3 mr-1" />
                    ) : (
                      <Globe className="h-3 w-3 mr-1" />
                    )}
                    {dashboard.type === "iframe" ? "Iframe" : "Externo"}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{dashboard.url}</TableCell>
                <TableCell className="max-w-xs truncate">{dashboard.description || "-"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(dashboard)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(dashboard.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
