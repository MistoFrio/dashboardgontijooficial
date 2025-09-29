"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
  isActive?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />}
          {item.href || item.onClick ? (
            <button
              onClick={item.onClick}
              className={cn(
                "hover:text-foreground transition-colors",
                item.isActive ? "text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              {item.label}
            </button>
          ) : (
            <span className={cn(item.isActive ? "text-foreground font-medium" : "text-muted-foreground")}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
