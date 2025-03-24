"use server"

import { cookies } from "next/headers"
import { getUserByEmail } from "./auth-db"

export async function getSession() {
  const cookieStore = cookies()
  const userCookie = cookieStore.get("user")

  if (!userCookie) {
    console.log("No se encontró cookie de usuario")
    return null
  }

  try {
    const userData = JSON.parse(userCookie.value)
    console.log("Datos de usuario encontrados en cookie:", userData)

    // Verificar que el usuario sigue existiendo en la base de datos
    const dbUser = await getUserByEmail(userData.email)
    if (!dbUser) {
      console.log("Usuario no encontrado en la base de datos")
      return null
    }

    // Asegurarse de que el objeto tiene la estructura correcta
    return {
      id: userData.id || "0",
      name: userData.name || "Usuario",
      email: userData.email || "usuario@example.com",
      role: userData.role || "user",
    }
  } catch (error) {
    console.error("Error parsing user cookie:", error)
    return null
  }
}

export async function checkAdminAccess() {
  const session = await getSession()

  if (!session) {
    return false
  }

  return session.role === "admin"
}

