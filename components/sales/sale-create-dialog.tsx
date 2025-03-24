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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Trash, Plus } from "lucide-react"

// En un caso real, estos datos vendrían de una API
const availableProducts = [
  { id: "1", name: "Laptop HP", price: 799.99, stock: 15 },
  { id: "2", name: "Monitor Dell", price: 199.99, stock: 25 },
  { id: "3", name: "Teclado Logitech", price: 49.99, stock: 30 },
  { id: "4", name: "Mouse Logitech", price: 29.99, stock: 40 },
  { id: "5", name: "Impresora HP", price: 149.99, stock: 10 },
]

const saleItemSchema = z.object({
  productId: z.string().min(1, { message: "Seleccione un producto" }),
  quantity: z.coerce.number().int().positive({ message: "La cantidad debe ser un número entero positivo" }),
})

const saleCreateSchema = z.object({
  customer: z.string().min(2, { message: "El nombre del cliente debe tener al menos 2 caracteres" }),
  items: z.array(saleItemSchema).min(1, { message: "Debe agregar al menos un producto" }),
})

type SaleItemFormValues = z.infer<typeof saleItemSchema>
type SaleCreateFormValues = z.infer<typeof saleCreateSchema>

interface SaleCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SaleCreateDialog({ open, onOpenChange }: SaleCreateDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SaleCreateFormValues>({
    resolver: zodResolver(saleCreateSchema),
    defaultValues: {
      customer: "",
      items: [],
    },
  })

  const addItem = () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Seleccione un producto",
        variant: "destructive",
      })
      return
    }

    if (quantity <= 0) {
      toast({
        title: "Error",
        description: "La cantidad debe ser mayor a 0",
        variant: "destructive",
      })
      return
    }

    const product = availableProducts.find((p) => p.id === selectedProduct)
    if (!product) return

    if (quantity > product.stock) {
      toast({
        title: "Error",
        description: `Solo hay ${product.stock} unidades disponibles`,
        variant: "destructive",
      })
      return
    }

    const existingItemIndex = items.findIndex((item) => item.productId === selectedProduct)

    if (existingItemIndex >= 0) {
      const newItems = [...items]
      const newQuantity = newItems[existingItemIndex].quantity + quantity

      if (newQuantity > product.stock) {
        toast({
          title: "Error",
          description: `Solo hay ${product.stock} unidades disponibles`,
          variant: "destructive",
        })
        return
      }

      newItems[existingItemIndex].quantity = newQuantity
      setItems(newItems)
    } else {
      setItems([...items, { productId: selectedProduct, quantity }])
    }

    setSelectedProduct("")
    setQuantity(1)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const getProductById = (id: string) => {
    return availableProducts.find((p) => p.id === id)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = getProductById(item.productId)
      return total + (product ? product.price * item.quantity : 0)
    }, 0)
  }

  const onSubmit = async (data: SaleCreateFormValues) => {
    setIsLoading(true)
    try {
      // En un caso real, esto sería una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Venta creada",
        description: "La venta ha sido registrada exitosamente",
      })

      reset()
      setItems([])
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar la venta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Registrar nueva venta</DialogTitle>
          <DialogDescription>Complete el formulario para registrar una nueva venta en el sistema.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Cliente</Label>
              <Input id="customer" disabled={isLoading} {...register("customer")} />
              {errors.customer && <p className="text-sm text-red-500">{errors.customer.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label>Productos</Label>
              <div className="flex gap-2">
                <Select disabled={isLoading} value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccione un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ${product.price.toFixed(2)} ({product.stock} disponibles)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                  disabled={isLoading}
                  className="w-20"
                />
                <Button type="button" onClick={addItem} disabled={isLoading}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {items.length > 0 ? (
                <div className="rounded-md border mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-right">Cantidad</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => {
                        const product = getProductById(item.productId)
                        if (!product) return null

                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">${(product.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(index)}
                                disabled={isLoading}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">${calculateTotal().toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay productos agregados</p>
              )}

              {errors.items && <p className="text-sm text-red-500">{errors.items.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || items.length === 0}>
              {isLoading ? "Registrando..." : "Registrar venta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

