const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./ExpressError.js");

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, msg));
    }

    next();
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, msg)); // ✅ fixed
    }

    next();
};

module.exports = {
    validateListing,
    validateReview
};