import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - EcoSoft",
  description: "Panel de control del sistema EcoSoft",
}

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Bienvenido a Ecosoft</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Aquí iría el contenido del dashboard */}
      </div>
    </div>
  )
}

