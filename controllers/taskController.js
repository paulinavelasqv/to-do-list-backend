/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API para gestionar tareas
 */

const Task = require("../models/task");

const pruebaTask = (req, res) => {
    return res.status(200).json({
        status: "success"
    });
}
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crear nueva tarea
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       200:
 *         description: Tarea creada correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 */
const createTask = async (req, res) => {

    // Recoger datos del body
    const params = req.body;

    if(!params.title) return res.status(400).json({
        status: "error",
        message: "Debes enviar un titulo de tarea."
    });

    // Crear y rellenar el objeto del modelo
    let newTask = new Task(params);
    newTask.user = req.user.id;

    try {
        // Guardar objeto en BD
        const taskStored = await newTask.save();

        if(!taskStored) return res.status(400).json({
            status: "error",
            message: "No se ha guardado la tarea."
        });

        return res.status(200).json({
            status: "success",
            message: "Tarea guardada",
            taskStored
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al guardar tarea."
        });
    }
}

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Obtener lista de tareas con filtros y paginación
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por estado de tarea
 *       - in: query
 *         name: dueDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar tareas con fecha límite anterior o igual a esta fecha
 *       - in: path
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para paginación
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida exitosamente
 *       500:
 *         description: Error en la consulta de tareas
 */
const list = async (req, res) => {

    // Obtener ID de usuario
    userId = req.user.id;

    // Controlar pagina
    let page = parseInt(req.params.page) || 1;
    let itemsPerPage = 5;

    const {status, dueDate} = req.query;
    const filters = {user: userId};

    if(status){
        filters.status = status;
    }

    if(dueDate){
        filters.dueDate = { $lte: new Date(dueDate) };
    }

    const options = {
            page,
            limit: itemsPerPage,
            sort: {created_at: -1}
    };

    try {
        // Buscar tareas
        const result = await Task.paginate(filters, options);

        return res.status(200).json({
            status: "success",
            tasks: result.docs,
            totalTasks: result.totalDocs,
            totalPages: result.totalPages,
            currentPage: result.page
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener tareas",
            error: error.message
        });
    }
}

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtener una tarea por su ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *       404:
 *         description: Tarea no encontrada
 */
const listOneTask = async (req, res) => {

    // Obtener Id por parametros
    taskId = req.params.id;

    try {
        // Buscar tarea para listar
        const result = await Task.findById(taskId);

        if(!result) return res.status(404).json({
            status: "error",
            message: "No se han encontrado tareas."
        });

        return res.status(200).json({
            status: "success",
            result
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "No se han encontrado tareas."
        });
    }
}

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Actualizar tarea por ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       200:
 *         description: Tarea actualizada correctamente
 *       400:
 *         description: Datos inválidos o error de actualización
 */
const update = async (req, res) =>{

    // Obtener Id y parametros
    const taskId = req.params.id;
    const parametros = req.body;

    if(!parametros){
        return res.status(400).json({
            status: "error",
            message: "No se han enviado datos para actualizar."
        });
    }

    try {
        // Actualizar datos en BD
        const taskToUpdate = await Task.findByIdAndUpdate(taskId, parametros, {new:true});

        if(!taskToUpdate){
            return res.status(400).json({
                status: "error",
                message: "Error al actualizar tarea."
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Tarea actualizada.",
            taskToUpdate
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al actualizar tarea"
        });
    }
}
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Eliminar una tarea por su ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea a eliminar
 *     responses:
 *       200:
 *         description: Tarea eliminada correctamente
 *       404:
 *         description: Tarea no encontrada
 */
const deleteTask = async (req, res) => {

    // Obtener Id
    const taskId = req.params.id;

    try {
        // Buscar coincidencias y eliminar tarea
        const remove = await Task.findOneAndDelete({"_id": taskId});

        if(!remove){
            return res.status(404).json({
                status: "error",
                message: "No se encontro tarea para eliminar."
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Has eliminado correctamente la tarea",
            remove
        });

    } catch (error) {
        return res.status(500).json({
                status: "error",
                message: "No se pudo eliminar tarea."
            });
    }
}

module.exports = {
    createTask,
    pruebaTask,
    list,
    listOneTask,
    update,
    deleteTask
}