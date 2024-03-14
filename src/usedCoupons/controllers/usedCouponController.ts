import { Request, Response } from 'express';
import { db } from '../../utils/firebase';
import { UsedCoupon } from '../models/usedCoupon';
import { getValidSubscriptionId } from '../../middlewares/subscriptionMiddlecare';
import { RequestWithUser } from 'merchants/controllers/merchantController';

export const createUsedCoupon = async (req: RequestWithUser, res: Response): Promise<void> => {
    const { couponId } = req.body;
    const userId = req.user.uid

    try {
        console.log('userId', userId);
        // Vérifier si l'utilisateur existe
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        // Vérifier si le coupon existe
        const couponRef = db.collection('coupons').doc(couponId);
        const couponDoc = await couponRef.get();
        if (!couponDoc.exists) {
            res.status(404).send({ message: "Coupon not found" });
            return;
        }

        const validSubscriptionId = await getValidSubscriptionId(userId);
        let usedCouponRef; // Déclare la variable à un niveau accessible dans toute la fonction

        if (validSubscriptionId === null) {
            res.status(400).send({ message: "No valid subscription found for this user." });
        } else {
            // L'utilisateur a un abonnement valide, procéder à la création du coupon
            usedCouponRef = db.collection('usedCoupons').doc(); // Notez que nous n'utilisons pas `const` ici
            await usedCouponRef.set({
                userId,
                couponId,
                subscriptionId: validSubscriptionId, // Inclure l'ID d'abonnement valide
                usageDate: new Date() 
            });
        }
        

        if (usedCouponRef) {
            res.status(201).send({ message: "Used coupon created successfully", id: usedCouponRef.id });
        } 
    } catch (error) {
        res.status(500).send({ message: "Error creating used coupon", error: error.message });
    }
};

export const getUsedCouponsByUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;

    try {
        const usedCouponsRef = db.collection('usedCoupons');
        const snapshot = await usedCouponsRef.where('userId', '==', userId).get();

        if (snapshot.empty) {
            res.status(404).send({ message: 'No used coupons found for this user' });
            return;
        }

        let usedCoupons: UsedCoupon[] = [];
        snapshot.forEach(doc => {
            const usedCoupon: UsedCoupon = {
                id: doc.id, ...doc.data() as UsedCoupon // Assurez-vous que les données correspondent à l'interface UsedCoupon
            };
            usedCoupons.push(usedCoupon);
        });

        res.status(200).send(usedCoupons);
    } catch (error) {
        res.status(500).send({ message: 'Error getting used coupons', error: error.message });
    }
};

export const getUsedCouponsByUserAndMerchant = async (req: Request, res: Response): Promise<void> => {
    const userId = Array.isArray(req.headers['user-id']) ? req.headers['user-id'][0] : req.headers['user-id'];
    const merchantId = Array.isArray(req.headers['merchant-id']) ? req.headers['merchant-id'][0] : req.headers['merchant-id'];

    try {
        // TODO - GetUserId from token

        // Check if user exists
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        // Get user UsedCoupons
        const usedCouponsSnap = await db.collection('usedCoupons').where('userId', '==', userId).get();
        if (usedCouponsSnap.empty) {
            res.status(404).send({ message: 'No used coupons found for this user' });
            return;
        }

        // Get user UsedCoupons for the specific Merchant
        let usedCoupons = [];
        for (const doc of usedCouponsSnap.docs) {
            const couponId = doc.data().couponId;

            // Get Merchant ID from Coupon
            const couponDoc = await db.collection('coupons').doc(couponId).get();
            if (couponDoc.exists && couponDoc.data().merchantId === merchantId) {
                usedCoupons.push(doc.data());
            }
        }

        if (usedCoupons.length === 0) {
            res.status(404).send({ message: 'No used coupons found for this user at this merchant' });
            return;
        }

        res.status(200).send(usedCoupons);
    } catch (error) {
        res.status(500).send({ message: 'Error getting used coupons', error: error.message });
    }
};
