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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const productSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z.string().min(5, { message: "La descripción debe tener al menos 5 caracteres" }),
  price: z.coerce.number().positive({ message: "El precio debe ser positivo" }),
  stock: z.coerce.number().int().nonnegative({ message: "El stock debe ser un número entero no negativo" }),
  category: z.string().min(1, { message: "Seleccione una categoría" }),
  status: z.enum(["active", "inactive"]),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductDialogProps {
  product: ProductFormValues | null
  open: boolean
  mode: "edit" | "view"
  onOpenChange: (open: boolean) => void
  onSave: (product: ProductFormValues) => void
}

export function ProductDialog({ product, open, mode, onOpenChange, onSave }: ProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      id: "",
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      status: "active",
    },
  })

  useEffect(() => {
    if (product) {
      reset(product)
    }
  }, [product, reset])

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true)
    try {
      // En un caso real, esto sería una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave(data)
    } catch (error) {
      console.error("Error al guardar producto:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Editar producto" : "Ver producto"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modifique los datos del producto y guarde los cambios."
              : "Detalles del producto seleccionado."}
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
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" disabled={mode === "view" || isLoading} {...register("description")} />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  disabled={mode === "view" || isLoading}
                  {...register("price")}
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" disabled={mode === "view" || isLoading} {...register("stock")} />
                {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                disabled={mode === "view" || isLoading}
                onValueChange={(value) => setValue("category", value)}
                defaultValue={product?.category || ""}
              >
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
                disabled={mode === "view" || isLoading}
                onValueChange={(value) => setValue("status", value as "active" | "inactive")}
                defaultValue={product?.status || "active"}
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

