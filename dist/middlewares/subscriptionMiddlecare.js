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
exports.getValidSubscriptionId = exports.checkUserSubscriptionValidity = void 0;
const firebase_1 = require("../utils/firebase");
/*export const checkUserSubscription = async function checkUserSubscriptionValidity(userId: string) {
    const subscriptionSnapshot = await db.collection('userSubscriptions').where('userId', '==', userId).get();

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
}*/
const checkUserSubscriptionValidity = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userSubscriptionSnapshot = yield firebase_1.db.collection('userSubscriptions').where('userId', '==', userId).get();
        if (userSubscriptionSnapshot.empty) {
            return false;
        }
        const today = new Date();
        let isValid = false;
        // Parcourir chaque abonnement utilisateur pour obtenir l'ID de l'abonnement
        for (const userDoc of userSubscriptionSnapshot.docs) {
            const userSubscription = userDoc.data();
            const subscriptionId = userSubscription.subscriptionId;
            // Utiliser l'ID d'abonnement pour obtenir les détails de l'abonnement depuis la collection 'subscriptions'
            const subscriptionDoc = yield firebase_1.db.collection('subscriptions').doc(subscriptionId).get();
            if (!subscriptionDoc.exists) {
                continue; // Passe au document suivant si celui-ci n'existe pas
            }
            const subscription = subscriptionDoc.data();
            const startDate = subscription.startDate.toDate();
            const endDate = subscription.endDate.toDate();
            // Vérifier si l'abonnement est actuellement valide
            if (startDate <= today && endDate >= today) {
                isValid = true;
                break; // Quitter la boucle si un abonnement valide est trouvé
            }
        }
        return isValid;
    });
};
exports.checkUserSubscriptionValidity = checkUserSubscriptionValidity;
const getValidSubscriptionId = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userSubscriptionSnapshot = yield firebase_1.db.collection('userSubscriptions').where('userId', '==', userId).get();
        if (userSubscriptionSnapshot.empty) {
            return null;
        }
        const today = new Date();
        for (const userDoc of userSubscriptionSnapshot.docs) {
            const userSubscription = userDoc.data();
            const subscriptionId = userSubscription.subscriptionId;
            const subscriptionDoc = yield firebase_1.db.collection('subscriptions').doc(subscriptionId).get();
            if (!subscriptionDoc.exists) {
                continue;
            }
            const subscription = subscriptionDoc.data();
            const startDate = subscription.startDate.toDate();
            const endDate = subscription.endDate.toDate();
            if (startDate <= today && endDate >= today) {
                return subscriptionId; // Retourne l'ID de l'abonnement valide
            }
        }
        return null; // Retourne null si aucun abonnement valide n'est trouvé
    });
};
exports.getValidSubscriptionId = getValidSubscriptionId;
//# sourceMappingURL=subscriptionMiddlecare.js.map