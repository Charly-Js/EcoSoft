"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { FileIcon, Upload, Check, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type FileWithStatus = {
  file: File
  id: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
  createdAt: Date
  createdBy: string
}

export function FileImporter() {
  const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        id: Math.random().toString(36).substring(2, 9),
        progress: 0,
        status: "pending" as const,
        createdAt: new Date(),
        createdBy: "Usuario Actual", // En un caso real, esto vendría del contexto de autenticación
      }))

      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0 || selectedFiles.every((f) => f.status === "success")) {
      toast({
        title: "No hay archivos para importar",
        description: "Por favor seleccione al menos un archivo",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Actualizar estado de archivos a "uploading"
    setSelectedFiles((prev) =>
      prev.map((file) => (file.status === "pending" ? { ...file, status: "uploading" } : file)),
    )

    // Simular carga de cada archivo pendiente
    const pendingFiles = selectedFiles.filter((f) => f.status === "uploading")

    pendingFiles.forEach((fileObj) => {
      simulateFileUpload(fileObj.id)
    })
  }

  const simulateFileUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5

      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        // 90% probabilidad de éxito
        const isSuccess = Math.random() > 0.1

        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  progress: 100,
                  status: isSuccess ? "success" : "error",
                  error: isSuccess ? undefined : "Error al importar el archivo",
                }
              : f,
          ),
        )

        // Verificar si todos los archivos han terminado
        setTimeout(() => {
          setSelectedFiles((prev) => {
            const allDone = prev.every((f) => f.status === "success" || f.status === "error")
            if (allDone) {
              setIsUploading(false)

              const successCount = prev.filter((f) => f.status === "success").length
              if (successCount > 0) {
                toast({
                  title: "Importación completada",
                  description: `${successCount} de ${prev.length} archivos importados correctamente`,
                })
              }
            }
            return prev
          })
        }, 500)
      } else {
        setSelectedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
      }
    }, 300)
  }

  const removeFile = (fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    let color = "text-gray-500"

    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
      color = "text-blue-500"
    } else if (["pdf"].includes(extension || "")) {
      color = "text-red-500"
    } else if (["doc", "docx"].includes(extension || "")) {
      color = "text-blue-700"
    } else if (["xls", "xlsx"].includes(extension || "")) {
      color = "text-green-600"
    }

    return <FileIcon className={`h-5 w-5 ${color}`} />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="file-upload">Seleccionar archivos</Label>
          <Input id="file-upload" type="file" multiple onChange={handleFileChange} disabled={isUploading} />
        </div>
        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || isUploading || selectedFiles.every((f) => f.status === "success")}
        >
          <Upload className="mr-2 h-4 w-4" />
          Importar archivos
        </Button>
      </div>

      {selectedFiles.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead>Creado por</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[100px]">Progreso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedFiles.map((fileObj) => (
                <TableRow key={fileObj.id}>
                  <TableCell>{getFileIcon(fileObj.file.name)}</TableCell>
                  <TableCell className="font-medium">{fileObj.file.name}</TableCell>
                  <TableCell>{formatFileSize(fileObj.file.size)}</TableCell>
                  <TableCell>{formatDate(fileObj.createdAt)}</TableCell>
                  <TableCell>{fileObj.createdBy}</TableCell>
                  <TableCell>
                    {fileObj.status === "pending" && "Pendiente"}
                    {fileObj.status === "uploading" && "Importando..."}
                    {fileObj.status === "success" && (
                      <span className="flex items-center text-green-600">
                        <Check className="mr-1 h-4 w-4" /> Completado
                      </span>
                    )}
                    {fileObj.status === "error" && (
                      <span className="flex items-center text-red-600">
                        <AlertCircle className="mr-1 h-4 w-4" /> Error
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="w-full">
                      <Progress value={fileObj.progress} className="h-2" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

