"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  FileIcon,
  FileTextIcon,
  FileImageIcon,
  FileIcon as FilePdfIcon,
  Search,
  Trash,
  AlertCircle,
} from "lucide-react"
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

// Datos de ejemplo para el historial de compartidos
const initialShareHistory = [
  {
    id: "1",
    fileName: "Informe_Financiero_Q2.pdf",
    fileType: "pdf",
    fileSize: "3.5 MB",
    sharedBy: "Juan Pérez",
    sharedTo: "María López",
    sharedAt: "2023-06-15T10:30:00",
    expiresAt: "2023-06-22T10:30:00",
    status: "active",
  },
  {
    id: "2",
    fileName: "Presentación_Proyecto.pptx",
    fileType: "document",
    fileSize: "2.8 MB",
    sharedBy: "María López",
    sharedTo: "Carlos Rodríguez",
    sharedAt: "2023-06-14T14:45:00",
    expiresAt: "2023-06-21T14:45:00",
    status: "active",
  },
  {
    id: "3",
    fileName: "Logo_Empresa.png",
    fileType: "image",
    fileSize: "1.2 MB",
    sharedBy: "Pedro Sánchez",
    sharedTo: "Ana Martínez",
    sharedAt: "2023-06-10T09:15:00",
    expiresAt: "2023-06-17T09:15:00",
    status: "expired",
  },
  {
    id: "4",
    fileName: "Contrato_Servicio.docx",
    fileType: "document",
    fileSize: "450 KB",
    sharedBy: "Ana Martínez",
    sharedTo: "Juan Pérez",
    sharedAt: "2023-06-08T16:20:00",
    expiresAt: "2023-06-15T16:20:00",
    status: "expired",
  },
  {
    id: "5",
    fileName: "Datos_Clientes.xlsx",
    fileType: "document",
    fileSize: "1.8 MB",
    sharedBy: "Carlos Rodríguez",
    sharedTo: "Pedro Sánchez",
    sharedAt: "2023-06-05T11:30:00",
    expiresAt: "2023-06-12T11:30:00",
    status: "deleted",
  },
]

export function ShareHistory() {
  const [shareHistory, setShareHistory] = useState(initialShareHistory)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedShareId, setSelectedShareId] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  // Verificar si el usuario es administrador
  const isAdmin = user?.role === "admin"

  const filteredHistory = shareHistory.filter(
    (item) =>
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sharedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sharedTo.toLowerCase().includes(searchTerm.toLowerCase()),
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

    setSelectedShareId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedShareId) {
      // En una aplicación real, esto sería una llamada a la API
      setShareHistory((prev) =>
        prev.map((item) => (item.id === selectedShareId ? { ...item, status: "deleted" } : item)),
      )

      toast({
        title: "Registro eliminado",
        description: "El registro ha sido eliminado del historial",
      })

      setDeleteDialogOpen(false)
      setSelectedShareId(null)
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

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileTextIcon className="h-5 w-5 text-blue-500" />
      case "image":
        return <FileImageIcon className="h-5 w-5 text-green-500" />
      case "pdf":
        return <FilePdfIcon className="h-5 w-5 text-red-500" />
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />
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
      case "expired":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Expirado
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

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre de archivo, remitente o destinatario..."
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
              <TableHead>Archivo</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead>Compartido por</TableHead>
              <TableHead>Compartido con</TableHead>
              <TableHead>Fecha de compartido</TableHead>
              <TableHead>Expira</TableHead>
              <TableHead>Estado</TableHead>
              {isAdmin && <TableHead className="w-[80px]">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 9 : 8} className="text-center py-8 text-muted-foreground">
                  No se encontraron registros
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((item) => (
                <TableRow key={item.id} className={item.status === "deleted" ? "opacity-60" : ""}>
                  <TableCell>{getFileIcon(item.fileType)}</TableCell>
                  <TableCell className="font-medium">{item.fileName}</TableCell>
                  <TableCell>{item.fileSize}</TableCell>
                  <TableCell>{item.sharedBy}</TableCell>
                  <TableCell>{item.sharedTo}</TableCell>
                  <TableCell>{formatDate(item.sharedAt)}</TableCell>
                  <TableCell>{formatDate(item.expiresAt)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      {item.status !== "deleted" && (
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </TableCell>
                  )}
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
              Esta acción eliminará el registro del historial de compartidos. Esta acción no se puede deshacer.
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

