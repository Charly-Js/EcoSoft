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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const productCreateSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z.string().min(5, { message: "La descripción debe tener al menos 5 caracteres" }),
  price: z.coerce.number().positive({ message: "El precio debe ser positivo" }),
  stock: z.coerce.number().int().nonnegative({ message: "El stock debe ser un número entero no negativo" }),
  category: z.string().min(1, { message: "Seleccione una categoría" }),
  status: z.enum(["active", "inactive"]),
})

type ProductCreateFormValues = z.infer<typeof productCreateSchema>

interface ProductCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCreateDialog({ open, onOpenChange }: ProductCreateDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductCreateFormValues>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      status: "active",
    },
  })

  const onSubmit = async (data: ProductCreateFormValues) => {
    setIsLoading(true)
    try {
      // En un caso real, esto sería una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Producto creado",
        description: "El producto ha sido creado exitosamente",
      })

      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el producto",
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
          <DialogTitle>Crear nuevo producto</DialogTitle>
          <DialogDescription>Complete el formulario para crear un nuevo producto en el sistema.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" disabled={isLoading} {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" disabled={isLoading} {...register("description")} />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input id="price" type="number" step="0.01" disabled={isLoading} {...register("price")} />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" disabled={isLoading} {...register("stock")} />
                {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select disabled={isLoading} onValueChange={(value) => setValue("category", value)} defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electrónicos</SelectItem>
                  <SelectItem value="accessories">Accesorios</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="office">Oficina</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                disabled={isLoading}
                onValueChange={(value) => setValue("status", value as "active" | "inactive")}
                defaultValue="active"
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
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

