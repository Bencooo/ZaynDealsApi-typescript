import { Request, Response } from 'express';
import { db } from '../../utils/firebase';
import { UserSubscription } from '../models/userSubscription';

export const createUserSubscription = async (req: Request, res: Response): Promise<void> => {
    const { userId, subscriptionId, startDate, endDate } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        // Vérifier si la souscription existe
        const subscriptionRef = db.collection('subscriptions').doc(subscriptionId);
        const subscriptionDoc = await subscriptionRef.get();
        if (!subscriptionDoc.exists) {
            res.status(404).send({ message: "Subscription not found" });
            return;
        }

        // Créer la souscription utilisateur
        const newUserSubscriptionRef = db.collection('userSubscriptions').doc();
        await newUserSubscriptionRef.set({
            userId,
            subscriptionId,
            //startDate: new Date(startDate),
            //endDate: new Date(endDate)
        });

        res.status(201).send({ message: "User subscription created successfully"});
    } catch (error) {
        res.status(500).send({ message: "Error creating user subscription", error: error.message });
    }
};
