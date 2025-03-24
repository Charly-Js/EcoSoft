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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Esquema de validación para el formulario
const contactSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Ingrese un email válido" }),
  phone: z.string().min(9, { message: "Ingrese un número de teléfono válido" }),
  role: z.enum(["admin", "user"]),
  zone: z.string().min(1, { message: "Seleccione una zona de trabajo" }),
})

type ContactFormValues = z.infer<typeof contactSchema>

// Zonas de trabajo disponibles
const workZones = ["Ventas", "Marketing", "Desarrollo", "Soporte"]

interface ContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (contact: ContactFormValues) => void
}

export function ContactDialog({ open, onOpenChange, onSave }: ContactDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "user",
      zone: "",
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true)
    try {
      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSave(data)
      reset()
    } catch (error) {
      console.error("Error al guardar contacto:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar nuevo contacto</DialogTitle>
          <DialogDescription>Complete el formulario para agregar un nuevo contacto a la plataforma.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" disabled={isLoading} {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" disabled={isLoading} {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" disabled={isLoading} {...register("phone")} />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  defaultValue="user"
                  onValueChange={(value) => setValue("role", value as "admin" | "user")}
                  disabled={isLoading}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="user">Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="zone">Zona de trabajo</Label>
                <Select onValueChange={(value) => setValue("zone", value)} disabled={isLoading}>
                  <SelectTrigger id="zone">
                    <SelectValue placeholder="Seleccione una zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {workZones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.zone && <p className="text-sm text-red-500">{errors.zone.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-ecosoft-600 hover:bg-ecosoft-700">
              {isLoading ? "Guardando..." : "Guardar contacto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

