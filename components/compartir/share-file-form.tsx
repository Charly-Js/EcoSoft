"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FileIcon, Upload, Send } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

// Esquema de validación para el formulario
const shareFormSchema = z.object({
  file: z.instanceof(File, { message: "Debe seleccionar un archivo" }),
  recipients: z.array(z.string()).min(1, { message: "Debe seleccionar al menos un destinatario" }),
  message: z.string().optional(),
  expirationDays: z.coerce.number().int().min(1).max(30).optional(),
})

type ShareFormValues = z.infer<typeof shareFormSchema>

// Lista de usuarios de ejemplo
const availableUsers = [
  { id: "1", name: "Juan Pérez", email: "juan@example.com", role: "admin" },
  { id: "2", name: "María López", email: "maria@example.com", role: "user" },
  { id: "3", name: "Carlos Rodríguez", email: "carlos@example.com", role: "user" },
  { id: "4", name: "Ana Martínez", email: "ana@example.com", role: "user" },
  { id: "5", name: "Pedro Sánchez", email: "pedro@example.com", role: "admin" },
]

interface ShareFileFormProps {
  onFileShared: () => void
}

export function ShareFileForm({ onFileShared }: ShareFileFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ShareFormValues>({
    resolver: zodResolver(shareFormSchema),
    defaultValues: {
      recipients: [],
      message: "",
      expirationDays: 7,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setValue("file", file)
    }
  }

  const handleRecipientsChange = (values: string[]) => {
    setValue("recipients", values)
  }

  const onSubmit = async (data: ShareFormValues) => {
    setIsLoading(true)

    try {
      // Simulamos el proceso de compartir el archivo
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Registramos el archivo compartido en el historial
      // En una aplicación real, esto sería una llamada a la API
      const currentDate = new Date().toISOString()
      const currentUser = "Usuario Actual" // En una app real, esto vendría del contexto de autenticación

      // Generamos un registro para cada destinatario
      data.recipients.forEach((recipientId) => {
        const recipient = availableUsers.find((user) => user.id === recipientId)

        if (recipient) {
          // Aquí se guardaría en la base de datos
          console.log("Archivo compartido:", {
            fileId: Math.random().toString(36).substring(2, 9),
            fileName: data.file.name,
            fileType: data.file.type,
            fileSize: data.file.size,
            sharedBy: currentUser,
            sharedTo: recipient.name,
            sharedAt: currentDate,
            expiresAt: data.expirationDays
              ? new Date(Date.now() + data.expirationDays * 24 * 60 * 60 * 1000).toISOString()
              : null,
            message: data.message || "",
          })
        }
      })

      toast({
        title: "Archivo compartido",
        description: `El archivo ha sido compartido con ${data.recipients.length} usuario(s)`,
      })

      // Limpiar el formulario
      reset()
      setSelectedFile(null)

      // Notificar al componente padre
      onFileShared()
    } catch (error) {
      toast({
        title: "Error al compartir",
        description: "No se pudo compartir el archivo. Inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName?.split(".").pop()?.toLowerCase()

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compartir un archivo</CardTitle>
        <CardDescription>
          Seleccione un archivo de su equipo para compartirlo con otros usuarios de la plataforma. Los archivos
          compartidos quedarán registrados en el sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">Seleccionar archivo</Label>
            <div className="flex items-center gap-4">
              <Input id="file" type="file" onChange={handleFileChange} disabled={isLoading} className="flex-1" />
              <Button type="button" variant="outline" size="icon" disabled={isLoading}>
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {errors.file && <p className="text-sm text-red-500">{errors.file.message}</p>}

            {selectedFile && (
              <div className="mt-2 p-3 border rounded-md flex items-center">
                {getFileIcon(selectedFile.name)}
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Destinatarios</Label>
            <MultiSelect value={watch("recipients")} onValueChange={handleRecipientsChange} disabled={isLoading}>
              <MultiSelectTrigger id="recipients" className="w-full">
                <MultiSelectValue placeholder="Seleccione destinatarios" />
              </MultiSelectTrigger>
              <MultiSelectContent>
                {availableUsers.map((user) => (
                  <MultiSelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </MultiSelectItem>
                ))}
              </MultiSelectContent>
            </MultiSelect>
            {errors.recipients && <p className="text-sm text-red-500">{errors.recipients.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea
              id="message"
              placeholder="Escriba un mensaje para los destinatarios"
              disabled={isLoading}
              {...register("message")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expirationDays">Días de expiración (opcional)</Label>
            <Select
              defaultValue="7"
              onValueChange={(value) => setValue("expirationDays", Number.parseInt(value))}
              disabled={isLoading}
            >
              <SelectTrigger id="expirationDays">
                <SelectValue placeholder="Seleccione días de expiración" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 día</SelectItem>
                <SelectItem value="3">3 días</SelectItem>
                <SelectItem value="7">7 días</SelectItem>
                <SelectItem value="14">14 días</SelectItem>
                <SelectItem value="30">30 días</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Después de este período, el archivo ya no estará disponible para los destinatarios.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              "Compartiendo archivo..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Compartir archivo
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

