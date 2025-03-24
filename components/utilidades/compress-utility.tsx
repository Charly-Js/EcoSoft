"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { FileArchiveIcon as FileZip, Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Esquema de validación para el formulario
const compressFormSchema = z.object({
  files: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "Debe seleccionar al menos un archivo",
  }),
  format: z.enum(["zip", "rar", "7z"]),
  compressionLevel: z.enum(["fast", "normal", "maximum"]),
  password: z.string().optional(),
})

type CompressFormValues = z.infer<typeof compressFormSchema>

interface CompressUtilityProps {
  onOperationComplete: () => void
}

export function CompressUtility({ onOperationComplete }: CompressUtilityProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadFilename, setDownloadFilename] = useState<string>("")
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CompressFormValues>({
    resolver: zodResolver(compressFormSchema),
    defaultValues: {
      format: "zip",
      compressionLevel: "normal",
      password: "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles(filesArray)
    }
  }

  const onSubmit = async (data: CompressFormValues) => {
    setIsCompressing(true)
    setProgress(0)

    try {
      // Simulamos el proceso de compresión
      const totalSteps = 100
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.floor(Math.random() * 5) + 1
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 100)

      // Simulamos el tiempo que toma comprimir
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Crear un blob simulado para la descarga
      const blob = new Blob(["Contenido simulado del archivo comprimido"], { type: "application/octet-stream" })
      const url = URL.createObjectURL(blob)

      // Generar un nombre para el archivo comprimido
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const filename = `archivos_comprimidos_${timestamp}.${data.format}`

      setDownloadUrl(url)
      setDownloadFilename(filename)

      // Registrar la operación en el historial
      // En una aplicación real, esto sería una llamada a la API
      const currentDate = new Date().toISOString()
      const currentUser = "Usuario Actual" // En una app real, esto vendría del contexto de autenticación

      // Aquí se guardaría en la base de datos
      console.log("Operación registrada:", {
        id: Math.random().toString(36).substring(2, 9),
        operationType: "compression",
        inputFiles: selectedFiles.map((f) => f.name).join(", "),
        outputFile: filename,
        format: data.format,
        compressionLevel: data.compressionLevel,
        hasPassword: !!data.password,
        createdBy: currentUser,
        createdAt: currentDate,
      })

      toast({
        title: "Compresión completada",
        description: "Los archivos han sido comprimidos correctamente",
      })

      // Iniciar descarga automática
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Notificar al componente padre
      onOperationComplete()
    } catch (error) {
      toast({
        title: "Error en la compresión",
        description: "No se pudieron comprimir los archivos",
        variant: "destructive",
      })
    } finally {
      setIsCompressing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getTotalSize = () => {
    return selectedFiles.reduce((total, file) => total + file.size, 0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprimir archivos</CardTitle>
        <CardDescription>
          Comprima múltiples archivos en un solo archivo ZIP, RAR o 7Z. El archivo comprimido se descargará
          automáticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="files">Seleccionar archivos</Label>
            <div className="flex items-center gap-2">
              <Input
                id="files"
                type="file"
                multiple
                className="flex-1"
                disabled={isCompressing}
                {...register("files")}
                onChange={handleFileChange}
              />
              <Button type="button" variant="outline" size="icon" disabled={isCompressing}>
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {errors.files && <p className="text-sm text-red-500">{errors.files.message}</p>}

            {selectedFiles.length > 0 && (
              <div className="mt-2 p-3 border rounded-md">
                <p className="text-sm font-medium">
                  {selectedFiles.length} archivo(s) seleccionado(s) ({formatFileSize(getTotalSize())})
                </p>
                <div className="mt-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      {file.name} ({formatFileSize(file.size)})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Formato de compresión</Label>
              <Select
                defaultValue="zip"
                onValueChange={(value) => setValue("format", value as "zip" | "rar" | "7z")}
                disabled={isCompressing}
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Seleccione un formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zip">ZIP</SelectItem>
                  <SelectItem value="rar">RAR</SelectItem>
                  <SelectItem value="7z">7Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="compressionLevel">Nivel de compresión</Label>
              <Select
                defaultValue="normal"
                onValueChange={(value) => setValue("compressionLevel", value as "fast" | "normal" | "maximum")}
                disabled={isCompressing}
              >
                <SelectTrigger id="compressionLevel">
                  <SelectValue placeholder="Seleccione un nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Rápido (menos compresión)</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="maximum">Máximo (más lento)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña (opcional)</Label>
            <Input
              id="password"
              type="password"
              placeholder="Dejar en blanco para no proteger"
              disabled={isCompressing}
              {...register("password")}
            />
            <p className="text-xs text-muted-foreground">
              Si establece una contraseña, el archivo comprimido estará protegido y solo podrá abrirse con ella.
            </p>
          </div>

          {isCompressing && (
            <div className="space-y-2">
              <Label>Progreso</Label>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">{progress}%</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isCompressing || selectedFiles.length === 0}>
            {isCompressing ? (
              "Comprimiendo archivos..."
            ) : (
              <>
                <FileZip className="mr-2 h-4 w-4" />
                Comprimir y descargar
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

