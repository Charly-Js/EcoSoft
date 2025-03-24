"use client"

import { FileText, FileIcon, FileArchive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FilePreviewProps {
  file: {
    id: string
    name: string
    type: string
    size: string
  }
}

export function FilePreview({ file }: FilePreviewProps) {
  const { toast } = useToast()

  const handleDownload = () => {
    toast({
      title: "Descargando archivo",
      description: `Descargando ${file.name}...`,
    })
  }

  const handleShare = () => {
    toast({
      title: "Compartir archivo",
      description: `Opciones para compartir ${file.name}`,
    })
  }

  const renderPreview = () => {
    switch (file.type) {
      case "image":
        return (
          <div className="flex justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <img src="/placeholder.svg?height=400&width=600" alt={file.name} className="max-h-[400px] object-contain" />
          </div>
        )
      case "pdf":
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-md h-[400px]">
            <FileIcon className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-lg font-medium">Vista previa de PDF no disponible</p>
            <p className="text-sm text-muted-foreground">Descargue el archivo para verlo</p>
          </div>
        )
      case "document":
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-md h-[400px]">
            <FileText className="h-16 w-16 text-blue-500 mb-4" />
            <p className="text-lg font-medium">Vista previa de documento no disponible</p>
            <p className="text-sm text-muted-foreground">Descargue el archivo para verlo</p>
          </div>
        )
      case "archive":
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-md h-[400px]">
            <FileArchive className="h-16 w-16 text-yellow-500 mb-4" />
            <p className="text-lg font-medium">Vista previa de archivo comprimido no disponible</p>
            <p className="text-sm text-muted-foreground">Descargue el archivo para verlo</p>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-md h-[400px]">
            <FileText className="h-16 w-16 text-gray-500 mb-4" />
            <p className="text-lg font-medium">Vista previa no disponible</p>
            <p className="text-sm text-muted-foreground">Tipo de archivo no soportado</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {renderPreview()}

      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Compartir
        </Button>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Descargar
        </Button>
      </div>

      <div className="border-t pt-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Nombre:</dt>
            <dd className="font-medium">{file.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tamaño:</dt>
            <dd className="font-medium">{file.size}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tipo:</dt>
            <dd className="font-medium capitalize">{file.type}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

