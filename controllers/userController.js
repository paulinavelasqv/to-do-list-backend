const validator = require("validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
// Importar servicios
const createToken = require("../services/jwt");

// Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/users.js"
    });
};

const register = async (req, res) => {

    // Recoger parametros por post a guardar
    let params = req.body;

    console.log(params.name);

    if(!params.name || !params.email || !params.password){
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    if(validator.isAlpha(params.name) && validator.isEmail(params.email)){


        // Validamos que no se dupliquen usuarios antes de registrar
        try {
            const userDuplicado = await User.find({email: params.email.toLowerCase()});

            if(userDuplicado.length >= 1){
                return res.status(200).send({
                    status: "success",
                    mensaje: "Usuario ya se encuentra registrado."
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error en la consulta.",
                error: error.message
            });
        }

        // Cifrar contraseňa
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        // Crear objeto de usuario
        let user_to_save = new User(params);

        // Guardar usuario en BD
        let userStored;

        try {
            userStored = await user_to_save.save();

            if(!userStored) return res.status(500).send({status: "error", message: "Error al guardar el usuario"});

        } catch (error) {
            return res.status(500).send({status: "error", message: "Error al guardar el usuario"});
        }

        return res.status(200).json({
            status: "success",
            message: "Usuario registrado correctamente",
            user: userStored
        });

    } else{
        return res.status(500).json({
            status: "error",
            message: "Nombre o email no cumplen con formato"
        });
    }
}

const login = async (req, res) => {

    // Obtener parametros
    let parametros = req.body;

    if(!parametros.email || !parametros.password){
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Buscar en la BD si existe el usuraio
    let user;
    try {
        // Para que no se devuelvan datos sensibles utilizamos select
        user = await User.findOne({email: parametros.email});//.select({"password": 0});

        if(!user) return res.status(404).send({status: "error", message: "No existe el usuario"});

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al encontrar usuario"
        });
    }

    // Comprobar su contrasenia
    const pwd = bcrypt.compareSync(parametros.password, user.password);

    if(!pwd){
        return res.status(400).send({
            status: "error",
            message: "No te has identificado correctamente"
        });
    }

    // Conseguir Token
    const token = createToken.createToken(user);

    return res.status(200).json({
        status: "success",
        message: "Te has identificado correctamente.",
        user: {
            id: user.id,
            name: user.name
        },
        token
    });
}

module.exports = {
    pruebaUser,
    register,
    login
}