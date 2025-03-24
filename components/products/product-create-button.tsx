"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProductCreateDialog } from "@/components/products/product-create-dialog"

export function ProductCreateButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo producto
      </Button>
      <ProductCreateDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}

