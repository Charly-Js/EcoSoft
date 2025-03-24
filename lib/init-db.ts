import { initDatabase } from "./db"

// Inicializar la base de datos al arrancar la aplicación
export async function initApp() {
  try {
    await initDatabase()
    console.log("Aplicación inicializada correctamente")
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error)
  }
}

