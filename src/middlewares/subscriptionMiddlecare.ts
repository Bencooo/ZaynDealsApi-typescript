import { db } from "../utils/firebase";


export const checkUserSubscription = async function checkUserSubscriptionValidity(userId: string) {
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
}
