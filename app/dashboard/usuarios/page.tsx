import { UserTable } from "@/components/users/user-table"
import { UserCreateButton } from "@/components/users/user-create-button"
import type { Metadata } from "next"
import { checkAdminAccess } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Usuarios - EcoSoft",
  description: "Gestión de usuarios del sistema EcoSoft",
}

export default async function UsersPage() {
  // Verificar si el usuario tiene permisos de administrador
  const hasAccess = await checkAdminAccess()

  if (!hasAccess) {
    redirect("/dashboard")
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
      <p className="text-muted-foreground mb-6">
        Administre los usuarios registrados en la plataforma. Solo los administradores pueden registrar nuevos usuarios.
      </p>
      <div className="flex justify-end mb-6">
        <UserCreateButton />
      </div>
      <UserTable />
    </div>
  )
}

