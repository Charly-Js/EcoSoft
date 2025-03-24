"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ProductDialog } from "@/components/products/product-dialog"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"

// En un caso real, estos datos vendrían de una API
const initialProducts = [
  {
    id: "1",
    name: "Laptop HP",
    description: "Laptop HP 15.6 pulgadas, 8GB RAM, 256GB SSD",
    price: 799.99,
    stock: 15,
    category: "electronics",
    status: "active",
  },
  {
    id: "2",
    name: "Monitor Dell",
    description: "Monitor Dell 24 pulgadas, Full HD",
    price: 199.99,
    stock: 25,
    category: "electronics",
    status: "active",
  },
  {
    id: "3",
    name: "Teclado Logitech",
    description: "Teclado inalámbrico Logitech",
    price: 49.99,
    stock: 30,
    category: "accessories",
    status: "active",
  },
  {
    id: "4",
    name: "Mouse Logitech",
    description: "Mouse inalámbrico Logitech",
    price: 29.99,
    stock: 40,
    category: "accessories",
    status: "active",
  },
  {
    id: "5",
    name: "Impresora HP",
    description: "Impresora multifuncional HP",
    price: 149.99,
    stock: 0,
    category: "electronics",
    status: "inactive",
  },
]

export function ProductTable() {
  const [products, setProducts] = useState(initialProducts)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"edit" | "view">("view")

  const handleEdit = (product: any) => {
    setSelectedProduct(product)
    setDialogMode("edit")
    setIsDialogOpen(true)
  }

  const handleDelete = (productId: string) => {
    // En un caso real, esto sería una llamada a la API
    setProducts(products.filter((product) => product.id !== productId))
  }

  const handleSave = (updatedProduct: any) => {
    // En un caso real, esto sería una llamada a la API
    setProducts(products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))
    setIsDialogOpen(false)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={product.status === "active" ? "success" : "destructive"}>
                    {product.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductDialog
        product={selectedProduct}
        open={isDialogOpen}
        mode={dialogMode}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </>
  )
}

