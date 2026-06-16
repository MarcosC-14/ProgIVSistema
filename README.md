# Sistema de Gestión de Inscripciones FCAD - UNER

Sistema cliente-servidor desarrollado para la administración de estudiantes, cursos e inscripciones.

## Arquitectura
* **Backend:** Node.js, Express, PostgreSQL.
* **Frontend:** Vanilla JavaScript, Vite, Bootstrap.
* **Gestor de paquetes:** pnpm.

## Configuración Inicial

Primero se debe utilizar la terminar para ir a las carpetas api y web para instalar las dependencias de pnpm utilizadas tanto en el frontend como en el backend.

Empezando desde la raíz en ambos casos:

```bash
  cd api
  pnpm install
```
```bash
  cd web
  pnpm install
```

---

## Ejecución del proyecto

Para ejecutar es necesario utilizar dos terminales en simultáneo donde una ejecuta el backend y la otra el frontend.

### Terminal 1 (Backend)
Desde la raíz:
```bash
  cd api
  pnpm run start
```
El servidor backend quedará escuchando el puerto 3000.


### Terminal 2 (Frontend)

#### **Método 1: Entorno de desarrollo**
Para que automáticamente note cambios y recargue si se modifica un archivo.

Desde la raíz:
```bash
  cd web
  pnpm dev
```
La interfaz gráfica estará disponible en: http://localhost:5173

#### **Método 2: Entorno de Producción (Previsualización)**
Ejecuta el proceso build de vite y sirve los archivos estáticos finales:

Desde la raíz:
```bash
  cd web
  pnpm build
  pnpm preview
```
La interfaz gráfica estará disponible en: http://localhost:4173
