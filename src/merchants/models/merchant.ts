export interface Merchant {
    id: string;
    name: string;//
    description: string;
    category: string;//
    subCategory: string[];//
    tags: string[];//
    address: Address;//
    phoneNumber: string;
    email: string;
    thumbnail: string;
    imageUrls: string[];//
    menuUrls: string[]; // (beta)
    averageRate: string;
    //pinCode: string;
    openingHours: string[];
    createdAt: Date;
    instagram:string;
    // TODO Reviews (beta)
}

export interface Address {
    id: string;
    street: string;
    area: string;
    city: string;
    postalcode: string;
    longitude: string;
    latitude: string;
}

const Joi = require('joi');

export const merchantSchema = Joi.object({
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
