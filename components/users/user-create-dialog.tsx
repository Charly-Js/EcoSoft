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
import { useToast } from "@/hooks/use-toast"

const userCreateSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Ingrese un email válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message:
        "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial",
    }),
  role: z.enum(["admin", "user"]),
  status: z.enum(["active", "inactive"]),
})

type UserCreateFormValues = z.infer<typeof userCreateSchema>

interface UserCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserCreateDialog({ open, onOpenChange }: UserCreateDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserCreateFormValues>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      status: "active",
    },
  })

  const onSubmit = async (data: UserCreateFormValues) => {
    setIsLoading(true)
    try {
      // En un caso real, esto sería una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente",
      })

      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el usuario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo usuario</DialogTitle>
          <DialogDescription>
            Complete el formulario para crear un nuevo usuario en el sistema. Solo los administradores pueden crear
            usuarios.
          </DialogDescription>
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
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" disabled={isLoading} {...register("password")} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              <p className="text-xs text-muted-foreground">
                La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un
                carácter especial.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  disabled={isLoading}
                  onValueChange={(value) => setValue("role", value as "admin" | "user")}
                  defaultValue="user"
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
                <Label htmlFor="status">Estado</Label>
                <Select
                  disabled={isLoading}
                  onValueChange={(value) => setValue("status", value as "active" | "inactive")}
                  defaultValue="active"
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-ecosoft-600 hover:bg-ecosoft-700">
              {isLoading ? "Creando..." : "Crear usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

