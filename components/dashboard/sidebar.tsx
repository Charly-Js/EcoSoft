"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { LogOut, Upload, FolderOpen, Share2, Settings, ChevronDown, Users, Video, UserPlus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import Image from "next/image"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    importar: false,
    archivos: false,
    compartir: false,
    utilidades: false,
    usuarios: false,
    reuniones: false,
    contactos: false,
  })

  // Determinar si el usuario es administrador
  const isAdmin = user?.role === "admin"

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const handleMenuClick = (path: string) => {
    router.push(path)
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <aside className={cn("w-56 bg-white dark:bg-gray-800 flex flex-col h-full", className)}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="relative w-32 h-20">
          <Image src="/images/logo.png" alt="EcoSoft Logo" fill style={{ objectFit: "contain" }} priority />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="py-2">
          <button
            onClick={() => {
              toggleMenu("importar")
              handleMenuClick("/dashboard/importar")
            }}
            className={cn(
              "flex items-center w-full px-4 py-3 text-left font-medium",
              "bg-ecosoft-600 text-white hover:bg-ecosoft-700",
            )}
          >
            <Upload className="mr-2 h-5 w-5" />
            <span>Importar</span>
            <ChevronDown
              className={cn(
                "ml-auto h-5 w-5 transition-transform",
                expandedMenus.importar ? "transform rotate-180" : "",
              )}
            />
          </button>
          {expandedMenus.importar && (
            <div className="pl-8 pr-4 py-2 bg-ecosoft-50 dark:bg-ecosoft-900">
              <Link href="/dashboard/importar" className="block py-1 text-sm hover:text-ecosoft-600">
                Archivos
              </Link>
            </div>
          )}
        </div>

        <div className="py-2">
          <button
            onClick={() => {
              toggleMenu("archivos")
              handleMenuClick("/dashboard/archivos")
            }}
            className={cn(
              "flex items-center w-full px-4 py-3 text-left font-medium",
              "bg-ecosoft-600 text-white hover:bg-ecosoft-700",
            )}
          >
            <FolderOpen className="mr-2 h-5 w-5" />
            <span>Archivos</span>
            <ChevronDown
              className={cn(
                "ml-auto h-5 w-5 transition-transform",
                expandedMenus.archivos ? "transform rotate-180" : "",
              )}
            />
          </button>
          {expandedMenus.archivos && (
            <div className="pl-8 pr-4 py-2 bg-ecosoft-50 dark:bg-ecosoft-900">
              <Link href="/dashboard/archivos" className="block py-1 text-sm hover:text-ecosoft-600">
                Todos
              </Link>
              <Link href="/dashboard/archivos?tab=trash" className="block py-1 text-sm hover:text-ecosoft-600">
                Papelera
              </Link>
            </div>
          )}
        </div>

        <div className="py-2">
          <button
            onClick={() => {
              toggleMenu("compartir")
              handleMenuClick("/dashboard/compartir")
            }}
            className={cn(
              "flex items-center w-full px-4 py-3 text-left font-medium",
              "bg-ecosoft-600 text-white hover:bg-ecosoft-700",
            )}
          >
            <Share2 className="mr-2 h-5 w-5" />
            <span>Compartir</span>
            <ChevronDown
              className={cn(
                "ml-auto h-5 w-5 transition-transform",
                expandedMenus.compartir ? "transform rotate-180" : "",
              )}
            />
          </button>
          {expandedMenus.compartir && (
            <div className="pl-8 pr-4 py-2 bg-ecosoft-50 dark:bg-ecosoft-900">
              <Link href="/dashboard/compartir?tab=share" className="block py-1 text-sm hover:text-ecosoft-600">
                Compartir Archivo
              </Link>
              <Link href="/dashboard/compartir?tab=history" className="block py-1 text-sm hover:text-ecosoft-600">
                Historial
              </Link>
            </div>
          )}
        </div>

        <div className="py-2">
          <button
            onClick={() => {
              toggleMenu("utilidades")
              handleMenuClick("/dashboard/utilidades")
            }}
            className={cn(
              "flex items-center w-full px-4 py-3 text-left font-medium",
              "bg-ecosoft-600 text-white hover:bg-ecosoft-700",
            )}
          >
            <Settings className="mr-2 h-5 w-5" />
            <span>Utilidades</span>
            <ChevronDown
              className={cn(
                "ml-auto h-5 w-5 transition-transform",
                expandedMenus.utilidades ? "transform rotate-180" : "",
              )}
            />
          </button>
          {expandedMenus.utilidades && (
            <div className="pl-8 pr-4 py-2 bg-ecosoft-50 dark:bg-ecosoft-900">
              <Link href="/dashboard/utilidades?tab=compress" className="block py-1 text-sm hover:text-ecosoft-600">
                Compresión
              </Link>
              <Link href="/dashboard/utilidades?tab=convert" className="block py-1 text-sm hover:text-ecosoft-600">
                Conversión
              </Link>
              <Link href="/dashboard/utilidades?tab=scan" className="block py-1 text-sm hover:text-ecosoft-600">
                Escanear documento
              </Link>
              <Link href="/dashboard/utilidades?tab=history" className="block py-1 text-sm hover:text-ecosoft-600">
                Historial
              </Link>
            </div>
          )}
        </div>

        <div className="py-2">
          <button
            onClick={() => {
              toggleMenu("reuniones")
              handleMenuClick("/dashboard/reuniones")
            }}
            className={cn(
              "flex items-center w-full px-4 py-3 text-left font-medium",
              "bg-ecosoft-600 text-white hover:bg-ecosoft-700",
            )}
          >
            <Video className="mr-2 h-5 w-5" />
            <span>Reuniones</span>
            <ChevronDown
              className={cn(
                "ml-auto h-5 w-5 transition-transform",
                expandedMenus.reuniones ? "transform rotate-180" : "",
              )}
            />
          </button>
          {expandedMenus.reuniones && (
            <div className="pl-8 pr-4 py-2 bg-ecosoft-50 dark:bg-ecosoft-900">
              <Link href="/dashboard/reuniones?tab=join" className="block py-1 text-sm hover:text-ecosoft-600">
                Unirse a reunión
              </Link>
              {isAdmin && (
                <Link href="/dashboard/reuniones?tab=create" className="block py-1 text-sm hover:text-ecosoft-600">
                  Crear reunión
                </Link>
              )}
              <Link href="/dashboard/reuniones?tab=history" className="block py-1 text-sm hover:text-ecosoft-600">
                Historial
              </Link>
            </div>
          )}
        </div>

        <div className="py-2">
          <button
            onClick={() => {
              toggleMenu("contactos")
              handleMenuClick("/dashboard/contactos")
            }}
            className={cn(
              "flex items-center w-full px-4 py-3 text-left font-medium",
              "bg-ecosoft-600 text-white hover:bg-ecosoft-700",
            )}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            <span>Contactos</span>
            <ChevronDown
              className={cn(
                "ml-auto h-5 w-5 transition-transform",
                expandedMenus.contactos ? "transform rotate-180" : "",
              )}
            />
          </button>
          {expandedMenus.contactos && (
            <div className="pl-8 pr-4 py-2 bg-ecosoft-50 dark:bg-ecosoft-900">
              <Link href="/dashboard/contactos?tab=contacts" className="block py-1 text-sm hover:text-ecosoft-600">
                Contactos
              </Link>
              <Link href="/dashboard/contactos?tab=zones" className="block py-1 text-sm hover:text-ecosoft-600">
                Zonas de trabajo
              </Link>
            </div>
          )}
        </div>

        {/* Sección de Usuarios solo visible para administradores */}
        {isAdmin && (
          <div className="py-2">
            <button
              onClick={() => {
                toggleMenu("usuarios")
                handleMenuClick("/dashboard/usuarios")
              }}
              className={cn(
                "flex items-center w-full px-4 py-3 text-left font-medium",
                "bg-ecosoft-600 text-white hover:bg-ecosoft-700",
              )}
            >
              <Users className="mr-2 h-5 w-5" />
              <span>Usuarios</span>
              <ChevronDown
                className={cn(
                  "ml-auto h-5 w-5 transition-transform",
                  expandedMenus.usuarios ? "transform rotate-180" : "",
                )}
              />
            </button>
            {expandedMenus.usuarios && (
              <div className="pl-8 pr-4 py-2 bg-ecosoft-50 dark:bg-ecosoft-900">
                <Link href="/dashboard/usuarios" className="block py-1 text-sm hover:text-ecosoft-600">
                  Gestionar Usuarios
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-left font-medium bg-ecosoft-600 text-white hover:bg-ecosoft-700"
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span>CERRAR SESIÓN</span>
        </button>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
        <span className="mr-2 text-sm font-medium">Modo oscuro</span>
        <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
      </div>
    </aside>
  )
}

