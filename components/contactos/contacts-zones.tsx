"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Plus, Users, Briefcase, Trash } from "lucide-react"
import { useAuth } from "@/context/auth-context"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Datos de ejemplo para las zonas de trabajo
const initialWorkZones = [
  {
    id: "1",
    name: "Ventas",
    description: "Equipo de ventas y atención al cliente",
    members: 12,
    createdAt: "2023-01-15T10:30:00",
  },
  {
    id: "2",
    name: "Marketing",
    description: "Equipo de marketing y publicidad",
    members: 8,
    createdAt: "2023-01-20T14:45:00",
  },
  {
    id: "3",
    name: "Desarrollo",
    description: "Equipo de desarrollo de software",
    members: 15,
    createdAt: "2023-01-10T09:15:00",
  },
  {
    id: "4",
    name: "Soporte",
    description: "Equipo de soporte técnico",
    members: 10,
    createdAt: "2023-02-05T11:30:00",
  },
]

export function ContactsZones() {
  const [workZones, setWorkZones] = useState(initialWorkZones)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  const [newZoneName, setNewZoneName] = useState("")
  const [newZoneDescription, setNewZoneDescription] = useState("")
  const { toast } = useToast()
  const { user } = useAuth()

  // Verificar si el usuario es administrador
  const isAdmin = user?.role === "admin"

  const handleAddZone = () => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden agregar zonas de trabajo",
        variant: "destructive",
      })
      return
    }

    setNewZoneName("")
    setNewZoneDescription("")
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden eliminar zonas de trabajo",
        variant: "destructive",
      })
      return
    }

    setSelectedZoneId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedZoneId) {
      // En una aplicación real, esto sería una llamada a la API
      setWorkZones((prev) => prev.filter((zone) => zone.id !== selectedZoneId))

      toast({
        title: "Zona eliminada",
        description: "La zona de trabajo ha sido eliminada correctamente",
      })

      setDeleteDialogOpen(false)
      setSelectedZoneId(null)
    }
  }

  const handleSaveZone = () => {
    if (!newZoneName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Debe ingresar un nombre para la zona de trabajo",
        variant: "destructive",
      })
      return
    }

    // En una aplicación real, esto sería una llamada a la API
    const newZone = {
      id: Math.random().toString(36).substring(2, 9),
      name: newZoneName,
      description: newZoneDescription,
      members: 0,
      createdAt: new Date().toISOString(),
    }

    setWorkZones((prev) => [...prev, newZone])

    toast({
      title: "Zona agregada",
      description: "La zona de trabajo ha sido agregada correctamente",
    })

    setIsDialogOpen(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Zonas de trabajo</h2>
        {isAdmin && (
          <Button onClick={handleAddZone} className="bg-ecosoft-600 hover:bg-ecosoft-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva zona
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workZones.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">No hay zonas de trabajo definidas</div>
        ) : (
          workZones.map((zone) => (
            <Card key={zone.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-ecosoft-600" />
                  {zone.name}
                </CardTitle>
                <CardDescription>{zone.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{zone.members} miembros</span>
                </div>
                <div className="text-sm text-muted-foreground mt-2">Creada el {formatDate(zone.createdAt)}</div>
              </CardContent>
              {isAdmin && (
                <CardFooter className="pt-0 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(zone.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar nueva zona de trabajo</DialogTitle>
            <DialogDescription>Complete el formulario para agregar una nueva zona de trabajo.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="zoneName">Nombre de la zona</Label>
              <Input
                id="zoneName"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Ej: Recursos Humanos"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zoneDescription">Descripción (opcional)</Label>
              <Input
                id="zoneDescription"
                value={newZoneDescription}
                onChange={(e) => setNewZoneDescription(e.target.value)}
                placeholder="Ej: Equipo de recursos humanos y administración"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveZone} className="bg-ecosoft-600 hover:bg-ecosoft-700">
              Guardar zona
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la zona de trabajo y podría afectar a los usuarios asignados a ella. Esta acción no
              se puede deshacer.
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

