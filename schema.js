const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        location: Joi.string().required(),
        // image: Joi.object({
        //     url: Joi.string().uri().required(),
        //     filename: Joi.string().optional(),
        // }).required(),
        "image.url": Joi.string()
            .uri(),
            // .empty("") // Treat empty string as undefined
            // .default("https://example.com/default-image.jpg"),
        category: Joi.string().valid("Trending","Farms","Rooms","Iconic_cities","Pools","Camping","Ships","Arctic","Beach","Castles","Caves").required()
    }).required(),
});

const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required(),
})

module.exports = { listingSchema, reviewSchema };
