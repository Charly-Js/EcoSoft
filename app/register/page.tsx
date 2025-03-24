import { RegisterForm } from "@/components/auth/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registro - EcoSoft",
  description: "Regístrate en el sistema EcoSoft",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}

