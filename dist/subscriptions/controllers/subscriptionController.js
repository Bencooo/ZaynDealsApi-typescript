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
exports.getAllSubscriptions = exports.deleteSubscription = exports.createSubscription = void 0;
const firebase_1 = require("../../utils/firebase");
const createSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subId, title, price, description, duration } = req.body;
    try {
        const newSubscriptionRef = firebase_1.db.collection('subscriptions').doc(subId); // Utilise subId comme ID de document
        yield newSubscriptionRef.set({
            title,
            price,
            description,
            duration
        });
        res.status(201).send({ message: "Subscription created successfully", id: newSubscriptionRef.id });
    }
    catch (error) {
        res.status(500).send({ message: "Error creating subscription", error: error.message });
    }
});
exports.createSubscription = createSubscription;
const deleteSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subId = req.params.subId;
    try {
        const subscriptionRef = firebase_1.db.collection('subscriptions').doc(subId);
        yield subscriptionRef.delete();
        res.status(200).send({ message: "Subscription deleted successfully" });
    }
    catch (error) {
        res.status(500).send({ message: "Error deleting subscription", error: error.message });
    }
});
exports.deleteSubscription = deleteSubscription;
const getAllSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriptionsRef = firebase_1.db.collection('subscriptions');
        const snapshot = yield subscriptionsRef.get();
        if (snapshot.empty) {
            res.status(404).send({ message: 'No subscriptions found' });
            return;
        }
        let subscriptions = [];
        snapshot.forEach(doc => {
            const usedCoupon = Object.assign({ id: doc.id }, doc.data() // Assurez-vous que les données correspondent à l'interface UsedCoupon
            );
            subscriptions.push(usedCoupon);
        });
        res.status(200).send(subscriptions);
    }
    catch (error) {
        res.status(500).send({ message: 'Error getting subscriptions', error: error.message });
    }
});
exports.getAllSubscriptions = getAllSubscriptions;
//# sourceMappingURL=subscriptionController.js.map