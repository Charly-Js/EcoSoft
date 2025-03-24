import type { Metadata } from "next"
import { UtilitiesManager } from "@/components/utilidades/utilities-manager"

export const metadata: Metadata = {
  title: "Utilidades - EcoSoft",
  description: "Utilidades del sistema EcoSoft",
}

export default function UtilidadesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Utilidades</h1>
      <p className="text-muted-foreground mb-6">
        Herramientas para trabajar con sus archivos. Todas las operaciones quedan registradas en el historial.
      </p>
      <UtilitiesManager />
    </div>
  )
}

