const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const check = require("../middlewares/auth");

// Definir rutas
router.get("/prueba-task", check.auth, taskController.pruebaTask);
router.post("/tasks", check.auth, taskController.createTask);
router.get("/tasks", check.auth, taskController.list);
router.get("/tasks/:page", check.auth, taskController.list);
router.get("/task/:id", check.auth, taskController.listOneTask);
router.put("/tasks/:id", check.auth, taskController.update);
router.delete("/tasks/:id", check.auth, taskController.deleteTask);

//Exportar router
module.exports = router;