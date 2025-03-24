import { ProductTable } from "@/components/products/product-table"
import { ProductCreateButton } from "@/components/products/product-create-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Productos - EcoSoft",
  description: "Gestión de productos del sistema EcoSoft",
}

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Productos</h1>
        <ProductCreateButton />
      </div>
      <ProductTable />
    </div>
  )
}

