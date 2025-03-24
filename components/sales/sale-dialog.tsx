"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface SaleDialogProps {
  sale: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SaleDialog({ sale, open, onOpenChange }: SaleDialogProps) {
  if (!sale) return null

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles de la venta #{sale.id}</DialogTitle>
          <DialogDescription>Información detallada de la venta</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cliente</p>
              <p className="text-lg font-semibold">{sale.customer}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha</p>
              <p className="text-lg font-semibold">{formatDate(sale.date)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <div className="mt-1">{getStatusBadge(sale.status)}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-lg font-semibold">${sale.total.toFixed(2)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Productos</p>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">${sale.total.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

