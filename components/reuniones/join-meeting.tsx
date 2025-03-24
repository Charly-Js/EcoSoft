"use client"

import { useState, useRef, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Video, Mic, MicOff, VideoOff, Phone, Users } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Esquema de validación para el formulario
const joinMeetingSchema = z.object({
  meetingId: z.string().min(5, { message: "El ID de la reunión debe tener al menos 5 caracteres" }),
})

type JoinMeetingFormValues = z.infer<typeof joinMeetingSchema>

// Datos de ejemplo para reuniones activas
const activeMeetings = [
  {
    id: "abc123",
    title: "Reunión de planificación semanal",
    host: "Juan Pérez",
    participants: 5,
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutos atrás
  },
  {
    id: "def456",
    title: "Revisión de proyecto EcoSoft",
    host: "María López",
    participants: 3,
    startedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutos atrás
  },
  {
    id: "ghi789",
    title: "Capacitación nuevas funcionalidades",
    host: "Pedro Sánchez",
    participants: 8,
    startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutos atrás
  },
]

export function JoinMeeting() {
  const [isJoining, setIsJoining] = useState(false)
  const [inMeeting, setInMeeting] = useState(false)
  const [currentMeeting, setCurrentMeeting] = useState<any>(null)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<JoinMeetingFormValues>({
    resolver: zodResolver(joinMeetingSchema),
    defaultValues: {
      meetingId: "",
    },
  })

  // Solicitar permisos de cámara y micrófono
  const requestMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: cameraEnabled,
        audio: micEnabled,
      })

      if (videoRef.current && cameraEnabled) {
        videoRef.current.srcObject = stream
      }

      setCameraPermission("granted")
      setMicPermission("granted")

      return stream
    } catch (error) {
      console.error("Error al acceder a los dispositivos:", error)

      // Determinar qué permiso fue denegado
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setCameraPermission("denied")
          setMicPermission("denied")

          toast({
            title: "Permisos denegados",
            description: "No se pudo acceder a la cámara y/o micrófono. Por favor, conceda los permisos necesarios.",
            variant: "destructive",
          })
        }
      }

      return null
    }
  }

  // Detener la transmisión de medios
  const stopMediaStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  // Unirse a una reunión
  const joinMeeting = async (meetingId: string) => {
    setIsJoining(true)

    try {
      // Buscar la reunión en las reuniones activas
      const meeting = activeMeetings.find((m) => m.id === meetingId)

      if (!meeting) {
        toast({
          title: "Reunión no encontrada",
          description: "El ID de reunión proporcionado no corresponde a una reunión activa",
          variant: "destructive",
        })
        setIsJoining(false)
        return
      }

      // Solicitar permisos de medios
      const stream = await requestMediaPermissions()

      if (!stream && (cameraEnabled || micEnabled)) {
        setIsJoining(false)
        return
      }

      // Simular conexión a la reunión
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setCurrentMeeting(meeting)
      setInMeeting(true)

      toast({
        title: "Conectado a la reunión",
        description: `Se ha unido a la reunión: ${meeting.title}`,
      })

      // Registrar en el historial
      console.log("Unido a la reunión:", {
        meetingId: meeting.id,
        title: meeting.title,
        joinedAt: new Date().toISOString(),
        cameraEnabled,
        micEnabled,
      })
    } catch (error) {
      console.error("Error al unirse a la reunión:", error)

      toast({
        title: "Error al unirse",
        description: "No se pudo establecer conexión con la reunión",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  // Manejar envío del formulario
  const onSubmit = async (data: JoinMeetingFormValues) => {
    joinMeeting(data.meetingId)
  }

  // Unirse a una reunión desde la lista
  const handleJoinFromList = (meetingId: string) => {
    setValue("meetingId", meetingId)
    joinMeeting(meetingId)
  }

  // Salir de la reunión
  const leaveMeeting = () => {
    stopMediaStream()
    setInMeeting(false)
    setCurrentMeeting(null)
    reset()

    toast({
      title: "Reunión finalizada",
      description: "Ha salido de la reunión",
    })
  }

  // Alternar cámara
  const toggleCamera = async () => {
    setCameraEnabled(!cameraEnabled)

    if (inMeeting) {
      stopMediaStream()

      if (!cameraEnabled) {
        // Si estamos activando la cámara
        await requestMediaPermissions()
      }
    }
  }

  // Alternar micrófono
  const toggleMic = () => {
    setMicEnabled(!micEnabled)

    if (inMeeting && videoRef.current && videoRef.current.srcObject) {
      const audioTracks = (videoRef.current.srcObject as MediaStream).getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !micEnabled
      })
    }
  }

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      stopMediaStream()
    }
  }, [])

  // Formatear duración
  const formatDuration = (startTimeString: string) => {
    const startTime = new Date(startTimeString)
    const now = new Date()
    const diffMs = now.getTime() - startTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) {
      return `${diffMins} min`
    } else {
      const hours = Math.floor(diffMins / 60)
      const mins = diffMins % 60
      return `${hours}h ${mins}m`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unirse a una reunión</CardTitle>
        <CardDescription>
          Ingrese el ID de la reunión para unirse o seleccione una reunión activa de la lista.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!inMeeting ? (
          <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meetingId">ID de la reunión</Label>
                <Input id="meetingId" placeholder="Ej: abc123" disabled={isJoining} {...register("meetingId")} />
                {errors.meetingId && <p className="text-sm text-red-500">{errors.meetingId.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="camera">Cámara</Label>
                  <Switch id="camera" checked={cameraEnabled} onCheckedChange={toggleCamera} disabled={isJoining} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="microphone">Micrófono</Label>
                  <Switch id="microphone" checked={micEnabled} onCheckedChange={toggleMic} disabled={isJoining} />
                </div>
              </div>

              <Button type="submit" className="w-full bg-ecosoft-600 hover:bg-ecosoft-700" disabled={isJoining}>
                {isJoining ? "Conectando..." : "Unirse a la reunión"}
              </Button>
            </form>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Reuniones activas</h3>

              {activeMeetings.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No hay reuniones activas en este momento</p>
              ) : (
                <div className="space-y-2">
                  {activeMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="p-4 border rounded-md flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium">{meeting.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Anfitrión: {meeting.host} •
                          <Users className="inline-block h-3 w-3 mx-1" />
                          {meeting.participants} participantes • Duración: {formatDuration(meeting.startedAt)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleJoinFromList(meeting.id)}
                        disabled={isJoining}
                        className="bg-ecosoft-600 hover:bg-ecosoft-700"
                      >
                        Unirse
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-md overflow-hidden aspect-video relative">
              {cameraEnabled ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-4xl">{currentMeeting?.host?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </div>
              )}

              <div className="absolute top-4 left-4">
                <Badge variant="outline" className="bg-black/50 text-white">
                  {currentMeeting?.title}
                </Badge>
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full bg-gray-800 hover:bg-gray-700 ${!micEnabled ? "bg-red-600 hover:bg-red-700" : ""}`}
                  onClick={toggleMic}
                >
                  {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full bg-gray-800 hover:bg-gray-700 ${!cameraEnabled ? "bg-red-600 hover:bg-red-700" : ""}`}
                  onClick={toggleCamera}
                >
                  {cameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
                <Button variant="destructive" size="icon" className="rounded-full" onClick={leaveMeeting}>
                  <Phone className="h-5 w-5 rotate-135" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Información de la reunión</h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Título:</span> {currentMeeting?.title}
                </p>
                <p>
                  <span className="font-medium">Anfitrión:</span> {currentMeeting?.host}
                </p>
                <p>
                  <span className="font-medium">Participantes:</span> {currentMeeting?.participants}
                </p>
                <p>
                  <span className="font-medium">Duración:</span> {formatDuration(currentMeeting?.startedAt)}
                </p>
                <p>
                  <span className="font-medium">ID de la reunión:</span> {currentMeeting?.id}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

