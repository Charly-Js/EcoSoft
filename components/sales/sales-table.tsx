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
import { SaleDialog } from "@/components/sales/sale-dialog"
import { MoreHorizontal, Eye, FileText } from "lucide-react"

// En un caso real, estos datos vendrían de una API
const initialSales = [
  {
    id: "1",
    customer: "Juan Pérez",
    date: "2023-05-15",
    total: 1299.98,
    status: "completed",
    items: [
      { id: "1", name: "Laptop HP", price: 799.99, quantity: 1 },
      { id: "3", name: "Teclado Logitech", price: 49.99, quantity: 1 },
      { id: "4", name: "Mouse Logitech", price: 29.99, quantity: 1 },
    ],
  },
  {
    id: "2",
    customer: "María López",
    date: "2023-05-16",
    total: 199.99,
    status: "completed",
    items: [{ id: "2", name: "Monitor Dell", price: 199.99, quantity: 1 }],
  },
  {
    id: "3",
    customer: "Carlos Rodríguez",
    date: "2023-05-17",
    total: 79.98,
    status: "pending",
    items: [
      { id: "3", name: "Teclado Logitech", price: 49.99, quantity: 1 },
      { id: "4", name: "Mouse Logitech", price: 29.99, quantity: 1 },
    ],
  },
  {
    id: "4",
    customer: "Ana Martínez",
    date: "2023-05-18",
    total: 149.99,
    status: "cancelled",
    items: [{ id: "5", name: "Impresora HP", price: 149.99, quantity: 1 }],
  },
  {
    id: "5",
    customer: "Pedro Sánchez",
    date: "2023-05-19",
    total: 999.97,
    status: "completed",
    items: [
      { id: "1", name: "Laptop HP", price: 799.99, quantity: 1 },
      { id: "3", name: "Teclado Logitech", price: 49.99, quantity: 1 },
      { id: "4", name: "Mouse Logitech", price: 29.99, quantity: 5 },
    ],
  },
]

export function SalesTable() {
  const [sales] = useState(initialSales)
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleView = (sale: any) => {
    setSelectedSale(sale)
    setIsDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completada</Badge>
      case "pending":
        return <Badge variant="warning">Pendiente</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">#{sale.id}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>{formatDate(sale.date)}</TableCell>
                <TableCell>${sale.total.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(sale.status)}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleView(sale)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Generar factura
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SaleDialog sale={selectedSale} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}

