const Subscriber = require("../models/subscriber");

module.exports.createSubscriber = async (req, res) => {
    const { email } = req.body;

    if (!email || !email.trim()) {
        req.flash("error", "Email is required!"); // ✅ add
        return res.redirect("/subscriber");       // ✅ return important
    }

    await Subscriber.create({ email: email.trim() });

    req.flash("success", "Subscribed successfully!"); // ✅ add
    res.redirect("/subscriber");
}

module.exports.readSubscribers = async (req, res) => {
    const subscribers = await Subscriber.find({});

    // 👇 IMPORTANT FIX (dual variable pass)
    res.render("subscriber/subscriber", { 
        subscribers, 
        subscriber: subscribers   // 👈 EJS compatibility fix
    });
}

module.exports.editSubscriber = async (req, res) => {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
        throw new ExpressError(404, "Subscriber not found");
    }

    res.render("subscriber/edit", { subscriber });
}

module.exports.updateSubscriber = async (req, res) => {
    const { email } = req.body;

    if (!email || !email.trim()) {
        throw new ExpressError(400, "Email is required");
    }

    await Subscriber.findByIdAndUpdate(req.params.id, {
        email: email.trim()
    });
    req.flash("success", "Subscriber updated successfully!"); // Flash success message
    res.redirect("/subscriber");
}

module.exports.deleteSubscriber = async (req, res) => {
    await Subscriber.findByIdAndDelete(req.params.id);
    req.flash("error", "Subscriber deleted successfully!"); // Flash error message
    res.redirect("/subscriber");
}