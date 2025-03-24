import type { Metadata } from "next"
import { ShareManager } from "@/components/compartir/share-manager"

export const metadata: Metadata = {
  title: "Compartir - EcoSoft",
  description: "Compartir archivos de forma segura en EcoSoft",
}

export default function CompartirPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Compartir Archivos</h1>
      <p className="text-muted-foreground mb-6">
        Comparta archivos de forma segura con otros usuarios de la plataforma. Todos los archivos compartidos quedan
        registrados en el sistema.
      </p>
      <ShareManager />
    </div>
  )
}

