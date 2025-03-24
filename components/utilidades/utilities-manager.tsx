"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompressUtility } from "@/components/utilidades/compress-utility"
import { ConvertUtility } from "@/components/utilidades/convert-utility"
import { UtilitiesHistory } from "@/components/utilidades/utilities-history"
import { ScanDocumentUtility } from "@/components/utilidades/scan-document-utility"
import { FileArchiveIcon as FileZip, FileText, History, Camera } from "lucide-react"

export function UtilitiesManager() {
  const [activeTab, setActiveTab] = useState("compress")

  // Esta función se llamará cuando se complete una operación
  // para actualizar automáticamente el historial
  const handleOperationComplete = () => {
    // Cambiar a la pestaña de historial después de completar una operación
    setActiveTab("history")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="compress" className="flex items-center">
          <FileZip className="mr-2 h-4 w-4" />
          Compresión
        </TabsTrigger>
        <TabsTrigger value="convert" className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          Conversión
        </TabsTrigger>
        <TabsTrigger value="scan" className="flex items-center">
          <Camera className="mr-2 h-4 w-4" />
          Escanear documento
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center">
          <History className="mr-2 h-4 w-4" />
          Historial
        </TabsTrigger>
      </TabsList>

      <TabsContent value="compress">
        <CompressUtility onOperationComplete={handleOperationComplete} />
      </TabsContent>

      <TabsContent value="convert">
        <ConvertUtility onOperationComplete={handleOperationComplete} />
      </TabsContent>

      <TabsContent value="scan">
        <ScanDocumentUtility onOperationComplete={handleOperationComplete} />
      </TabsContent>

      <TabsContent value="history">
        <UtilitiesHistory />
      </TabsContent>
    </Tabs>
  )
}

