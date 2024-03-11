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
exports.createUserSubscription = void 0;
const firebase_1 = require("../../utils/firebase");
const createUserSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, subscriptionId, startDate, endDate } = req.body;
    try {
        // Vérifier si l'utilisateur existe
        const userRef = firebase_1.db.collection('users').doc(userId);
        const userDoc = yield userRef.get();
        if (!userDoc.exists) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        // Vérifier si la souscription existe
        const subscriptionRef = firebase_1.db.collection('subscriptions').doc(subscriptionId);
        const subscriptionDoc = yield subscriptionRef.get();
        if (!subscriptionDoc.exists) {
            res.status(404).send({ message: "Subscription not found" });
            return;
        }
        // Créer la souscription utilisateur
        const newUserSubscriptionRef = firebase_1.db.collection('userSubscriptions').doc();
        yield newUserSubscriptionRef.set({
            userId,
            subscriptionId,
            usageDate: new Date()
            //startDate: new Date(startDate),
            //endDate: new Date(endDate)
        });
        res.status(201).send({ message: "User subscription created successfully" });
    }
    catch (error) {
        res.status(500).send({ message: "Error creating user subscription", error: error.message });
    }
});
exports.createUserSubscription = createUserSubscription;
//# sourceMappingURL=userSubscriptionController.js.map