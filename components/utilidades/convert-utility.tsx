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
import { FileText, ArrowRight, Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Esquema de validación para el formulario
const convertFormSchema = z.object({
  file: z.instanceof(File, {
    message: "Debe seleccionar un archivo",
  }),
  fromFormat: z.string().min(1, { message: "Debe seleccionar un formato de origen" }),
  toFormat: z.string().min(1, { message: "Debe seleccionar un formato de destino" }),
  quality: z.enum(["low", "medium", "high"]),
})

type ConvertFormValues = z.infer<typeof convertFormSchema>

// Mapeo de formatos de archivo
const formatExtensions: Record<string, string[]> = {
  document: ["docx", "pdf", "txt", "rtf", "odt"],
  spreadsheet: ["xlsx", "csv", "ods"],
  presentation: ["pptx", "pdf"],
  image: ["jpg", "png", "gif", "webp", "tiff"],
}

interface ConvertUtilityProps {
  onOperationComplete: () => void
}

export function ConvertUtility({ onOperationComplete }: ConvertUtilityProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
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
  } = useForm<ConvertFormValues>({
    resolver: zodResolver(convertFormSchema),
    defaultValues: {
      fromFormat: "",
      toFormat: "",
      quality: "high",
    },
  })

  const fromFormat = watch("fromFormat")
  const toFormat = watch("toFormat")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setValue("file", file)

      // Intentar detectar el formato del archivo
      const extension = file.name.split(".").pop()?.toLowerCase() || ""

      // Buscar a qué categoría pertenece la extensión
      let detectedFormat = ""
      for (const [format, extensions] of Object.entries(formatExtensions)) {
        if (extensions.includes(extension)) {
          detectedFormat = extension
          break
        }
      }

      if (detectedFormat) {
        setValue("fromFormat", detectedFormat)
      }
    }
  }

  const getCompatibleFormats = () => {
    if (!fromFormat) return []

    // Determinar la categoría del formato de origen
    let category = ""
    for (const [format, extensions] of Object.entries(formatExtensions)) {
      if (extensions.includes(fromFormat)) {
        category = format
        break
      }
    }

    // Si encontramos la categoría, devolver todos los formatos compatibles excepto el de origen
    if (category) {
      return formatExtensions[category].filter((ext) => ext !== fromFormat)
    }

    return []
  }

  const onSubmit = async (data: ConvertFormValues) => {
    setIsConverting(true)
    setProgress(0)

    try {
      // Simulamos el proceso de conversión
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

      // Simulamos el tiempo que toma convertir
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Crear un blob simulado para la descarga
      const blob = new Blob(["Contenido simulado del archivo convertido"], { type: "application/octet-stream" })
      const url = URL.createObjectURL(blob)

      // Generar un nombre para el archivo convertido
      const originalName = selectedFile?.name.split(".")[0] || "archivo"
      const filename = `${originalName}_convertido.${data.toFormat}`

      setDownloadUrl(url)
      setDownloadFilename(filename)

      // Registrar la operación en el historial
      // En una aplicación real, esto sería una llamada a la API
      const currentDate = new Date().toISOString()
      const currentUser = "Usuario Actual" // En una app real, esto vendría del contexto de autenticación

      // Aquí se guardaría en la base de datos
      console.log("Operación registrada:", {
        id: Math.random().toString(36).substring(2, 9),
        operationType: "conversion",
        inputFile: selectedFile?.name,
        outputFile: filename,
        fromFormat: data.fromFormat,
        toFormat: data.toFormat,
        quality: data.quality,
        createdBy: currentUser,
        createdAt: currentDate,
      })

      toast({
        title: "Conversión completada",
        description: "El archivo ha sido convertido correctamente",
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
        title: "Error en la conversión",
        description: "No se pudo convertir el archivo",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convertir archivos</CardTitle>
        <CardDescription>
          Convierta archivos entre diferentes formatos. El archivo convertido se descargará automáticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">Seleccionar archivo</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                className="flex-1"
                disabled={isConverting}
                {...register("file")}
                onChange={handleFileChange}
              />
              <Button type="button" variant="outline" size="icon" disabled={isConverting}>
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {errors.file && <p className="text-sm text-red-500">{errors.file.message}</p>}

            {selectedFile && (
              <div className="mt-2 p-3 border rounded-md">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 space-y-2">
              <Label htmlFor="fromFormat">Formato original</Label>
              <Select
                value={fromFormat}
                onValueChange={(value) => setValue("fromFormat", value)}
                disabled={isConverting}
              >
                <SelectTrigger id="fromFormat">
                  <SelectValue placeholder="Seleccione un formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docx">DOCX</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pptx">PPTX</SelectItem>
                </SelectContent>
              </Select>
              {errors.fromFormat && <p className="text-sm text-red-500">{errors.fromFormat.message}</p>}
            </div>

            <ArrowRight className="h-6 w-6 text-muted-foreground" />

            <div className="flex-1 space-y-2">
              <Label htmlFor="toFormat">Formato destino</Label>
              <Select
                value={toFormat}
                onValueChange={(value) => setValue("toFormat", value)}
                disabled={isConverting || !fromFormat}
              >
                <SelectTrigger id="toFormat">
                  <SelectValue placeholder="Seleccione un formato" />
                </SelectTrigger>
                <SelectContent>
                  {getCompatibleFormats().map((format) => (
                    <SelectItem key={format} value={format}>
                      {format.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.toFormat && <p className="text-sm text-red-500">{errors.toFormat.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quality">Calidad</Label>
            <Select
              defaultValue="high"
              onValueChange={(value) => setValue("quality", value as "low" | "medium" | "high")}
              disabled={isConverting}
            >
              <SelectTrigger id="quality">
                <SelectValue placeholder="Seleccione una calidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baja (archivo más pequeño)</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta (mejor calidad)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isConverting && (
            <div className="space-y-2">
              <Label>Progreso</Label>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">{progress}%</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isConverting || !selectedFile || !fromFormat || !toFormat}>
            {isConverting ? (
              "Convirtiendo archivo..."
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Convertir y descargar
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

