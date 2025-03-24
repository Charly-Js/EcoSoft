"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Camera, RefreshCw, Share2, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

// Lista de usuarios de ejemplo
const availableUsers = [
  { id: "1", name: "Juan Pérez", email: "juan@example.com", role: "admin" },
  { id: "2", name: "María López", email: "maria@example.com", role: "user" },
  { id: "3", name: "Carlos Rodríguez", email: "carlos@example.com", role: "user" },
  { id: "4", name: "Ana Martínez", email: "ana@example.com", role: "user" },
  { id: "5", name: "Pedro Sánchez", email: "pedro@example.com", role: "admin" },
]

interface ScanDocumentUtilityProps {
  onOperationComplete: () => void
}

export function ScanDocumentUtility({ onOperationComplete }: ScanDocumentUtilityProps) {
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [documentName, setDocumentName] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [documentQuality, setDocumentQuality] = useState("high")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Solicitar permisos de cámara
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setCameraPermission("granted")
      setIsCameraActive(true)

      toast({
        title: "Cámara activada",
        description: "Apunte al documento que desea escanear",
      })
    } catch (error) {
      console.error("Error al acceder a la cámara:", error)
      setCameraPermission("denied")

      toast({
        title: "Error de cámara",
        description: "No se pudo acceder a la cámara. Por favor, conceda los permisos necesarios.",
        variant: "destructive",
      })
    }
  }

  // Detener la cámara
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  // Capturar imagen
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Establecer dimensiones del canvas al tamaño del video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Dibujar el frame actual del video en el canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convertir a imagen
        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)

        // Detener la cámara después de capturar
        stopCamera()

        // Generar un nombre por defecto para el documento
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19)
        setDocumentName(`documento_escaneado_${timestamp}`)

        toast({
          title: "Imagen capturada",
          description: "La imagen ha sido capturada correctamente",
        })
      }
    }
  }

  // Reiniciar el proceso
  const resetScan = () => {
    setCapturedImage(null)
    setDocumentName("")
    setSelectedRecipients([])
    setProgress(0)
    setIsProcessing(false)
  }

  // Procesar y compartir el documento
  const processAndShare = async () => {
    if (!capturedImage || !documentName || selectedRecipients.length === 0) {
      toast({
        title: "Información incompleta",
        description:
          "Por favor, capture una imagen, asigne un nombre al documento y seleccione al menos un destinatario",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    // Simulamos el procesamiento
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 5) + 1
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 100)

    // Simulamos el tiempo de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Registrar la operación en el historial
    const currentDate = new Date().toISOString()
    const currentUser = "Usuario Actual" // En una app real, esto vendría del contexto de autenticación

    // Aquí se guardaría en la base de datos
    console.log("Operación registrada:", {
      id: Math.random().toString(36).substring(2, 9),
      operationType: "scan",
      outputFile: `${documentName}.pdf`,
      quality: documentQuality,
      recipients: selectedRecipients
        .map((id) => {
          const user = availableUsers.find((u) => u.id === id)
          return user ? user.name : id
        })
        .join(", "),
      createdBy: currentUser,
      createdAt: currentDate,
    })

    toast({
      title: "Documento procesado",
      description: "El documento ha sido convertido a PDF y compartido con los destinatarios seleccionados",
    })

    // Notificar al componente padre
    onOperationComplete()
    setIsProcessing(false)
  }

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escanear documento</CardTitle>
        <CardDescription>
          Utilice la cámara para escanear un documento y convertirlo a PDF. Podrá compartirlo con otros usuarios de la
          plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Área de visualización de cámara/imagen */}
          <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
            {!isCameraActive && !capturedImage && (
              <div className="text-center p-8">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {cameraPermission === "denied"
                    ? "Acceso a la cámara denegado. Por favor, revise los permisos de su navegador."
                    : "Haga clic en 'Activar cámara' para comenzar a escanear"}
                </p>
              </div>
            )}

            {isCameraActive && <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />}

            {capturedImage && (
              <div className="relative w-full h-full">
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Documento escaneado"
                  className="w-full h-full object-contain"
                />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={resetScan}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Canvas oculto para capturar la imagen */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controles de cámara */}
          {!capturedImage && (
            <div className="flex justify-center space-x-4">
              {!isCameraActive ? (
                <Button onClick={requestCameraPermission} className="bg-ecosoft-600 hover:bg-ecosoft-700">
                  <Camera className="mr-2 h-4 w-4" />
                  Activar cámara
                </Button>
              ) : (
                <>
                  <Button onClick={captureImage} className="bg-ecosoft-600 hover:bg-ecosoft-700">
                    <Camera className="mr-2 h-4 w-4" />
                    Capturar
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Formulario para procesar y compartir */}
          {capturedImage && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentName">Nombre del documento</Label>
                <Input
                  id="documentName"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  disabled={isProcessing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentQuality">Calidad del PDF</Label>
                <Select value={documentQuality} onValueChange={setDocumentQuality} disabled={isProcessing}>
                  <SelectTrigger id="documentQuality">
                    <SelectValue placeholder="Seleccione la calidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja (archivo más pequeño)</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta (mejor calidad)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipients">Compartir con</Label>
                <MultiSelect value={selectedRecipients} onValueChange={setSelectedRecipients} disabled={isProcessing}>
                  <MultiSelectTrigger id="recipients" className="w-full">
                    <MultiSelectValue placeholder="Seleccione destinatarios" />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    {availableUsers.map((user) => (
                      <MultiSelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </MultiSelectItem>
                    ))}
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <Label>Procesando documento</Label>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">{progress}%</p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  className="flex-1 bg-ecosoft-600 hover:bg-ecosoft-700"
                  onClick={processAndShare}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Share2 className="mr-2 h-4 w-4" />
                      Procesar y compartir
                    </>
                  )}
                </Button>

                <Button variant="outline" onClick={resetScan} disabled={isProcessing}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reiniciar
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

