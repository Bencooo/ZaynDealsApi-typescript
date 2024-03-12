export interface Coupon {
    id: string;
    merchantId: string;
    title: string;
    description: string;
    price: string;
    rules: string;
    dealType: string; // TODO use as an enum
    reusable: boolean;
    // TODO start and end validityDate (beta)
}

import Joi from 'joi';

export const couponSchema = Joi.object({
    merchantId: Joi.string().required(),
    title: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.string().required(),
    rules: Joi.array().items(Joi.string()).required(),
    conditions: Joi.array().items(Joi.string()).required(),
    dealType: Joi.string().required(), // Vous pouvez aussi valider contre des valeurs spécifiques si c'est un enum
    reusable: Joi.boolean().required(),
});

