// Importar dependecias 
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Mensaje de bienvenida
console.log("API NODE para To Do List");

// Conexion a BD
connection();

// Crear servidor node
const app = express();
const port = 8080;

// Configurar Cors
app.use(cors());

// Convertir datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Cargar las rutas
const UserRoutes = require("./routes/userRoute");
const TaskRoutes = require("./routes/taskRoute");

// Cargar las rutas
app.use("/api/auth", UserRoutes);
app.use("/api", TaskRoutes);

// Poner servidor a escuchar peticiones HTTP
app.listen(port, ()=>{
    console.log("Servidor corriendo en el puerto "+port);
});