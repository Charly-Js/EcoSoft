"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

const loginSchema = z.object({
  email: z.string().email({ message: "Ingrese un email válido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    try {
      console.log("Intentando login con:", data)
      await login(data.email, data.password)
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema EcoSoft",
      })

      // Pequeña pausa para asegurar que el estado se actualiza antes de redirigir
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    } catch (error) {
      console.error("Error en login:", error)
      toast({
        title: "Error al iniciar sesión",
        description: "Credenciales incorrectas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 items-center">
        <div className="w-40 h-40 relative mb-4">
          <Image src="/images/logo.png" alt="EcoSoft Logo" fill style={{ objectFit: "contain" }} priority />
        </div>
        <CardTitle className="text-2xl text-center text-ecosoft-600">EcoSoft</CardTitle>
        <CardDescription className="text-center">Ingrese sus credenciales para acceder al sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="correo@ejemplo.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link href="/forgot-password" className="text-sm text-ecosoft-600 underline-offset-4 hover:underline">
                ¿Olvidó su contraseña?
              </Link>
            </div>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-ecosoft-600 hover:bg-ecosoft-700" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          ¿No tiene una cuenta?{" "}
          <Link href="/register" className="text-ecosoft-600 underline-offset-4 hover:underline">
            Registrarse
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

