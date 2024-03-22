import { Request, Response } from 'express';
import { RequestWithUser } from '../../merchants/controllers/merchantController';
import { db } from '../../utils/firebase';
import { format } from 'date-fns';
import { number, string } from 'joi';

//const stripe = require('stripe')(process.env.STRIPE_SKRT_KEY);
const stripe = require('stripe')('sk_test_51OuGDWLE0MMe9UFcbMuAJ0tKY7kJtK2wNtVmMVVjAOJ5u0NG8DXiCHP7VUdfH2Ga41Vbr6S2vg1vvAVsIO7tqkfU00tuogjJdY');



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

export const getDateOfActiveSubscriptions = async () => {
    try {
        const today = new Date();

        const subscriptionsRef = db.collection('subscriptions');
        const querySnapshot = await subscriptionsRef
            .where('startDate', '<=', today)
            .get();


        let validSubscriptionEndDate = null;

        querySnapshot.forEach(doc => {
            const subscription = doc.data();
            const startDate = subscription.startDate.toDate();
            const endDate = subscription.endDate.toDate();

            if (startDate <= today && endDate >= today) {
                validSubscriptionEndDate = endDate;
            }
        });

        // Formattez la endDate trouvée
        const formattedEndDate = format(validSubscriptionEndDate, 'yyyy-MM-dd');
        return formattedEndDate;
    } catch (error) {
    }
};

/*export const paymentSheet = async (req: Request, res: Response) => {
    // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2023-10-16'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 109900,
    currency: 'eur',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_51OuGDWLE0MMe9UFcRaeUPItIM4WI4OI6LZW52vwgeeoXNUY7iJ6CCRebLW5ss5ATfUNa3umpUL8eJ4Ii0FbqGut800ZhzRH88t'
  });
}*/

export const paymentSheet = async (req: RequestWithUser, res: Response) => {
    //const userId = req.body.userId; // L'ID de l'utilisateur dans votre app
    const userId = req.user.uid;
    const amount = req.body.amount;
    const currency = req.body.currency;

    if (!amount || !currency) {
        return res.status(400).send('Amount and currency are required');
    }

    let customer;

    try {
        // Récupérer l'utilisateur de Firestore
        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(404).send('User not found');
        }

        const userData = doc.data();

        if (userData.stripeCustomerId) {
            // Utilisateur existant avec un Customer ID Stripe
            customer = await stripe.customers.retrieve(userData.stripeCustomerId);
        } else {
            // Nouvel utilisateur, ou utilisateur sans Customer ID Stripe
            customer = await stripe.customers.create();
            // Mise à jour de l'utilisateur avec le nouveau stripeCustomerId dans Firestore
            await userRef.update({ stripeCustomerId: customer.id });
        }

        // Créer une clé éphémère pour le client
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2023-10-16' }
        );

        // Créer un PaymentIntent pour le client
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Le montant en centimes
            currency: currency,
            customer: customer.id,
            automatic_payment_methods: { enabled: true },
        });

        // Réponse avec les informations nécessaires pour le Frontend
        res.json({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
            publishableKey: 'pk_test_YourPublishableKey'
        });

    } catch (error) {
        console.error('Payment Sheet Error:', error);
        res.status(500).send('Internal Server Error');
    }
};





