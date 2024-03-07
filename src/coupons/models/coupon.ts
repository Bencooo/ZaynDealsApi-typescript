export interface Coupon {
    id: string;
    subscriptionIds: string[];
    merchantId: string;
    title: string;
    description: string;
    price: string;
    rules: string;
    dealType: string; // TODO use as an enum
    validityDate: Date; // TODO remove
    reusable: boolean;
    // TODO start and end validityDate (beta)
}

import Joi from 'joi';

export const couponSchema = Joi.object({
    subscriptionIds: Joi.array().items(Joi.string()).required(),
    merchantId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.string().required(),
    rules: Joi.string().required(),
    dealType: Joi.string().required(), // Vous pouvez aussi valider contre des valeurs spécifiques si c'est un enum
    validityDate: Joi.string().isoDate().required(),
    reusable: Joi.boolean().required(),
});

