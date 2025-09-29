"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
  }
  showBack?: boolean
  onBack?: () => void
}

export function PageHeader({ title, description, action, showBack, onBack }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between pb-6 border-b border-border/40">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          {showBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || "default"}
          className={action.variant === "default" ? "bg-red-600 hover:bg-red-700" : ""}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
