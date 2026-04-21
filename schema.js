const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.object({
            url: joi.string().uri().allow("").optional()
        })
    }).required(),
});

// for review validation
module.exports.reviewSchema = joi.object({
    review: joi.object({
        comment: joi.string()
            .trim()
            .min(10)
            .max(50)
            .required()
            .messages({
                "string.empty": "Comment is required",
                "string.min": "Comment must be at least 10 characters long",
                "string.max": "Comment cannot exceed 50 characters"
            }),

        rating: joi.number()
            .min(1)
            .max(5)
            .required()
            .messages({
                "number.base": "Rating must be a number",
                "number.min": "Rating must be at least 1",
                "number.max": "Rating cannot exceed 5",
                "any.required": "Rating is required"
            })
    }).required()
});