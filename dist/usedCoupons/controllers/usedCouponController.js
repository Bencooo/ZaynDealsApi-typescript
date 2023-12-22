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
exports.getUsedCouponsByUserAndMerchant = exports.getUsedCouponsByUser = exports.createUsedCoupon = void 0;
const firebase_1 = require("../../utils/firebase");
const createUsedCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, couponId, usageDate } = req.body;
    try {
        // Vérifier si l'utilisateur existe
        const userRef = firebase_1.db.collection('users').doc(userId);
        const userDoc = yield userRef.get();
        if (!userDoc.exists) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        // Vérifier si le coupon existe
        const couponRef = firebase_1.db.collection('coupons').doc(couponId);
        const couponDoc = yield couponRef.get();
        if (!couponDoc.exists) {
            res.status(404).send({ message: "Coupon not found" });
            return;
        }
        // Créer le coupon utilisé
        const usedCouponRef = firebase_1.db.collection('usedCoupons').doc(); // Crée un ID unique
        yield usedCouponRef.set({
            userId,
            couponId,
            usageDate: new Date(usageDate), // Assurez-vous que la date est correctement formatée
        });
        res.status(201).send({ message: "Used coupon created successfully", id: usedCouponRef.id });
    }
    catch (error) {
        res.status(500).send({ message: "Error creating used coupon", error: error.message });
    }
});
exports.createUsedCoupon = createUsedCoupon;
const getUsedCouponsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const usedCouponsRef = firebase_1.db.collection('usedCoupons');
        const snapshot = yield usedCouponsRef.where('userId', '==', userId).get();
        if (snapshot.empty) {
            res.status(404).send({ message: 'No used coupons found for this user' });
            return;
        }
        let usedCoupons = [];
        snapshot.forEach(doc => {
            const usedCoupon = Object.assign({ id: doc.id }, doc.data() // Assurez-vous que les données correspondent à l'interface UsedCoupon
            );
            usedCoupons.push(usedCoupon);
        });
        res.status(200).send(usedCoupons);
    }
    catch (error) {
        res.status(500).send({ message: 'Error getting used coupons', error: error.message });
    }
});
exports.getUsedCouponsByUser = getUsedCouponsByUser;
const getUsedCouponsByUserAndMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Array.isArray(req.headers['user-id']) ? req.headers['user-id'][0] : req.headers['user-id'];
    const merchantId = Array.isArray(req.headers['merchant-id']) ? req.headers['merchant-id'][0] : req.headers['merchant-id'];
    try {
        // TODO - GetUserId from token
        // Check if user exists
        const userDoc = yield firebase_1.db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            res.status(404).send({ message: 'User not found' });
            return;
        }
        // Get user UsedCoupons
        const usedCouponsSnap = yield firebase_1.db.collection('usedCoupons').where('userId', '==', userId).get();
        if (usedCouponsSnap.empty) {
            res.status(404).send({ message: 'No used coupons found for this user' });
            return;
        }
        // Get user UsedCoupons for the specific Merchant
        let usedCoupons = [];
        for (const doc of usedCouponsSnap.docs) {
            const couponId = doc.data().couponId;
            // Get Merchant ID from Coupon
            const couponDoc = yield firebase_1.db.collection('coupons').doc(couponId).get();
            if (couponDoc.exists && couponDoc.data().merchantId === merchantId) {
                usedCoupons.push(doc.data());
            }
        }
        if (usedCoupons.length === 0) {
            res.status(404).send({ message: 'No used coupons found for this user at this merchant' });
            return;
        }
        res.status(200).send(usedCoupons);
    }
    catch (error) {
        res.status(500).send({ message: 'Error getting used coupons', error: error.message });
    }
});
exports.getUsedCouponsByUserAndMerchant = getUsedCouponsByUserAndMerchant;
//# sourceMappingURL=usedCouponController.js.map