import { SalesTable } from "@/components/sales/sales-table"
import { SaleCreateButton } from "@/components/sales/sale-create-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ventas - EcoSoft",
  description: "Gestión de ventas del sistema EcoSoft",
}

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ventas</h1>
        <SaleCreateButton />
      </div>
      <SalesTable />
    </div>
  )
}

