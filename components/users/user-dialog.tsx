"use client"

import { useState, useEffect } from "react"
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

const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Ingrese un email válido" }),
  role: z.enum(["admin", "operator"]),
  status: z.enum(["active", "inactive"]),
})

type UserFormValues = z.infer<typeof userSchema>

interface UserDialogProps {
  user: UserFormValues | null
  open: boolean
  mode: "edit" | "view"
  onOpenChange: (open: boolean) => void
  onSave: (user: UserFormValues) => void
}

export function UserDialog({ user, open, mode, onOpenChange, onSave }: UserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: user || {
      id: "",
      name: "",
      email: "",
      role: "operator",
      status: "active",
    },
  })

  useEffect(() => {
    if (user) {
      reset(user)
    }
  }, [user, reset])

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true)
    try {
      // En un caso real, esto sería una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave(data)
    } catch (error) {
      console.error("Error al guardar usuario:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Editar usuario" : "Ver usuario"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modifique los datos del usuario y guarde los cambios."
              : "Detalles del usuario seleccionado."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" disabled={mode === "view" || isLoading} {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" disabled={mode === "view" || isLoading} {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                disabled={mode === "view" || isLoading}
                onValueChange={(value) => setValue("role", value as "admin" | "operator")}
                defaultValue={user?.role || "operator"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="operator">Operador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                disabled={mode === "view" || isLoading}
                onValueChange={(value) => setValue("status", value as "active" | "inactive")}
                defaultValue={user?.status || "active"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {mode === "edit" && (
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

