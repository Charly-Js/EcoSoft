"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar la página
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        console.log("Usuario cargado desde localStorage:", parsedUser)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Credenciales incorrectas")
      }

      const userData = await response.json()

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      // Establecer el usuario
      setUser(userData)

      return userData
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Llamar al endpoint de logout
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Limpiar el estado de usuario
      setUser(null)

      // Eliminar de localStorage
      localStorage.removeItem("user")

      // Redirigir al login
      router.push("/login")
    } catch (error) {
      console.error("Error en logout:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al registrar usuario")
      }

      return await response.json()
    } catch (error) {
      console.error("Error en registro:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, register }}>{!loading && children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

