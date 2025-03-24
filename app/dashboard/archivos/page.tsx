import type { Metadata } from "next"
import { FileExplorer } from "@/components/files/file-explorer"
import { FileViewControls } from "@/components/files/file-view-controls"

export const metadata: Metadata = {
  title: "Archivos - EcoSoft",
  description: "Explorar archivos del sistema EcoSoft",
}

export default function FilesPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Archivos</h1>
        <FileViewControls />
      </div>
      <FileExplorer />
    </div>
  )
}

