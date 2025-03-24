import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Eliminar cookie
    const cookieStore = cookies()
    cookieStore.delete("user")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en logout:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

