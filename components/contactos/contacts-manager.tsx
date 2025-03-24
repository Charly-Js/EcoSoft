"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContactsList } from "@/components/contactos/contacts-list"
import { ContactsZones } from "@/components/contactos/contacts-zones"
import { Users, Briefcase } from "lucide-react"

export function ContactsManager() {
  const [activeTab, setActiveTab] = useState("contacts")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="contacts" className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Contactos
        </TabsTrigger>
        <TabsTrigger value="zones" className="flex items-center">
          <Briefcase className="mr-2 h-4 w-4" />
          Zonas de trabajo
        </TabsTrigger>
      </TabsList>

      <TabsContent value="contacts">
        <ContactsList />
      </TabsContent>

      <TabsContent value="zones">
        <ContactsZones />
      </TabsContent>
    </Tabs>
  )
}

