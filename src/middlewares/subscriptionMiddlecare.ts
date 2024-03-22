import { db } from "../utils/firebase";


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

export const checkUserSubscriptionValidity = async function(userId: string) {
    const userSubscriptionSnapshot = await db.collection('userSubscriptions').where('userId', '==', userId).get();

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
        const subscriptionDoc = await db.collection('subscriptions').doc(subscriptionId).get();

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
}

export const getValidSubscriptionId = async function(userId: string) {
    const userSubscriptionSnapshot = await db.collection('userSubscriptions').where('userId', '==', userId).get();
    if (userSubscriptionSnapshot.empty) {
        return null;
    }

    const today = new Date();

    for (const userDoc of userSubscriptionSnapshot.docs) {
        const userSubscription = userDoc.data();
        const subscriptionId = userSubscription.subscriptionId;

        const subscriptionDoc = await db.collection('subscriptions').doc(subscriptionId).get();

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
};



