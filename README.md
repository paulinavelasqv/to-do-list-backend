# ✅ To Do List API

API RESTful para gestionar tareas personales con autenticación de usuarios.

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB con Mongoose
- JWT para autenticación
- Swagger para documentación

---

## ⚙️ Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Crear, leer, actualizar y eliminar tareas (CRUD)
- Protección de rutas mediante tokens JWT
- Validaciones de entrada y manejo de errores
- Documentación interactiva con Swagger

---

## 📋 Endpoints (resumen)

| Método | Ruta                | Descripción                      |
|--------|---------------------|----------------------------------|
| POST   | `/api/auth/register` | Registro de nuevo usuario        |
| POST   | `/api/auth/login`    | Inicio de sesión                 |
| GET    | `/api/tasks`         | Obtener tareas del usuario       |
| POST   | `/api/tasks`         | Crear una nueva tarea            |
| PUT    | `/api/tasks/:id`     | Actualizar una tarea             |
| DELETE | `/api/tasks/:id`     | Eliminar una tarea               |

---

## 🔧 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/paulinavelasqv/to-do-list-backend.git
```

2. Instala dependencias:

```bash
npm install
```

3. Configura variables de entorno (`.env`), por ejemplo:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/todolistdb
JWT_SECRET=tuSecreto
```

4. Ejecuta la aplicación:

```bash
npm start
```

5. Accede a la documentación Swagger en:

```
http://localhost:3000/api-docs
```

---

## 🤝 Contribuir

Si tienes sugerencias o mejoras, siéntete libre de abrir un issue o pull request.

---

## 📫 Contacto

Paulina Velásquez - [paulinavelasqv@example.com](mailto:paulinavelasqv@example.com)

GitHub: [https://github.com/paulinavelasqv](https://github.com/paulinavelasqv)

---

¡Gracias por revisar este proyecto! 😊