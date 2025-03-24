"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type FileWithPreview = {
  file: File
  id: string
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
}

export function FileUploader() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(2, 9),
      progress: 0,
      status: "uploading" as const,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simular carga para cada archivo
    newFiles.forEach((fileObj) => {
      simulateUpload(fileObj.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/vnd.ms-powerpoint": [],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [],
      "text/plain": [],
    },
  })

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        // Simular éxito o error aleatorio (90% éxito, 10% error)
        const isSuccess = Math.random() > 0.1

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  progress: 100,
                  status: isSuccess ? "success" : "error",
                  error: isSuccess ? undefined : "Error al subir el archivo",
                }
              : f,
          ),
        )

        if (isSuccess) {
          toast({
            title: "Archivo subido correctamente",
            description: "El archivo ha sido importado al sistema",
          })
        } else {
          toast({
            title: "Error al subir el archivo",
            description: "Ha ocurrido un error al importar el archivo",
            variant: "destructive",
          })
        }
      } else {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
      }
    }, 300)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension || "")) {
      return <File className="h-6 w-6 text-blue-500" />
    } else if (["pdf"].includes(extension || "")) {
      return <File className="h-6 w-6 text-red-500" />
    } else if (["doc", "docx"].includes(extension || "")) {
      return <File className="h-6 w-6 text-blue-700" />
    } else if (["xls", "xlsx"].includes(extension || "")) {
      return <File className="h-6 w-6 text-green-600" />
    } else if (["ppt", "pptx"].includes(extension || "")) {
      return <File className="h-6 w-6 text-orange-500" />
    } else {
      return <File className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-ecosoft-500 bg-ecosoft-50"
            : "border-gray-300 hover:border-ecosoft-500 hover:bg-ecosoft-50",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-3">
          <Upload className="h-12 w-12 text-ecosoft-500" />
          <h3 className="text-lg font-semibold">
            {isDragActive ? "Suelte los archivos aquí" : "Arrastre y suelte archivos aquí"}
          </h3>
          <p className="text-sm text-muted-foreground">o haga clic para seleccionar archivos</p>
          <p className="text-xs text-muted-foreground">
            Formatos soportados: JPG, PNG, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted p-3 font-medium">Archivos ({files.length})</div>
          <div className="divide-y">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="p-4 flex items-center">
                <div className="mr-4">{getFileIcon(fileObj.file.name)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                    <p className="text-xs text-muted-foreground">{(fileObj.file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <div className="w-full">
                    <Progress value={fileObj.progress} className="h-2" />
                  </div>
                  {fileObj.status === "error" && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {fileObj.error}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex items-center">
                  {fileObj.status === "success" ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : fileObj.status === "error" ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <p className="text-xs font-medium">{fileObj.progress}%</p>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => removeFile(fileObj.id)} className="ml-2">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

