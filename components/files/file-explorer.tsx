"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { FileIcon, FolderIcon, FileTextIcon, FileImageIcon, FileIcon as FilePdfIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Datos de ejemplo para los archivos
const initialFiles = [
  {
    id: "1",
    name: "Documento de proyecto.docx",
    type: "document",
    size: "245 KB",
    createdAt: "2023-05-15T10:30:00",
    createdBy: "Juan Pérez",
    uploadedBy: "María López",
    uploadedAt: "2023-05-15T14:45:00",
  },
  {
    id: "2",
    name: "Logo empresa.jpg",
    type: "image",
    size: "1.2 MB",
    createdAt: "2023-05-16T09:15:00",
    createdBy: "Carlos Rodríguez",
    uploadedBy: "Carlos Rodríguez",
    uploadedAt: "2023-05-16T09:20:00",
  },
  {
    id: "3",
    name: "Informe trimestral.pdf",
    type: "pdf",
    size: "3.5 MB",
    createdAt: "2023-05-17T11:45:00",
    createdBy: "Ana Martínez",
    uploadedBy: "Pedro Sánchez",
    uploadedAt: "2023-05-17T16:30:00",
  },
  {
    id: "4",
    name: "Presentación cliente.pptx",
    type: "document",
    size: "4.8 MB",
    createdAt: "2023-05-19T08:30:00",
    createdBy: "Pedro Sánchez",
    uploadedBy: "Juan Pérez",
    uploadedAt: "2023-05-19T10:15:00",
  },
  {
    id: "5",
    name: "Datos financieros.xlsx",
    type: "document",
    size: "2.3 MB",
    createdAt: "2023-05-20T14:20:00",
    createdBy: "María López",
    uploadedBy: "María López",
    uploadedAt: "2023-05-20T14:25:00",
  },
]

// Datos de ejemplo para la papelera
const initialTrashFiles = [
  {
    id: "6",
    name: "Borrador antiguo.docx",
    type: "document",
    size: "198 KB",
    createdAt: "2023-04-10T10:30:00",
    createdBy: "Juan Pérez",
    uploadedBy: "Juan Pérez",
    uploadedAt: "2023-04-10T10:35:00",
    deletedAt: "2023-05-18T09:45:00",
  },
  {
    id: "7",
    name: "Imagen obsoleta.png",
    type: "image",
    size: "850 KB",
    createdAt: "2023-04-15T16:20:00",
    createdBy: "Ana Martínez",
    uploadedBy: "Ana Martínez",
    uploadedAt: "2023-04-15T16:25:00",
    deletedAt: "2023-05-19T14:30:00",
  },
]

export function FileExplorer() {
  const [files, setFiles] = useState(initialFiles)
  const [trashFiles, setTrashFiles] = useState(initialTrashFiles)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  useEffect(() => {
    // Escuchar cambios en el modo de vista
    const handleViewModeChange = (event: CustomEvent) => {
      setViewMode(event.detail.mode)
    }

    window.addEventListener("viewModeChange", handleViewModeChange as EventListener)

    return () => {
      window.removeEventListener("viewModeChange", handleViewModeChange as EventListener)
    }
  }, [])

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
      case "folder":
        return <FolderIcon className="h-5 w-5 text-ecosoft-500" />
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

  const renderListView = (filesList: typeof files, isTrash = false) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Tamaño</TableHead>
            <TableHead>Fecha de creación</TableHead>
            <TableHead>Creado por</TableHead>
            <TableHead>Subido por</TableHead>
            <TableHead>Fecha de subida</TableHead>
            {isTrash && <TableHead>Fecha de eliminación</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filesList.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{getFileIcon(file.type)}</TableCell>
              <TableCell className="font-medium">{file.name}</TableCell>
              <TableCell>{file.size}</TableCell>
              <TableCell>{formatDate(file.createdAt)}</TableCell>
              <TableCell>{file.createdBy}</TableCell>
              <TableCell>{file.uploadedBy}</TableCell>
              <TableCell>{formatDate(file.uploadedAt)}</TableCell>
              {isTrash && file.deletedAt && <TableCell>{formatDate(file.deletedAt)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  const renderGridView = (filesList: typeof files) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filesList.map((file) => (
        <Card key={file.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <div className="mb-2 mt-2">{getFileIcon(file.type)}</div>
              <p className="text-sm font-medium text-center truncate w-full">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{file.size}</p>
              <p className="text-xs text-muted-foreground mt-1">Creado: {formatDate(file.createdAt)}</p>
              <p className="text-xs text-muted-foreground">Por: {file.createdBy}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <Tabs defaultValue="files">
      <TabsList>
        <TabsTrigger value="files">Archivos</TabsTrigger>
        <TabsTrigger value="trash">Papelera</TabsTrigger>
      </TabsList>

      <TabsContent value="files" className="mt-4">
        {viewMode === "list" ? renderListView(files) : renderGridView(files)}
      </TabsContent>

      <TabsContent value="trash" className="mt-4">
        {viewMode === "list" ? renderListView(trashFiles, true) : renderGridView(trashFiles)}
      </TabsContent>
    </Tabs>
  )
}

