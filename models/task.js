const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const TaskSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ["pending", "in progress", "completed"],
        default: "pending"
    },
    dueDate: Date,
    user: { 
        type: Schema.ObjectId, 
        ref: "User" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

TaskSchema.plugin(mongoosePaginate);

module.exports = model("Task", TaskSchema, "tasks");