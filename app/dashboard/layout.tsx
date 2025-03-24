import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar si el usuario está autenticado
  const session = await getSession()

  if (!session) {
    console.log("No hay sesión activa, redirigiendo a login")
    redirect("/login")
  }

  console.log("Sesión activa encontrada:", session)

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}

