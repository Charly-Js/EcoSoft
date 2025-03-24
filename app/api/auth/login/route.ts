import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Credenciales hardcodeadas para pruebas
    let user = null;
    
    if (email === "admin@ecosoft.com" && password === "Admin@123456!") {
      user = {
        id: "1",
        name: "Admin",
        email: "admin@ecosoft.com",
        role: "admin",
        status: "active"
      };
    } else if (email === "usuario@ecosoft.com" && password === "Usuario@123456!") {
      user = {
        id: "2",
        name: "Usuario",
        email: "usuario@ecosoft.com",
        role: "user",
        status: "active"
      };
    }
    
    if (!user) {
      return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 })
    }

    // Establecer cookie
    const cookieStore = await cookies()
    cookieStore.set("user", JSON.stringify(user), {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 día
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}