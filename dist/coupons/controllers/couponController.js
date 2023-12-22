"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCoupon = exports.getAllCouponByMerchant = exports.createCoupon = void 0;
const firebase_1 = require("../../utils/firebase");
const createCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscriptionIds, merchantId, title, description, price, rules, dealType, validityDate, reusable } = req.body;
    try {
        // Vérifier si le merchant existe
        const merchantRef = firebase_1.db.collection('merchants').doc(merchantId);
        const merchantDoc = yield merchantRef.get();
        if (!merchantDoc.exists) {
            res.status(404).send({ message: "Merchant not found" });
            return;
        }
        // Créer le coupon
        const couponRef = firebase_1.db.collection('coupons').doc(); // Génère un ID automatique
        yield couponRef.set({
            subscriptionIds,
            merchantId,
            title,
            description,
            price,
            rules,
            dealType,
            validityDate: new Date(validityDate), // Assurez-vous que la date est correctement formatée
            reusable
        });
        res.status(201).send({ message: "Coupon created successfully", couponId: couponRef.id });
    }
    catch (error) {
        res.status(500).send({ message: "Error creating coupon", error: error.message });
    }
});
exports.createCoupon = createCoupon;
const getAllCouponByMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const merchantId = req.params.merchantId;
    try {
        const couponsQuery = firebase_1.db.collection('coupons').where('merchantId', '==', merchantId);
        const querySnapshot = yield couponsQuery.get();
        if (querySnapshot.empty) {
            res.status(404).send({ message: "No coupons found for this merchant" });
            return;
        }
        let coupons = []; // Utilisation de l'interface Coupon
        querySnapshot.forEach(doc => {
            const coupon = Object.assign({ id: doc.id }, doc.data());
            coupons.push(coupon);
        });
        res.status(200).send(coupons);
    }
    catch (error) {
        res.status(500).send({ message: "Error retrieving coupons", error: error.message });
    }
});
exports.getAllCouponByMerchant = getAllCouponByMerchant;
const updateCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const couponId = req.params.couponId;
    const updateData = req.body;
    try {
        const couponRef = firebase_1.db.collection('coupons').doc(couponId);
        yield couponRef.update(updateData);
        res.status(200).send({ message: "Coupon updated successfully" });
    }
    catch (error) {
        res.status(500).send({ message: "Error updating coupon", error: error.message });
    }
});
exports.updateCoupon = updateCoupon;
//# sourceMappingURL=couponController.js.map