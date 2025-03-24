import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - EcoSoft",
  description: "Inicia sesión en el sistema EcoSoft",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

