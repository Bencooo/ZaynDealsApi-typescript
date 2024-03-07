import { Request, Response } from 'express';
import { db } from '../../utils/firebase';
import { Coupon, couponSchema } from '../models/coupon';

/*export const createCoupon = async (req: Request, res: Response): Promise<void> => {
    const { subscriptionIds, merchantId, title, description, price, rules, dealType, validityDate, reusable } = req.body;

    try {
        // Vérifier si le merchant existe
        const merchantRef = db.collection('merchants').doc(merchantId);
        const merchantDoc = await merchantRef.get();

        if (!merchantDoc.exists) {
            res.status(404).send({ message: "Merchant not found" });
            return;
        }

        // Créer le coupon
        const couponRef = db.collection('coupons').doc(); // Génère un ID automatique
        await couponRef.set({
            subscriptionIds,
            merchantId,
            title,
            description,
            price,
            rules,
            dealType,
            validityDate: new Date(validityDate), // Assurez-vous que la date est correctement formatée
            reusable
        });

        res.status(201).send({ message: "Coupon created successfully", couponId: couponRef.id });
    } catch (error) {
        res.status(500).send({ message: "Error creating coupon", error: error.message });
    }
};*/

export const createCoupon = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = couponSchema.validate(req.body);

    if (error) {
        res.status(400).send({ message: "Validation error", error: error.details });
        return;
    }

    try {
        // Vérifiez si le marchand existe
        const merchantDoc = await db.collection('merchants').doc(value.merchantId).get();
        if (!merchantDoc.exists) {
            res.status(404).send({ message: "Merchant not found" });
            return;
        }

        // Créer le coupon avec des données validées
        const couponRef = await db.collection('coupons').add({
            ...value,
            validityDate: new Date(value.validityDate), // Convertir la date si nécessaire
            //createdAt: new Date(),
        });

        res.status(201).send({ message: "Coupon created successfully", couponId: couponRef.id });
    } catch (error) {
        res.status(500).send({ message: "Error creating coupon", error: error.message });
    }
};


export const getAllCouponByMerchant = async (req: Request, res: Response): Promise<void> => {
    const merchantId = req.params.merchantId;

    try {
        const couponsQuery = db.collection('coupons').where('merchantId', '==', merchantId);
        const querySnapshot = await couponsQuery.get();

        if (querySnapshot.empty) {
            res.status(404).send({ message: "No coupons found for this merchant" });
            return;
        }

        let coupons: Coupon[] = []; // Utilisation de l'interface Coupon
        querySnapshot.forEach(doc => {
            const coupon = { id: doc.id, ...doc.data() } as Coupon;
            coupons.push(coupon);
        });

        res.status(200).send(coupons);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving coupons", error: error.message });
    }
};

export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
    const couponId = req.params.couponId;
    const updateData = req.body;

    try {
        const couponRef = db.collection('coupons').doc(couponId);
        await couponRef.update(updateData);
        res.status(200).send({ message: "Coupon updated successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error updating coupon", error: error.message });
    }
};

