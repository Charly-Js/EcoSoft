import type { Metadata } from "next"
import { ContactsManager } from "@/components/contactos/contacts-manager"

export const metadata: Metadata = {
  title: "Contactos - EcoSoft",
  description: "Gestión de contactos en EcoSoft",
}

export default function ContactosPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Contactos</h1>
      <p className="text-muted-foreground mb-6">
        Gestione los contactos de la plataforma. Los contactos están organizados por zonas de trabajo para facilitar la
        colaboración.
      </p>
      <ContactsManager />
    </div>
  )
}

