"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle, Mail } from "lucide-react"
import { createUser } from "@/lib/auth"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "admin" | "user",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  const validateField = (field: string, value: string) => {
    const errors = { ...fieldErrors }

    switch (field) {
      case "name":
        if (!value.trim()) {
          errors.name = "Nome é obrigatório"
        } else if (value.trim().length < 2) {
          errors.name = "Nome deve ter pelo menos 2 caracteres"
        } else {
          delete errors.name
        }
        break
      case "email":
        if (!value) {
          errors.email = "Email é obrigatório"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Email inválido"
        } else {
          delete errors.email
        }
        break
      case "password":
        if (!value) {
          errors.password = "Senha é obrigatória"
        } else if (value.length < 6) {
          errors.password = "Senha deve ter pelo menos 6 caracteres"
        } else {
          delete errors.password
        }
        // Revalidate confirm password if it exists
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          errors.confirmPassword = "Senhas não coincidem"
        } else if (formData.confirmPassword && value === formData.confirmPassword) {
          delete errors.confirmPassword
        }
        break
      case "confirmPassword":
        if (!value) {
          errors.confirmPassword = "Confirmação de senha é obrigatória"
        } else if (value !== formData.password) {
          errors.confirmPassword = "Senhas não coincidem"
        } else {
          delete errors.confirmPassword
        }
        break
    }

    setFieldErrors(errors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      if (field !== "role") {
        validateField(field, formData[field as keyof typeof formData] as string)
      }
    })

    if (Object.keys(fieldErrors).length > 0) {
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await createUser({
        email: formData.email,
        name: formData.name,
        role: formData.role,
        password: formData.password,
      })

      setSuccess("Usuário cadastrado com sucesso! Verifique seu email para confirmar o cadastro.")

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      })

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "" }
    if (password.length < 6) return { strength: 1, label: "Muito fraca", color: "bg-red-500" }
    if (password.length < 8) return { strength: 2, label: "Fraca", color: "bg-orange-500" }
    if (password.length < 12) return { strength: 3, label: "Boa", color: "bg-yellow-500" }
    return { strength: 4, label: "Forte", color: "bg-green-500" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pt-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 relative p-2 bg-white rounded-2xl shadow-sm">
                <Image
                  src="/images/gontijo-logo.png"
                  alt="Gontijo Fundações Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900">Criar Conta</CardTitle>
              <CardDescription className="text-gray-600">
                Preencha os dados para criar sua conta no sistema
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={cn(
                    "h-11 transition-all duration-200",
                    fieldErrors.name
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500",
                  )}
                  required
                />
                {fieldErrors.name && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={cn(
                    "h-11 transition-all duration-200",
                    fieldErrors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500",
                  )}
                  required
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crie uma senha segura"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={cn(
                      "h-11 pr-11 transition-all duration-200",
                      fieldErrors.password
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500",
                    )}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-colors",
                            level <= passwordStrength.strength ? passwordStrength.color : "bg-gray-200",
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">Força da senha: {passwordStrength.label}</p>
                  </div>
                )}

                {fieldErrors.password && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={cn(
                      "h-11 pr-11 transition-all duration-200",
                      fieldErrors.confirmPassword
                        ? "border-red-500 focus-visible:ring-red-500"
                        : formData.confirmPassword && !fieldErrors.confirmPassword
                          ? "border-green-500 focus-visible:ring-green-500"
                          : "border-gray-300 focus-visible:border-red-500 focus-visible:ring-red-500",
                    )}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>

                  {/* Success indicator */}
                  {formData.confirmPassword && !fieldErrors.confirmPassword && (
                    <CheckCircle className="absolute right-11 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Success Alert */}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <Mail className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
                disabled={isLoading || Object.keys(fieldErrors).length > 0}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" className="text-white" />
                    Criando conta...
                  </div>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>

            {/* Back Button */}
            <Button
              variant="outline"
              className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 bg-transparent"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Login
            </Button>

            {/* Email Confirmation Info */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Confirmação por Email</p>
                  <p className="text-xs text-blue-800">
                    Após o cadastro, você receberá um email de confirmação. Verifique sua caixa de entrada e clique no
                    link para ativar sua conta.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">© 2024 Gontijo Fundações. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
