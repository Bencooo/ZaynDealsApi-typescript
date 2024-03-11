import { Request, Response } from 'express';
import { RequestWithUser } from '../../merchants/controllers/merchantController';
import { db } from '../../utils/firebase';
import { format } from 'date-fns';




export const createSubscription = async (req: Request, res: Response): Promise<void> => {
    const { subId, title, image, price, description, startDate, endDate } = req.body;

    try {
        const newSubscriptionRef = db.collection('subscriptions').doc(subId); // Utilise subId comme ID de document
        await newSubscriptionRef.set({
            title,
            image,
            price,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        res.status(201).send({ message: "Subscription created successfully", id: newSubscriptionRef.id });
    } catch (error) {
        res.status(500).send({ message: "Error creating subscription", error: error.message });
    }
};

export const deleteSubscription = async (req: Request, res: Response): Promise<void> => {
    const subId = req.params.subId;

    try {
        const subscriptionRef = db.collection('subscriptions').doc(subId);
        await subscriptionRef.delete();
        res.status(200).send({ message: "Subscription deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting subscription", error: error.message });
    }
};

/*export const getAllSubscriptions = async (req: Request, res: Response): Promise<void> => {
    try {
        const subscriptionsRef = db.collection('subscriptions');
        const snapshot = await subscriptionsRef.get();

        if (snapshot.empty) {
            res.status(404).send({ message: 'No subscriptions found' });
            return;
        }

        let subscriptions: Subscription[] = [];
        snapshot.forEach(doc => {
            const usedCoupon: Subscription = {
                id: doc.id,...doc.data() as Subscription // Assurez-vous que les données correspondent à l'interface UsedCoupon
            };
            subscriptions.push(usedCoupon);
        });

        res.status(200).send(subscriptions);
    } catch (error) {
        res.status(500).send({ message: 'Error getting subscriptions', error: error.message });
    }
};*/

export const getAllSubscriptions = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const userId = req.user.uid;

        // Récupérer les IDs de souscription de l'utilisateur
        const userSubscriptionsRef = db.collection('userSubscriptions').where('userId', '==', userId);
        const userSubscriptionsSnapshot = await userSubscriptionsRef.get();

        let consumedSubscriptionIds = new Set<string>();
        userSubscriptionsSnapshot.forEach(doc => {
            consumedSubscriptionIds.add(doc.data().subscriptionId);
        });

        // Utiliser le début de la journée actuelle pour inclure les souscriptions qui expirent aujourd'hui
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Réinitialiser l'heure au début de la journée

        const subscriptionsRef = db.collection('subscriptions').where('endDate', '>=', today);
        const snapshot = await subscriptionsRef.get();

        if (snapshot.empty) {
            res.status(404).send({ message: 'No subscriptions found' });
            return;
        }


        let subscriptions = snapshot.docs.map(doc => {
            const data = doc.data();

            const endDate = data.endDate ? format(data.endDate.toDate(), 'yyyy-MM-dd') : null;
            const startDate = data.startDate ? format(data.startDate.toDate(), 'yyyy-MM-dd') : null;

            const state = consumedSubscriptionIds.has(doc.id) ? 'consumed' : 'available';
            const subscription = {
                id: doc.id,
                ...doc.data(),
                startDate,
                endDate,
                state,
            };
            return subscription;
        });

        res.status(200).send(subscriptions);
    } catch (error) {
        console.error('Error getting subscriptions:', error);
        res.status(500).send({ message: 'Error getting subscriptions', error: error.toString() });
    }
};




