"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { AnimatedBackground } from "@/components/animated-background"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Verificar se há um token de reset válido
    const handleAuthStateChange = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError("Link de recuperação inválido ou expirado")
        return
      }
    }

    handleAuthStateChange()
  }, [])

  const validateField = (field: string, value: string) => {
    const errors: { password?: string; confirmPassword?: string } = { ...fieldErrors }

    switch (field) {
      case "password":
        if (!value) {
          errors.password = "Senha é obrigatória"
        } else if (value.length < 6) {
          errors.password = "Senha deve ter pelo menos 6 caracteres"
        } else {
          delete errors.password
        }
        break
      case "confirmPassword":
        if (!value) {
          errors.confirmPassword = "Confirmação de senha é obrigatória"
        } else if (value !== password) {
          errors.confirmPassword = "Senhas não coincidem"
        } else {
          delete errors.confirmPassword
        }
        break
    }

    setFieldErrors(errors)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    validateField("password", password)
    validateField("confirmPassword", confirmPassword)

    if (Object.keys(fieldErrors).length > 0 || !password || !confirmPassword) {
      return
    }

    if (password !== confirmPassword) {
      setError("Senhas não coincidem")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw new Error(error.message)
      }

      setIsSuccess(true)
    } catch (error: any) {
      console.error("Reset password error:", error)
      setError(error.message || "Erro ao atualizar senha")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoToLogin = () => {
    router.push("/")
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <AnimatedBackground />
        
        <div className="w-full max-w-md relative z-10">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md">
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
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Senha Atualizada!</CardTitle>
                <CardDescription className="text-gray-600">
                  Sua senha foi alterada com sucesso
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pb-8">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Agora você pode fazer login com sua nova senha
                </p>
                <Button
                  onClick={handleGoToLogin}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Ir para Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md">
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
              <CardTitle className="text-2xl font-bold text-gray-900">Nova Senha</CardTitle>
              <CardDescription className="text-gray-600">
                Digite sua nova senha para continuar
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua nova senha"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      validateField("password", e.target.value)
                    }}
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
                  Confirmar Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua nova senha"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      validateField("confirmPassword", e.target.value)
                    }}
                    className={cn(
                      "h-11 pr-11 transition-all duration-200",
                      fieldErrors.confirmPassword
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Reset Password Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
                disabled={isLoading || Object.keys(fieldErrors).length > 0}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" className="text-white" />
                    Atualizando...
                  </div>
                ) : (
                  "Atualizar Senha"
                )}
              </Button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Lembrou da senha?{" "}
                <Button
                  variant="link"
                  className="text-red-600 hover:text-red-700 p-0 font-medium"
                  onClick={handleGoToLogin}
                >
                  Voltar ao Login
                </Button>
              </p>
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
