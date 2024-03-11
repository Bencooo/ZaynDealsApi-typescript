import { Request, Response } from 'express';
import { db } from '../../utils/firebase';
import { Subscription } from '../models/subscription';

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

export const getAllSubscriptions = async (req: Request, res: Response): Promise<void> => {
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
};
