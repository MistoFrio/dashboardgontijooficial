"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const handleWhatsAppContact = () => {
    window.open("https://wa.me/553199390798", "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Support Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          "bg-red-600 hover:bg-red-700 text-white",
          "flex items-center justify-center p-0"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Support Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-in slide-in-from-bottom-2 duration-200">
          <div className="space-y-4">
            {/* Header */}
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Suporte</h3>
              <p className="text-sm text-gray-600">
                Precisa de ajuda? Entre em contato conosco!
              </p>
            </div>

            {/* Contact Options */}
            <div className="space-y-3">
              <Button
                onClick={handleWhatsAppContact}
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-3"
              >
                <Phone className="h-4 w-4" />
                Contatar via WhatsApp
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Resposta rápida via WhatsApp
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Gontijo Fundações - Suporte Técnico
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
