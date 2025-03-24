"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Video, Search, Trash, AlertCircle } from "lucide-react"
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

// Datos de ejemplo para el historial de reuniones
const initialMeetingsHistory = [
  {
    id: "1",
    title: "Reunión de planificación semanal",
    scheduledFor: "2023-06-15T10:30:00",
    duration: "60 minutos",
    participants: "Juan Pérez, María López, Carlos Rodríguez",
    createdBy: "Juan Pérez",
    createdAt: "2023-06-14T14:45:00",
    status: "completed",
  },
  {
    id: "2",
    title: "Revisión de proyecto EcoSoft",
    scheduledFor: "2023-06-16T15:00:00",
    duration: "45 minutos",
    participants: "Pedro Sánchez, Ana Martínez",
    createdBy: "Pedro Sánchez",
    createdAt: "2023-06-15T09:15:00",
    status: "scheduled",
  },
  {
    id: "3",
    title: "Capacitación nuevas funcionalidades",
    scheduledFor: "2023-06-13T11:00:00",
    duration: "90 minutos",
    participants: "Juan Pérez, María López, Carlos Rodríguez, Ana Martínez, Pedro Sánchez",
    createdBy: "María López",
    createdAt: "2023-06-12T16:20:00",
    status: "completed",
  },
  {
    id: "4",
    title: "Reunión con cliente XYZ",
    scheduledFor: "2023-06-20T09:00:00",
    duration: "60 minutos",
    participants: "Juan Pérez, Pedro Sánchez",
    createdBy: "Juan Pérez",
    createdAt: "2023-06-15T10:30:00",
    status: "scheduled",
  },
  {
    id: "5",
    title: "Presentación de resultados Q2",
    scheduledFor: "2023-06-10T14:00:00",
    duration: "120 minutos",
    participants: "Juan Pérez, María López, Carlos Rodríguez, Ana Martínez, Pedro Sánchez",
    createdBy: "Pedro Sánchez",
    createdAt: "2023-06-08T11:30:00",
    status: "cancelled",
  },
]

export function MeetingsHistory() {
  const [meetingsHistory, setMeetingsHistory] = useState(initialMeetingsHistory)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  // Verificar si el usuario es administrador
  const isAdmin = user?.role === "admin"

  const filteredHistory = meetingsHistory.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.participants.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.createdBy.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDeleteClick = (id: string) => {
    if (!isAdmin) {
      toast({
        title: "Permiso denegado",
        description: "Solo los administradores pueden eliminar registros del historial",
        variant: "destructive",
      })
      return
    }

    setSelectedMeetingId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedMeetingId) {
      // En una aplicación real, esto sería una llamada a la API
      setMeetingsHistory((prev) => prev.filter((item) => item.id !== selectedMeetingId))

      toast({
        title: "Registro eliminado",
        description: "El registro ha sido eliminado del historial",
      })

      setDeleteDialogOpen(false)
      setSelectedMeetingId(null)
    }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Programada
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completada
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelada
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por título, participantes o creador..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {!isAdmin && (
          <p className="mt-2 text-sm text-muted-foreground flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Solo los administradores pueden eliminar registros del historial
          </p>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Fecha programada</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Participantes</TableHead>
              <TableHead>Creado por</TableHead>
              <TableHead>Estado</TableHead>
              {isAdmin && <TableHead className="w-[80px]">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 8 : 7} className="text-center py-8 text-muted-foreground">
                  No se encontraron registros
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Video className="h-5 w-5 text-ecosoft-600" />
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{formatDate(item.scheduledFor)}</TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={item.participants}>
                    {item.participants}
                  </TableCell>
                  <TableCell>{item.createdBy}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(item.id)}
                        title="Eliminar registro"
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el registro del historial de reuniones. Esta acción no se puede deshacer.
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

