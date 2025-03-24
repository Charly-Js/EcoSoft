"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "lucide-react"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Lista de usuarios de ejemplo
const availableUsers = [
  { id: "1", name: "Juan Pérez", email: "juan@example.com", role: "admin", zone: "Ventas" },
  { id: "2", name: "María López", email: "maria@example.com", role: "user", zone: "Marketing" },
  { id: "3", name: "Carlos Rodríguez", email: "carlos@example.com", role: "user", zone: "Ventas" },
  { id: "4", name: "Ana Martínez", email: "ana@example.com", role: "user", zone: "Desarrollo" },
  { id: "5", name: "Pedro Sánchez", email: "pedro@example.com", role: "admin", zone: "Desarrollo" },
  { id: "6", name: "Laura Gómez", email: "laura@example.com", role: "user", zone: "Marketing" },
  { id: "7", name: "Miguel Torres", email: "miguel@example.com", role: "user", zone: "Soporte" },
  { id: "8", name: "Sofía Ramírez", email: "sofia@example.com", role: "user", zone: "Soporte" },
]

// Zonas de trabajo disponibles
const workZones = ["Todas", "Ventas", "Marketing", "Desarrollo", "Soporte"]

// Esquema de validación para el formulario
const createMeetingSchema = z.object({
  title: z.string().min(3, { message: "El título debe tener al menos 3 caracteres" }),
  description: z.string().optional(),
  date: z.date({ required_error: "La fecha es requerida" }),
  time: z.string().min(1, { message: "La hora es requerida" }),
  duration: z.string().min(1, { message: "La duración es requerida" }),
  participants: z.array(z.string()).min(1, { message: "Debe seleccionar al menos un participante" }),
})

type CreateMeetingFormValues = z.infer<typeof createMeetingSchema>

interface CreateMeetingProps {
  onMeetingCreated: () => void
}

export function CreateMeeting({ onMeetingCreated }: CreateMeetingProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [selectedZone, setSelectedZone] = useState("Todas")
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateMeetingFormValues>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      time: "10:00",
      duration: "60",
      participants: [],
    },
  })

  const selectedDate = watch("date")
  const selectedParticipants = watch("participants")

  // Filtrar usuarios por zona de trabajo
  const filteredUsers =
    selectedZone === "Todas" ? availableUsers : availableUsers.filter((user) => user.zone === selectedZone)

  const onSubmit = async (data: CreateMeetingFormValues) => {
    setIsCreating(true)

    try {
      // Simulamos la creación de la reunión
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generar un ID único para la reunión
      const meetingId = Math.random().toString(36).substring(2, 9)

      // Formatear fecha y hora
      const meetingDate = new Date(data.date)
      const [hours, minutes] = data.time.split(":").map(Number)
      meetingDate.setHours(hours, minutes)

      // Registrar la reunión en el historial
      const currentDate = new Date().toISOString()
      const currentUser = "Usuario Actual" // En una app real, esto vendría del contexto de autenticación

      // Aquí se guardaría en la base de datos
      console.log("Reunión creada:", {
        id: meetingId,
        title: data.title,
        description: data.description || "",
        scheduledFor: meetingDate.toISOString(),
        duration: `${data.duration} minutos`,
        participants: data.participants
          .map((id) => {
            const user = availableUsers.find((u) => u.id === id)
            return user ? user.name : id
          })
          .join(", "),
        createdBy: currentUser,
        createdAt: currentDate,
        status: "scheduled",
      })

      toast({
        title: "Reunión creada",
        description: `La reunión "${data.title}" ha sido programada correctamente`,
      })

      // Generar enlace de la reunión
      const meetingLink = `https://meet.ecosoft.com/${meetingId}`

      // Mostrar el enlace de la reunión
      toast({
        title: "Enlace de la reunión",
        description: (
          <div className="mt-2">
            <p className="mb-2">Comparta este enlace con los participantes:</p>
            <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded block overflow-x-auto">{meetingLink}</code>
          </div>
        ),
      })

      // Limpiar el formulario
      reset()

      // Notificar al componente padre
      onMeetingCreated()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la reunión. Inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear nueva reunión</CardTitle>
        <CardDescription>
          Complete el formulario para programar una nueva reunión virtual. Solo los administradores pueden crear
          reuniones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la reunión</Label>
            <Input
              id="title"
              placeholder="Ej: Reunión de planificación semanal"
              disabled={isCreating}
              {...register("title")}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Describa el propósito de la reunión"
              disabled={isCreating}
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                    disabled={isCreating}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccione una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setValue("date", date)}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input id="time" type="time" disabled={isCreating} {...register("time")} />
              {errors.time && <p className="text-sm text-red-500">{errors.time.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duración (minutos)</Label>
            <Select defaultValue="60" onValueChange={(value) => setValue("duration", value)} disabled={isCreating}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Seleccione la duración" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="90">1 hora 30 minutos</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
              </SelectContent>
            </Select>
            {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Zona de trabajo</Label>
            <Select value={selectedZone} onValueChange={setSelectedZone} disabled={isCreating}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una zona" />
              </SelectTrigger>
              <SelectContent>
                {workZones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Filtre los participantes por zona de trabajo</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants">Participantes</Label>
            <MultiSelect
              value={selectedParticipants}
              onValueChange={(values) => setValue("participants", values)}
              disabled={isCreating}
            >
              <MultiSelectTrigger id="participants" className="w-full">
                <MultiSelectValue placeholder="Seleccione participantes" />
              </MultiSelectTrigger>
              <MultiSelectContent>
                {filteredUsers.map((user) => (
                  <MultiSelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email}) - {user.zone}
                  </MultiSelectItem>
                ))}
              </MultiSelectContent>
            </MultiSelect>
            {errors.participants && <p className="text-sm text-red-500">{errors.participants.message}</p>}
            <p className="text-xs text-muted-foreground">Seleccionados: {selectedParticipants.length} participantes</p>
          </div>

          <Button type="submit" className="w-full bg-ecosoft-600 hover:bg-ecosoft-700" disabled={isCreating}>
            {isCreating ? "Creando reunión..." : "Crear reunión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

