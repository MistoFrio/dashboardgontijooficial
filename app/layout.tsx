import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SupportWidget } from "@/components/ui/support-widget"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Gontijo Fundações - Sistema de Dashboards",
  description: "Sistema de direcionamento de dashboards",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <SupportWidget />
      </body>
    </html>
  )
}
