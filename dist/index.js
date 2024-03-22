"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const functions = __importStar(require("firebase-functions"));
const http_1 = __importDefault(require("http"));
const userRoutes_1 = __importDefault(require("./users/routes/userRoutes"));
const merchantRoutes_1 = __importDefault(require("./merchants/routes/merchantRoutes"));
const couponRoutes_1 = __importDefault(require("./coupons/routes/couponRoutes"));
const usedCouponRoutes_1 = __importDefault(require("./usedCoupons/routes/usedCouponRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./subscriptions/routes/subscriptionRoutes"));
const userSubscriptionRoutes_1 = __importDefault(require("./userSubscriptions/routes/userSubscriptionRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/users', userRoutes_1.default);
app.use('/merchants', merchantRoutes_1.default);
app.use('/coupons', couponRoutes_1.default);
app.use('/usedCoupons', usedCouponRoutes_1.default);
app.use('/subscriptions', subscriptionRoutes_1.default);
app.use('/userSubscriptions', userSubscriptionRoutes_1.default);
const server = http_1.default.createServer(app);
server.listen(4000, () => {
    console.log('Server running on http://localhost:4000/');
});
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map