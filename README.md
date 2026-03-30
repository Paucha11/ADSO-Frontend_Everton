# Frontend Hotel Everton

Este proyecto corresponde al frontend del sistema de gestion y reservas del **Hotel Everton**.  
Fue desarrollado en **React** y se conecta con el backend local por medio de la API.

## Requisitos

- Node.js instalado
- Backend ejecutandose en `http://localhost:3000`
- Base de datos configurada en el backend

## Ejecucion del proyecto

Ubicarse en la carpeta del frontend y ejecutar:

```powershell
npm start
```

El sistema se abrira en:

```text
http://localhost:3001
```

## Scripts disponibles

### `npm start`

Inicia el frontend en modo desarrollo.

### `npm run build`

Genera la version de produccion en la carpeta `build`.

### `npm test`

Ejecuta las pruebas configuradas para el proyecto.

## Credenciales de acceso

Para ingresar al panel administrativo se dejaron las siguientes credenciales:

- Correo: `admin@everton.com`
- Contrasena: `admin123`

## Rutas principales

- `http://localhost:3001/`
- `http://localhost:3001/administrador`
- `http://localhost:3001/hotel`
- `http://localhost:3001/huesped`
- `http://localhost:3001/empleado`
- `http://localhost:3001/cargo`
- `http://localhost:3001/habitacion`
- `http://localhost:3001/reserva`

## Observaciones

- La pagina principal muestra la vista publica del hotel.
- Los modulos administrativos requieren iniciar sesion.
- Los formularios del frontend se encuentran conectados con el backend, por lo tanto la informacion registrada queda almacenada en la base de datos.
- Si se desea revisar el acceso y las rutas de prueba con mas detalle, se puede consultar el archivo `INSTRUCCIONES_DE_ACCESO.md` si fue agregado al proyecto.
