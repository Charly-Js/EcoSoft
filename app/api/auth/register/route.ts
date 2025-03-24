import { NextResponse } from "next/server"
import { registerUser } from "@/lib/auth-db"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Registrar usuario
    const user = await registerUser(name, email, password)

    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Error en registro:", error)

    if (error.message === "El email ya está en uso") {
      return NextResponse.json({ message: error.message }, { status: 409 })
    }

    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

