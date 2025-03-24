import type { Metadata } from "next"
import { FileImporter } from "@/components/importar/file-importer"

export const metadata: Metadata = {
  title: "Importar - EcoSoft",
  description: "Importar archivos al sistema EcoSoft",
}

export default function ImportarPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Importar Archivos</h1>
      <p className="text-muted-foreground mb-6">Seleccione los archivos de su equipo que desea importar al sistema.</p>
      <FileImporter />
    </div>
  )
}

