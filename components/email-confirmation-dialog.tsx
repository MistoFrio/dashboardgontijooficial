"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle } from "lucide-react"

interface EmailConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export function EmailConfirmationDialog({ isOpen, onClose, email }: EmailConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">Email de Confirmação Enviado!</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Enviamos um email de confirmação para:
            <br />
            <strong className="text-gray-900">{email}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Próximos passos:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Verifique sua caixa de entrada</li>
                  <li>Clique no link de confirmação no email</li>
                  <li>Retorne aqui e faça login</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">⚠️ Não recebeu o email?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Verifique a pasta de spam/lixo eletrônico</li>
                <li>Aguarde alguns minutos</li>
                <li>Verifique se o email está correto</li>
              </ul>
            </div>
          </div>

          <Button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white">
            Entendi, vou verificar meu email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
