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

### 1. Clonar repositorio
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