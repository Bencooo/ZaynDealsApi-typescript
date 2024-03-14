"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.couponSchema = joi_1.default.object({
    merchantId: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    image: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    price: joi_1.default.string().required(),
    rules: joi_1.default.array().items(joi_1.default.string()).required(),
    conditions: joi_1.default.array().items(joi_1.default.string()).required(),
    dealType: joi_1.default.string().required(), // Vous pouvez aussi valider contre des valeurs spécifiques si c'est un enum
    reusable: joi_1.default.boolean().required(),
});
//# sourceMappingURL=coupon.js.map