import type { Metadata } from "next"
import { MeetingsManager } from "@/components/reuniones/meetings-manager"

export const metadata: Metadata = {
  title: "Reuniones - EcoSoft",
  description: "Gestión de reuniones virtuales en EcoSoft",
}

export default function ReunionesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Reuniones Virtuales</h1>
      <p className="text-muted-foreground mb-6">
        Cree y participe en reuniones virtuales con otros usuarios de la plataforma. Todas las reuniones quedan
        registradas en el historial.
      </p>
      <MeetingsManager />
    </div>
  )
}

