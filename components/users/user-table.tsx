"use client"

import type React from "react"

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
import { UserDialog } from "@/components/users/user-dialog"
import { MoreHorizontal, Pencil, Trash, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// En un caso real, estos datos vendrían de una API
const initialUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-06-15T10:30:00",
    createdAt: "2023-01-10T08:15:00",
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-06-14T14:45:00",
    createdAt: "2023-01-15T09:20:00",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    role: "user",
    status: "inactive",
    lastLogin: "2023-05-20T11:30:00",
    createdAt: "2023-02-05T10:45:00",
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "ana@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-06-10T16:20:00",
    createdAt: "2023-02-10T14:30:00",
  },
  {
    id: "5",
    name: "Pedro Sánchez",
    email: "pedro@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-06-12T09:15:00",
    createdAt: "2023-03-01T11:10:00",
  },
]

export function UserTable() {
  const [users, setUsers] = useState(initialUsers)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"edit" | "view">("view")
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleView = (user: any) => {
    setSelectedUser(user)
    setDialogMode("view")
    setIsDialogOpen(true)
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setDialogMode("edit")
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      // En un caso real, esto sería una llamada a la API
      setUsers(users.filter((user) => user.id !== userToDelete))

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente",
      })

      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleSave = (updatedUser: any) => {
    // En un caso real, esto sería una llamada a la API
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    setIsDialogOpen(false)

    toast({
      title: "Usuario actualizado",
      description: "Los datos del usuario han sido actualizados correctamente",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre o email..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Último acceso</TableHead>
              <TableHead>Fecha de registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "outline"}
                      className="bg-ecosoft-600 hover:bg-ecosoft-700"
                    >
                      {user.role === "admin" ? "Administrador" : "Usuario"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "active" ? "outline" : "destructive"}
                      className={user.status === "active" ? "bg-green-50 text-green-700 border-green-200" : ""}
                    >
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleView(user)}>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(user.id)} className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserDialog
        user={selectedUser}
        open={isDialogOpen}
        mode={dialogMode}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará al usuario permanentemente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

