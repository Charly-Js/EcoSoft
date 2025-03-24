"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"
import { User, Moon, Sun } from "lucide-react"

interface HeaderProps {
  user: {
    name: string
    email: string
    role: string
  }
}

export function Header({ user }: HeaderProps) {
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Asegurarse de que user siempre tenga valores por defecto
  const safeUser = {
    name: user?.name || "Usuario",
    email: user?.email || "usuario@example.com",
    role: user?.role || "operator",
  }

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="ml-auto flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-muted" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 md:pl-64">
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Cambiar tema</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt={safeUser.name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start">
              <span className="font-medium">{safeUser.name}</span>
              <span className="text-xs text-muted-foreground">{safeUser.email}</span>
              <span className="text-xs text-muted-foreground capitalize">
                {safeUser.role === "admin" ? "Administrador" : "Operador"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

