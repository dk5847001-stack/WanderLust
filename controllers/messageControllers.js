const Message = require("../models/message");

module.exports.index = (req, res) => {
    res.render("message/message");
}

module.exports.createMessage = async (req, res) => {
    await Message.create(req.body);
    req.flash("success", "Message sent successfully!"); // Flash success message
    res.redirect("/message");
}

module.exports.readMessages = async (req, res) => {
    const messages = await Message.find({});
    res.render("message/adminMessage", { messages });
}

module.exports.editMessage = async (req, res) => {
    const message = await Message.findById(req.params.id);
    res.render("message/edit", { message });
}

module.exports.updateMessage = async (req, res) => {
    await Message.findByIdAndUpdate(req.params.id, req.body);
    req.flash("success", "Message updated successfully!"); // Flash success message
    res.redirect("/message/read");
}

module.exports.deleteMessage = async (req, res) => {
    await Message.findByIdAndDelete(req.params.id);
req.flash("error", "Message deleted successfully!"); // Flash error message
    res.redirect("/message/read");
}