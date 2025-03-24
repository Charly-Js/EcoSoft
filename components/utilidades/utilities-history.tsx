"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { FileArchiveIcon as FileZip, FileText, Search, Trash, AlertCircle, Download, Camera } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Datos de ejemplo para el historial de utilidades
const initialUtilitiesHistory = [
  {
    id: "1",
    operationType: "compression",
    inputFiles: "informe.docx, presentacion.pptx, datos.xlsx",
    outputFile: "archivos_comprimidos_2023-06-15.zip",
    format: "zip",
    compressionLevel: "normal",
    hasPassword: true,
    createdBy: "Juan Pérez",
    createdAt: "2023-06-15T10:30:00",
    status: "active",
  },
  {
    id: "2",
    operationType: "conversion",
    inputFile: "documento.docx",
    outputFile: "documento_convertido.pdf",
    fromFormat: "docx",
    toFormat: "pdf",
    quality: "high",
    createdBy: "María López",
    createdAt: "2023-06-14T14:45:00",
    status: "active",
  },
  {
    id: "3",
    operationType: "scan",
    outputFile: "documento_escaneado_2023-06-13.pdf",
    quality: "high",
    recipients: "Juan Pérez, María López",
    createdBy: "Pedro Sánchez",
    createdAt: "2023-06-13T09:15:00",
    status: "active",
  },
  {
    id: "4",
    operationType: "compression",
    inputFiles: "imagen1.jpg, imagen2.jpg, imagen3.jpg",
    outputFile: "imagenes_comprimidas_2023-06-10.zip",
    format: "zip",
    compressionLevel: "maximum",
    hasPassword: false,
    createdBy: "Pedro Sánchez",
    createdAt: "2023-06-10T09:15:00",
    status: "active",
  },
  {
    id: "5",
    operationType: "conversion",
    inputFile: "tabla.xlsx",
    outputFile: "tabla_convertida.csv",
    fromFormat: "xlsx",
    toFormat: "csv",
    quality: "medium",
    createdBy: "Ana Martínez",
    createdAt: "2023-06-08T16:20:00",
    status: "active",
  },
  {
    id: "6",
    operationType: "scan",
    outputFile: "contrato_escaneado_2023-06-07.pdf",
    quality: "medium",
    recipients: "Carlos Rodríguez",
    createdBy: "Ana Martínez",
    createdAt: "2023-06-07T11:30:00",
    status: "active",
  },
  {
    id: "7",
    operationType: "compression",
    inputFiles: "video.mp4",
    outputFile: "video_comprimido_2023-06-05.zip",
    format: "zip",
    compressionLevel: "fast",
    hasPassword: false,
    createdBy: "Carlos Rodríguez",
    createdAt: "2023-06-05T11:30:00",
    status: "deleted",
  },
]

export function UtilitiesHistory() {
  const [utilitiesHistory, setUtilitiesHistory] = useState(initialUtilitiesHistory)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedOperationId, setSelectedOperationId] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  // Verificar si el usuario es administrador
  const isAdmin = user?.role === "admin"

  const filteredHistory = utilitiesHistory.filter(
    (item) =>
      (item.outputFile.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.createdBy.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (item.operationType === "compression" || item.operationType === "conversion" || item.operationType === "scan"),
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDeleteClick = (id: string) => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden eliminar registros del historial",
        variant: "destructive",
      })
      return
    }

    setSelectedOperationId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedOperationId) {
      // En una aplicación real, esto sería una llamada a la API
      setUtilitiesHistory((prev) =>
        prev.map((item) => (item.id === selectedOperationId ? { ...item, status: "deleted" } : item)),
      )

      toast({
        title: "Registro eliminado",
        description: "El registro ha sido eliminado del historial",
      })

      setDeleteDialogOpen(false)
      setSelectedOperationId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getOperationIcon = (type: string) => {
    switch (type) {
      case "compression":
        return <FileZip className="h-5 w-5 text-blue-500" />
      case "conversion":
        return <FileText className="h-5 w-5 text-green-500" />
      case "scan":
        return <Camera className="h-5 w-5 text-purple-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getOperationTypeBadge = (type: string) => {
    switch (type) {
      case "compression":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Compresión
          </Badge>
        )
      case "conversion":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Conversión
          </Badge>
        )
      case "scan":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Escaneo
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Activo
          </Badge>
        )
      case "deleted":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Eliminado
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const handleDownload = (item: any) => {
    // En una aplicación real, esto descargaría el archivo desde el servidor
    toast({
      title: "Descarga iniciada",
      description: `Descargando ${item.outputFile}...`,
    })

    // Simulamos la descarga
    setTimeout(() => {
      toast({
        title: "Descarga completada",
        description: `El archivo ${item.outputFile} ha sido descargado`,
      })
    }, 2000)
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre de archivo o creador..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {!isAdmin && (
          <p className="mt-2 text-sm text-muted-foreground flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Solo los administradores pueden eliminar registros del historial
          </p>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Archivo de salida</TableHead>
              <TableHead>Detalles</TableHead>
              <TableHead>Creado por</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No se encontraron registros
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((item) => (
                <TableRow key={item.id} className={item.status === "deleted" ? "opacity-60" : ""}>
                  <TableCell>{getOperationIcon(item.operationType)}</TableCell>
                  <TableCell>{getOperationTypeBadge(item.operationType)}</TableCell>
                  <TableCell className="font-medium">{item.outputFile}</TableCell>
                  <TableCell>
                    {item.operationType === "compression" ? (
                      <span className="text-xs">
                        Formato: {item.format.toUpperCase()}, Nivel:{" "}
                        {item.compressionLevel === "fast"
                          ? "Rápido"
                          : item.compressionLevel === "normal"
                            ? "Normal"
                            : "Máximo"}
                        ,{item.hasPassword ? " Con contraseña" : " Sin contraseña"}
                      </span>
                    ) : item.operationType === "conversion" ? (
                      <span className="text-xs">
                        De {item.fromFormat.toUpperCase()} a {item.toFormat.toUpperCase()}, Calidad:{" "}
                        {item.quality === "low" ? "Baja" : item.quality === "medium" ? "Media" : "Alta"}
                      </span>
                    ) : item.operationType === "scan" ? (
                      <span className="text-xs">
                        Calidad: {item.quality === "low" ? "Baja" : item.quality === "medium" ? "Media" : "Alta"},
                        Compartido con: {item.recipients}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell>{item.createdBy}</TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {item.status !== "deleted" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(item)}
                            title="Descargar archivo"
                          >
                            <Download className="h-4 w-4 text-blue-500" />
                          </Button>

                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(item.id)}
                              title="Eliminar registro"
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el registro del historial de utilidades. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

