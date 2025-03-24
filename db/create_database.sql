-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ecosoft_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE ecosoft_db;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  zone VARCHAR(255) DEFAULT NULL,
  last_login DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de zonas de trabajo
CREATE TABLE IF NOT EXISTS work_zones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Crear tabla de archivos
CREATE TABLE IF NOT EXISTS files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  path VARCHAR(255) NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_by INT,
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME DEFAULT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Crear tabla de compartidos
CREATE TABLE IF NOT EXISTS shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_id INT NOT NULL,
  shared_by INT NOT NULL,
  shared_to INT NOT NULL,
  message TEXT,
  expires_at DATETIME,
  status ENUM('active', 'expired', 'deleted') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_to) REFERENCES users(id) ON DELETE CASCADE
);

-- Crear tabla de operaciones de utilidades
CREATE TABLE IF NOT EXISTS utility_operations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  operation_type ENUM('compression', 'conversion', 'scan') NOT NULL,
  input_files TEXT,
  output_file VARCHAR(255) NOT NULL,
  format VARCHAR(50),
  compression_level VARCHAR(50),
  has_password BOOLEAN DEFAULT FALSE,
  quality VARCHAR(50),
  recipients TEXT,
  created_by INT,
  status ENUM('active', 'deleted') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Crear tabla de reuniones
CREATE TABLE IF NOT EXISTS meetings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  meeting_id VARCHAR(50) NOT NULL UNIQUE,
  scheduled_for DATETIME NOT NULL,
  duration INT NOT NULL COMMENT 'Duration in minutes',
  created_by INT,
  status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Crear tabla de participantes de reuniones
CREATE TABLE IF NOT EXISTS meeting_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  meeting_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at DATETIME DEFAULT NULL,
  left_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertar usuario administrador por defecto
INSERT INTO users (name, email, password, role, status)
VALUES ('Admin', 'admin@ecosoft.com', '$2a$10$JwXdZpV.Qm.Nt7EQPcQwQOXKkM2pHAGfIJHJOgwBb7PgeMvPPEFca', 'admin', 'active');
-- La contraseña es 'Admin@123456!' (hasheada con bcrypt)

-- Insertar usuario regular por defecto
INSERT INTO users (name, email, password, role, status)
VALUES ('Usuario', 'usuario@ecosoft.com', '$2a$10$8XMhtA6v1Yd.rJU9mCn7/.2QeJwwZ7ZCvf5iiEcqpOaQInXMJNBn2', 'user', 'active');
-- La contraseña es 'Usuario@123456!' (hasheada con bcrypt)

-- Insertar zonas de trabajo por defecto
INSERT INTO work_zones (name, description, created_by) VALUES 
('Ventas', 'Equipo de ventas y atención al cliente', 1),
('Marketing', 'Equipo de marketing y publicidad', 1),
('Desarrollo', 'Equipo de desarrollo de software', 1),
('Soporte', 'Equipo de soporte técnico', 1);

-- Asignar zonas a los usuarios
UPDATE users SET zone = 'Desarrollo' WHERE id = 1;
UPDATE users SET zone = 'Ventas' WHERE id = 2;