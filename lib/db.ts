import mysql from "mysql2/promise"

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ecosoft_db",
    port: 3306, // Cambia al puerto correcto
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
  

// Crear un pool de conexiones para reutilizarlas
const pool = mysql.createPool(dbConfig)

// Función para ejecutar consultas SQL
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Error al ejecutar la consulta SQL:", error)
    throw error
  }
}

// Función para verificar la conexión a la base de datos
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("Conexión a la base de datos establecida correctamente")
    connection.release()
    return true
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error)
    return false
  }
}

// Función para inicializar la base de datos (verificar tablas, etc.)
export async function initDatabase() {
  try {
    await testConnection()
    console.log("Base de datos inicializada correctamente")
    return true
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    return false
  }
}

