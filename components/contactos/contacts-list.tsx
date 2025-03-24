"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Mail, Phone, Trash, UserPlus, Filter } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContactDialog } from "@/components/contactos/contact-dialog"
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

// Datos de ejemplo para los contactos
const initialContacts = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+34 612 345 678",
    role: "admin",
    zone: "Ventas",
    status: "active",
  },
  {
    id: "2",
    name: "María López",
    email: "maria@example.com",
    phone: "+34 623 456 789",
    role: "user",
    zone: "Marketing",
    status: "active",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    phone: "+34 634 567 890",
    role: "user",
    zone: "Ventas",
    status: "active",
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "ana@example.com",
    phone: "+34 645 678 901",
    role: "user",
    zone: "Desarrollo",
    status: "active",
  },
  {
    id: "5",
    name: "Pedro Sánchez",
    email: "pedro@example.com",
    phone: "+34 656 789 012",
    role: "admin",
    zone: "Desarrollo",
    status: "active",
  },
  {
    id: "6",
    name: "Laura Gómez",
    email: "laura@example.com",
    phone: "+34 667 890 123",
    role: "user",
    zone: "Marketing",
    status: "active",
  },
  {
    id: "7",
    name: "Miguel Torres",
    email: "miguel@example.com",
    phone: "+34 678 901 234",
    role: "user",
    zone: "Soporte",
    status: "active",
  },
  {
    id: "8",
    name: "Sofía Ramírez",
    email: "sofia@example.com",
    phone: "+34 689 012 345",
    role: "user",
    zone: "Soporte",
    status: "inactive",
  },
]

// Zonas de trabajo disponibles
const workZones = ["Todas", "Ventas", "Marketing", "Desarrollo", "Soporte"]

export function ContactsList() {
  const [contacts, setContacts] = useState(initialContacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedZone, setSelectedZone] = useState("Todas")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  // Verificar si el usuario es administrador
  const isAdmin = user?.role === "admin"

  // Filtrar contactos por búsqueda y zona
  const filteredContacts = contacts.filter(
    (contact) =>
      (contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)) &&
      (selectedZone === "Todas" || contact.zone === selectedZone),
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleZoneChange = (zone: string) => {
    setSelectedZone(zone)
  }

  const handleAddContact = () => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden agregar contactos",
        variant: "destructive",
      })
      return
    }

    setIsDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden eliminar contactos",
        variant: "destructive",
      })
      return
    }

    setSelectedContactId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedContactId) {
      // En una aplicación real, esto sería una llamada a la API
      setContacts((prev) => prev.filter((contact) => contact.id !== selectedContactId))

      toast({
        title: "Contacto eliminado",
        description: "El contacto ha sido eliminado correctamente",
      })

      setDeleteDialogOpen(false)
      setSelectedContactId(null)
    }
  }

  const handleContactSaved = (newContact: any) => {
    // En una aplicación real, esto sería una llamada a la API
    setContacts((prev) => [
      ...prev,
      {
        ...newContact,
        id: Math.random().toString(36).substring(2, 9),
        status: "active",
      },
    ])

    toast({
      title: "Contacto agregado",
      description: "El contacto ha sido agregado correctamente",
    })

    setIsDialogOpen(false)
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre, email o teléfono..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <div className="w-40">
            <Select value={selectedZone} onValueChange={handleZoneChange}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por zona" />
              </SelectTrigger>
              <SelectContent>
                {workZones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isAdmin && (
            <Button onClick={handleAddContact} className="bg-ecosoft-600 hover:bg-ecosoft-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">No se encontraron contactos</div>
        ) : (
          filteredContacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-ecosoft-100 text-ecosoft-700">
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.zone}</p>
                    </div>
                  </div>
                  <Badge
                    variant={contact.role === "admin" ? "default" : "outline"}
                    className={contact.role === "admin" ? "bg-ecosoft-600" : ""}
                  >
                    {contact.role === "admin" ? "Admin" : "Usuario"}
                  </Badge>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${contact.email}`} className="text-ecosoft-600 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${contact.phone}`} className="text-ecosoft-600 hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                </div>
                {isAdmin && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(contact.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <ContactDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleContactSaved} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el contacto permanentemente. Esta acción no se puede deshacer.
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

