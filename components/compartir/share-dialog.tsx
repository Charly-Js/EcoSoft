"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { FileIcon, Send } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Lista de usuarios de ejemplo
const availableUsers = [
  { id: "1", name: "Juan Pérez", email: "juan@example.com" },
  { id: "2", name: "María López", email: "maria@example.com" },
  { id: "3", name: "Carlos Rodríguez", email: "carlos@example.com" },
  { id: "4", name: "Ana Martínez", email: "ana@example.com" },
  { id: "5", name: "Pedro Sánchez", email: "pedro@example.com" },
]

const shareDialogSchema = z.object({
  recipient: z.string().min(1, { message: "Debe seleccionar un destinatario" }),
  message: z.string().optional(),
  expirationDays: z.coerce.number().int().min(1).max(30).optional(),
})

type ShareDialogFormValues = z.infer<typeof shareDialogSchema>

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: any
}

export function ShareDialog({ open, onOpenChange, file }: ShareDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ShareDialogFormValues>({
    resolver: zodResolver(shareDialogSchema),
    defaultValues: {
      recipient: "",
      message: "",
      expirationDays: 7,
    },
  })

  const onSubmit = async (data: ShareDialogFormValues) => {
    setIsLoading(true)
    try {
      // Simular una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const recipient = availableUsers.find((user) => user.id === data.recipient)

      toast({
        title: "Archivo compartido",
        description: `El archivo ha sido compartido con ${recipient?.name}`,
      })

      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo compartir el archivo",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Compartir archivo</DialogTitle>
          <DialogDescription>Comparta este archivo con otro usuario de la plataforma.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {file && (
              <div className="p-3 border rounded-md flex items-center">
                {getFileIcon(file.name)}
                <div className="ml-3">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.type}</p>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="recipient">Destinatario</Label>
              <Select onValueChange={(value) => setValue("recipient", value)} disabled={isLoading}>
                <SelectTrigger id="recipient">
                  <SelectValue placeholder="Seleccione un destinatario" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.recipient && <p className="text-sm text-red-500">{errors.recipient.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Mensaje (opcional)</Label>
              <Textarea
                id="message"
                placeholder="Escriba un mensaje para el destinatario"
                disabled={isLoading}
                {...register("message")}
              />
            </div>

            <div className="grid gap-2">
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
                Después de este período, el archivo ya no estará disponible para el destinatario.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                "Compartiendo..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Compartir
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

