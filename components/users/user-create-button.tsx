"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { UserCreateDialog } from "@/components/users/user-create-dialog"

export function UserCreateButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} className="bg-ecosoft-600 hover:bg-ecosoft-700">
        <UserPlus className="mr-2 h-4 w-4" />
        Nuevo usuario
      </Button>
      <UserCreateDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}

