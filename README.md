# React + TypeScript + Vite
# 🏡 Frontend

Este es el **frontend** de la prueba técnica **Desarrollador Sr. Frontend**, construido en **React + TypeScript**.  
Permite listar, filtrar y administrar propiedades y propietarios conectados a una **API .NET + MongoDB**.

---

## 🚀 Tecnologías utilizadas

- ⚛️ **React 19 + TypeScript + Vite**
- 🎨 **TailwindCSS + DaisyUI + React Icons**
- 🧪 **Jest + React Testing Library**
- 🗂️ **Arquitectura limpia** (repositorios, casos de uso, UI desacoplada)
- 🐳 **Docker** para levantar MongoDB (en local)
- 🔗 **React Router** para navegación

---

## 📦 Instalación y ejecución

```bash
git clone https://github.com/LuisDelRisco05/inmobiliaria-front
cd million-frontend
## Instalar dependencias
npm i
## Variables de entorno
.env VITE_API_URL=http://localhost:5000/api
## Arrcancar proyecto
npm run dev
## Test
npm run test
## Base de datos con Docker
docker run -d --name million-mongo -p 27017:27017 mongo:6
## Conexión a Mongo Compass 
mongodb://localhost:27017
## Base de datos usada 
milliondb
## Funcionalidades del frontend
**HomePage**

Listado de propiedades.

Filtros por nombre, dirección y rango de precio.

Modal para crear propiedades.

Link directo a propietarios.

**OwnerPage**

Listado de propietarios.

Filtros por nombre, dirección.

Modal para crear propietarios.

Link directo a propiedades.

Diseño responsivo adaptado a desktop y mobile.

📂 Estructura del código

src/
 ├── application/   # Casos de uso
 ├── domain/        # Entidades y puertos (interfaces)
 ├── infra/         # Adaptadores API
 ├── ui/            # Componentes y páginas React
 │   ├── components/
 │   ├── hooks/
 │   ├── pages/
 │   └── context/

 ✨ Notas finales
 * El frontend se conecta al backend desarrollado en .NET 9 + MongoDB.
 * MongoDB se levanta con Docker (million-mongo).
 * Se implementó arquitectura limpia y se añadieron pruebas unitarias de UI.
 * Código escrito en TypeScript siguiendo buenas prácticas (mantenible y escalable).