import { redirect } from "next/navigation"

export default function Home() {
  // Redirigir a la página de login
  redirect("/login")
}

