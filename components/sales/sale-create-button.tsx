"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SaleCreateDialog } from "@/components/sales/sale-create-dialog"

export function SaleCreateButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Nueva venta
      </Button>
      <SaleCreateDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}

