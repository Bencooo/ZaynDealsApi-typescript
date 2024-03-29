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
exports.paymentSheet = exports.getDateOfActiveSubscriptions = exports.getAllSubscriptions = exports.deleteSubscription = exports.createSubscription = void 0;
const firebase_1 = require("../../utils/firebase");
const date_fns_1 = require("date-fns");
//const stripe = require('stripe')(process.env.STRIPE_SKRT_KEY);
const stripe = require('stripe')('sk_test_51OuGDWLE0MMe9UFcbMuAJ0tKY7kJtK2wNtVmMVVjAOJ5u0NG8DXiCHP7VUdfH2Ga41Vbr6S2vg1vvAVsIO7tqkfU00tuogjJdY');
const createSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subId, title, image, price, description, startDate, endDate } = req.body;
    try {
        const newSubscriptionRef = firebase_1.db.collection('subscriptions').doc(subId); // Utilise subId comme ID de document
        yield newSubscriptionRef.set({
            title,
            image,
            price,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
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
const getAllSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.uid;
        // Récupérer les IDs de souscription de l'utilisateur
        const userSubscriptionsRef = firebase_1.db.collection('userSubscriptions').where('userId', '==', userId);
        const userSubscriptionsSnapshot = yield userSubscriptionsRef.get();
        let consumedSubscriptionIds = new Set();
        userSubscriptionsSnapshot.forEach(doc => {
            consumedSubscriptionIds.add(doc.data().subscriptionId);
        });
        // Utiliser le début de la journée actuelle pour inclure les souscriptions qui expirent aujourd'hui
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Réinitialiser l'heure au début de la journée
        const subscriptionsRef = firebase_1.db.collection('subscriptions').where('endDate', '>=', today);
        const snapshot = yield subscriptionsRef.get();
        if (snapshot.empty) {
            res.status(404).send({ message: 'No subscriptions found' });
            return;
        }
        let subscriptions = snapshot.docs.map(doc => {
            const data = doc.data();
            const endDate = data.endDate ? (0, date_fns_1.format)(data.endDate.toDate(), 'yyyy-MM-dd') : null;
            const startDate = data.startDate ? (0, date_fns_1.format)(data.startDate.toDate(), 'yyyy-MM-dd') : null;
            const state = consumedSubscriptionIds.has(doc.id) ? 'consumed' : 'available';
            const subscription = Object.assign(Object.assign({ id: doc.id }, doc.data()), { startDate,
                endDate,
                state });
            return subscription;
        });
        res.status(200).send(subscriptions);
    }
    catch (error) {
        console.error('Error getting subscriptions:', error);
        res.status(500).send({ message: 'Error getting subscriptions', error: error.toString() });
    }
});
exports.getAllSubscriptions = getAllSubscriptions;
const getDateOfActiveSubscriptions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const subscriptionsRef = firebase_1.db.collection('subscriptions');
        const querySnapshot = yield subscriptionsRef
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
        const formattedEndDate = (0, date_fns_1.format)(validSubscriptionEndDate, 'yyyy-MM-dd');
        return formattedEndDate;
    }
    catch (error) {
    }
});
exports.getDateOfActiveSubscriptions = getDateOfActiveSubscriptions;
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
const paymentSheet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userRef = firebase_1.db.collection('users').doc(userId);
        const doc = yield userRef.get();
        if (!doc.exists) {
            return res.status(404).send('User not found');
        }
        const userData = doc.data();
        if (userData.stripeCustomerId) {
            // Utilisateur existant avec un Customer ID Stripe
            customer = yield stripe.customers.retrieve(userData.stripeCustomerId);
        }
        else {
            // Nouvel utilisateur, ou utilisateur sans Customer ID Stripe
            customer = yield stripe.customers.create();
            // Mise à jour de l'utilisateur avec le nouveau stripeCustomerId dans Firestore
            yield userRef.update({ stripeCustomerId: customer.id });
        }
        // Créer une clé éphémère pour le client
        const ephemeralKey = yield stripe.ephemeralKeys.create({ customer: customer.id }, { apiVersion: '2023-10-16' });
        // Créer un PaymentIntent pour le client
        const paymentIntent = yield stripe.paymentIntents.create({
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
    }
    catch (error) {
        console.error('Payment Sheet Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.paymentSheet = paymentSheet;
//# sourceMappingURL=subscriptionController.js.map