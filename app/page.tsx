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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, EyeOff, AlertCircle, Mail, CheckCircle } from "lucide-react"
import { signIn, resetPassword } from "@/lib/auth"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { AnimatedBackground } from "@/components/animated-background"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [resetEmail, setResetEmail] = useState("")
  const [isResetLoading, setIsResetLoading] = useState(false)
  const [resetError, setResetError] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const router = useRouter()

  const validateField = (field: string, value: string) => {
    const errors: { email?: string; password?: string } = { ...fieldErrors }

    switch (field) {
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
        break
    }

    setFieldErrors(errors)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    validateField("email", email)
    validateField("password", password)

    if (Object.keys(fieldErrors).length > 0 || !email || !password) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const { user } = await signIn(email, password)
      localStorage.setItem("user", JSON.stringify(user))

      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resetEmail) {
      setResetError("Email é obrigatório")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setResetError("Email inválido")
      return
    }

    setIsResetLoading(true)
    setResetError("")

    try {
      await resetPassword(resetEmail)
      setResetSuccess(true)
    } catch (error: any) {
      console.error("Reset password error:", error)
      setResetError(error.message)
    } finally {
      setIsResetLoading(false)
    }
  }

  const handleResetDialogClose = () => {
    setIsResetDialogOpen(false)
    setResetEmail("")
    setResetError("")
    setResetSuccess(false)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Login Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
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
              <CardTitle className="text-2xl font-bold text-gray-900">Bem-vindo de volta</CardTitle>
              <CardDescription className="text-gray-600">
                Faça login para acessar o sistema de dashboards
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    validateField("email", e.target.value)
                  }}
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
                    placeholder="Sua senha"
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

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
                disabled={isLoading || Object.keys(fieldErrors).length > 0}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" className="text-white" />
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="text-sm text-gray-600 hover:text-red-600 p-0 font-medium"
                  >
                    Esqueci minha senha
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center">Recuperar Senha</DialogTitle>
                    <DialogDescription className="text-center">
                      Digite seu email para receber instruções de recuperação de senha
                    </DialogDescription>
                  </DialogHeader>
                  
                  {!resetSuccess ? (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="h-11"
                          required
                        />
                      </div>

                      {resetError && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">{resetError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={handleResetDialogClose}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          disabled={isResetLoading}
                        >
                          {isResetLoading ? (
                            <div className="flex items-center gap-2">
                              <LoadingSpinner size="sm" className="text-white" />
                              Enviando...
                            </div>
                          ) : (
                            "Enviar"
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">Email enviado!</h3>
                        <p className="text-sm text-gray-600">
                          Enviamos instruções de recuperação de senha para <strong>{resetEmail}</strong>
                        </p>
                        <p className="text-xs text-gray-500">
                          Verifique sua caixa de entrada e spam
                        </p>
                      </div>
                      <Button
                        onClick={handleResetDialogClose}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        Fechar
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Button
                  variant="link"
                  className="text-red-600 hover:text-red-700 p-0 font-medium"
                  onClick={() => router.push("/register")}
                >
                  Cadastre-se aqui
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
