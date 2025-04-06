# EcoSoft
Evidencia de desempeño: GA7-220501096-AA2-EV01 codificación de módulos del software según  requerimientos del proyecto

Evidencia de producto: GA7-220501096-AA4-EV03 Componente frontend del proyecto formativo y 
proyectos de clase (listas de chequeo)

# EcoSoft - Sistema de Gestión de Archivos

![EcoSoft Logo](public/images/logo.png)

## Descripción del Proyecto

EcoSoft es un sistema integral de gestión de archivos diseñado para facilitar el almacenamiento, organización, compartición y procesamiento de documentos en entornos empresariales. La plataforma permite a los usuarios importar, gestionar, compartir y manipular archivos de manera segura, además de proporcionar herramientas de colaboración como reuniones virtuales y gestión de contactos.

## Tecnologías y Lenguajes Utilizados

### Frontend
- **React.js**: Biblioteca JavaScript para construir interfaces de usuario
- **Next.js 14**: Framework de React que permite renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG)
- **TypeScript**: Superconjunto tipado de JavaScript que mejora la calidad del código
- **Tailwind CSS**: Framework de CSS utilitario para diseño rápido y responsivo
- **Shadcn/UI**: Biblioteca de componentes de UI basada en Radix UI

### Backend
- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor
- **Next.js API Routes**: Endpoints de API integrados en Next.js
- **MySQL**: Sistema de gestión de bases de datos relacional

### Autenticación y Seguridad
- **bcryptjs**: Biblioteca para el hash seguro de contraseñas
- **Cookies HTTP**: Para gestión de sesiones de usuario
- **Middleware de autenticación**: Protección de rutas y verificación de permisos

## Metodología de Desarrollo

EcoSoft ha sido desarrollado siguiendo la metodología en cascada (Waterfall), un enfoque lineal y secuencial que consta de las siguientes fases:

1. **Requisitos**: Definición detallada de las funcionalidades y características del sistema
2. **Diseño**: Creación de la arquitectura del sistema, diseño de la base de datos y maquetación de interfaces
3. **Implementación**: Codificación de las funcionalidades según las especificaciones
4. **Verificación**: Pruebas exhaustivas para garantizar el correcto funcionamiento
5. **Mantenimiento**: Corrección de errores y mejoras continuas

Esta metodología fue seleccionada debido a:
- Requisitos bien definidos desde el inicio del proyecto
- Necesidad de documentación clara y completa
- Estructura organizativa jerárquica del equipo de desarrollo
- Facilidad para el seguimiento del progreso mediante entregables concretos

## Estructura del Proyecto

-ecosoft/
├── app/                    # Rutas y páginas de la aplicación (Next.js App Router)
│   ├── api/                # Endpoints de API
│   ├── dashboard/          # Páginas del panel de control
│   ├── login/              # Página de inicio de sesión
│   └── register/           # Página de registro
├── components/             # Componentes reutilizables
│   ├── auth/               # Componentes de autenticación
│   ├── contactos/          # Componentes de gestión de contactos
│   ├── dashboard/          # Componentes del panel principal
│   ├── files/              # Componentes de gestión de archivos
│   ├── importar/           # Componentes de importación
│   ├── compartir/          # Componentes para compartir archivos
│   ├── reuniones/          # Componentes de reuniones virtuales
│   ├── ui/                 # Componentes de interfaz de usuario (shadcn/ui)
│   └── utilidades/         # Componentes de utilidades
├── context/                # Contextos de React (AuthContext, etc.)
├── hooks/                  # Hooks personalizados
├── lib/                    # Funciones de utilidad y lógica de negocio
│   ├── auth.ts             # Funciones de autenticación
│   ├── auth-db.ts          # Interacción con la base de datos para autenticación
│   └── db.ts               # Configuración y funciones de base de datos
├── public/                 # Archivos estáticos
│   └── images/             # Imágenes del sistema
└── styles/                 # Estilos globales



## Paleta de Colores

EcoSoft utiliza una paleta de colores basada en tonos verdes, que simbolizan:

- **Sostenibilidad**: Refleja el compromiso con prácticas empresariales sostenibles
- **Crecimiento**: Representa el desarrollo y la evolución continua
- **Tranquilidad**: Proporciona una experiencia de usuario relajante y agradable
- **Confianza**: Transmite seguridad y fiabilidad en el manejo de información

La paleta principal incluye:
- Verde primario (#4caf50): Color principal de la marca
- Tonos verdes complementarios: Para crear profundidad y jerarquía visual
- Grises neutros: Para texto y elementos secundarios
- Blanco y negro: Para contraste y legibilidad

En el modo oscuro, se utilizan tonos azules oscuros más relajantes para reducir la fatiga visual durante sesiones prolongadas.

## Propósito y Beneficios

### Objetivo Principal
EcoSoft tiene como objetivo principal optimizar la gestión documental en entornos empresariales, facilitando la colaboración entre equipos y mejorando la productividad mediante herramientas integradas.

### Beneficios Clave

1. **Centralización de Archivos**
   - Almacenamiento unificado de documentos
   - Organización jerárquica mediante carpetas
   - Búsqueda avanzada de contenidos

2. **Colaboración Mejorada**
   - Compartición segura de archivos
   - Reuniones virtuales integradas
   - Gestión de contactos y zonas de trabajo

3. **Herramientas de Productividad**
   - Compresión de archivos
   - Conversión entre formatos
   - Escaneo de documentos físicos

4. **Seguridad y Control**
   - Gestión de permisos basada en roles
   - Historial detallado de actividades
   - Protección de datos sensibles

5. **Accesibilidad**
   - Interfaz responsiva para dispositivos móviles
   - Modo oscuro para reducir la fatiga visual
   - Diseño intuitivo para usuarios de todos los niveles

## Usuarios y Roles

EcoSoft implementa un sistema de roles para gestionar los permisos:

1. **Administradores**
   - Gestión completa de usuarios
   - Creación de zonas de trabajo
   - Acceso a todas las funcionalidades

2. **Usuarios Regulares**
   - Gestión de archivos personales
   - Participación en reuniones
   - Uso de herramientas de utilidades

## Requisitos del Sistema

### Servidor
- Node.js 18.0 o superior
- MySQL 8.0 o superior
- 2GB RAM mínimo recomendado
- 10GB de espacio en disco para la aplicación

### Cliente
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- Resolución mínima recomendada: 1280x720

## Instalación y Configuración

1. Clonar el repositorio
   ```bash
   git clone https://github.com/tu-usuario/ecosoft.git
   cd ecosoft

#### Credenciales por Defecto

-El sistema incluye dos usuarios predeterminados para pruebas:

- Usuario Administrador:
- Email: admin@ecosoft.com
- Contraseña: Admin@123456!

- Usuario Regular:
- Email: usuario@ecosoft.com
- Contraseña: Usuario@123456!
