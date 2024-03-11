"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merchantSchema = void 0;
const Joi = require('joi');
exports.merchantSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    subCategory: Joi.array().items(Joi.string()).required(),
    tags: Joi.array().items(Joi.string()).required(),
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        area: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().required(),
        longitude: Joi.string().required(),
        latitude: Joi.string().required(),
        // Plus de champs si nécessaire
    }).required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    thumbnail: Joi.string().required(),
    imageUrls: Joi.array().items(Joi.string()).required(),
    menuUrls: Joi.array().items(Joi.string()), // considérez `.required()` si nécessaire
    averageRate: Joi.string().required(),
    //pinCode: Joi.string().required(),
    openingHours: Joi.array().items(Joi.string()).required(),
    instagram: Joi.string().required(),
    // Pas besoin de createdAt ici car c'est généré automatiquement
});
//# sourceMappingURL=merchant.js.map