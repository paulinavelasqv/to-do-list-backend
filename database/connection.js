require('dotenv').config();
const mongoose = require("mongoose");

const dbUrl = process.env.DB_URL;

const connection = async (req, res) => {

    try {
        await mongoose.connect(dbUrl);
        console.log("Conectado correctamente a la base de datos to_do_list");
    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}

module.exports = connection;