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
exports.checkUserSubscription = void 0;
const firebase_1 = require("../utils/firebase");
const checkUserSubscription = function checkUserSubscriptionValidity(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const subscriptionSnapshot = yield firebase_1.db.collection('userSubscriptions').where('userId', '==', userId).get();
        // Assurez-vous que l'instantané n'est pas vide
        if (subscriptionSnapshot.empty) {
            console.log('Aucun document correspondant trouvé.');
            return false;
        }
        const today = new Date();
        let isValid = false;
        // Parcourir chaque document d'abonnement pour l'utilisateur
        for (const doc of subscriptionSnapshot.docs) {
            const subscription = doc.data();
            const endDate = subscription.endDate.toDate();
            if (endDate >= today) {
                return true; // Au moins un abonnement valide trouvé
            }
        }
        return isValid;
    });
};
exports.checkUserSubscription = checkUserSubscription;
//# sourceMappingURL=subscriptionMiddlecare.js.map