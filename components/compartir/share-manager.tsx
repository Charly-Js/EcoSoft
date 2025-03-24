"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShareFileForm } from "@/components/compartir/share-file-form"
import { ShareHistory } from "@/components/compartir/share-history"
import { FileIcon as FileShare, History } from "lucide-react"

export function ShareManager() {
  const [activeTab, setActiveTab] = useState("share")

  // Esta función se llamará cuando se comparta un archivo exitosamente
  // para actualizar automáticamente el historial
  const handleFileShared = () => {
    // Cambiar a la pestaña de historial después de compartir un archivo
    setActiveTab("history")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="share" className="flex items-center">
          <FileShare className="mr-2 h-4 w-4" />
          Compartir archivo
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center">
          <History className="mr-2 h-4 w-4" />
          Historial de compartidos
        </TabsTrigger>
      </TabsList>

      <TabsContent value="share">
        <ShareFileForm onFileShared={handleFileShared} />
      </TabsContent>

      <TabsContent value="history">
        <ShareHistory />
      </TabsContent>
    </Tabs>
  )
}

