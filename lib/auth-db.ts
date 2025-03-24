import { query } from "./db"
import bcrypt from "bcryptjs"

// Función para obtener un usuario por email
export async function getUserByEmail(email: string) {
  const users = await query("SELECT * FROM users WHERE email = ? LIMIT 1", [email])

  return users.length > 0 ? users[0] : null
}

// Función para verificar las credenciales de un usuario
export async function verifyUserCredentials(email: string, password: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    return null
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return null
  }

  // No devolver la contraseña en el objeto de usuario
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Función para registrar un nuevo usuario
export async function registerUser(name: string, email: string, password: string, role = "user") {
  // Verificar si el email ya está en uso
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new Error("El email ya está en uso")
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10)

  // Insertar el nuevo usuario
  const result = await query("INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)", [
    name,
    email,
    hashedPassword,
    role,
    "active",
  ])

  return {
    id: result.insertId,
    name,
    email,
    role,
    status: "active",
  }
}

// Función para actualizar un usuario
export async function updateUser(id: number, userData: any) {
  const { name, email, role, status } = userData

  await query("UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?", [
    name,
    email,
    role,
    status,
    id,
  ])

  return {
    id,
    name,
    email,
    role,
    status,
  }
}

// Función para eliminar un usuario
export async function deleteUser(id: number) {
  await query("DELETE FROM users WHERE id = ?", [id])
  return true
}

// Función para obtener todos los usuarios
export async function getAllUsers() {
  return await query("SELECT id, name, email, role, status, created_at FROM users")
}

