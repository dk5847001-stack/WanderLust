const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    name: {
        type: String,
        require: true,
        MaxLength: 23,
        default: "john Donne"
    },
    email: {
        type: String,
        require: true,
    },
    subject: {
        type: String,
        require: true,
        MinLength: 3,
    },
    message: {
        type: String,
        MinLength: 3,
        require: true,
    }
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;