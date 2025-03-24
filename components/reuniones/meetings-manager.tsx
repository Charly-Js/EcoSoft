"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateMeeting } from "@/components/reuniones/create-meeting"
import { JoinMeeting } from "@/components/reuniones/join-meeting"
import { MeetingsHistory } from "@/components/reuniones/meetings-history"
import { Video, UserPlus, History } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export function MeetingsManager() {
  const [activeTab, setActiveTab] = useState("join")
  const { user } = useAuth()

  // Verificar si el usuario es administrador
  const isAdmin = user?.role === "admin"

  // Esta función se llamará cuando se cree una reunión
  const handleMeetingCreated = () => {
    // Cambiar a la pestaña de historial después de crear una reunión
    setActiveTab("history")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="join" className="flex items-center">
          <UserPlus className="mr-2 h-4 w-4" />
          Unirse a reunión
        </TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="create" className="flex items-center">
            <Video className="mr-2 h-4 w-4" />
            Crear reunión
          </TabsTrigger>
        )}
        <TabsTrigger value="history" className="flex items-center">
          <History className="mr-2 h-4 w-4" />
          Historial
        </TabsTrigger>
      </TabsList>

      <TabsContent value="join">
        <JoinMeeting />
      </TabsContent>

      {isAdmin && (
        <TabsContent value="create">
          <CreateMeeting onMeetingCreated={handleMeetingCreated} />
        </TabsContent>
      )}

      <TabsContent value="history">
        <MeetingsHistory />
      </TabsContent>
    </Tabs>
  )
}

