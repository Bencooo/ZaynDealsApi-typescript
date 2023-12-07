import { Request, Response } from 'express';
import { db } from '../../utils/firebase';
import { Merchant } from '../models/merchant';

export const createMerchant = async (req: Request, res: Response) => {
    const { name, description, category, subCategory, phoneNumber, email, imageUrls, menuUrls, pinCode, openingHours } = req.body;

    try {
        const newMerchant = {
            name,
            description,
            category,
            subCategory,
            phoneNumber,
            email,
            imageUrls,
            menuUrls,
            pinCode,
            openingHours,
            createdAt: new Date() // Date de création
        };

        const docRef = await db.collection('merchants').add(newMerchant);
        res.status(201).send({ message: "Merchant created successfully", merchantId: docRef.id });
    } catch (error) {
        res.status(500).send({ message: "Error creating merchant", error: error.message });
    }
};

export const deleteMerchant = async (req: Request, res: Response) => {
    const merchantId = req.params.merchantId;

    try {
        await db.collection('merchants').doc(merchantId).delete();
        res.status(200).send({ message: "Merchant deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting merchant", error: error.message });
    }
};

export const getAllFoodMerchants = async (req: Request, res: Response): Promise<void> => {
    try {
        const foodsRef = db.collection('merchants');
        const snapshot = await foodsRef.where('category', '==', 'Food').get();

        if (snapshot.empty) {
            res.status(404).send('No foods found in Food category');
            return;
        }

        let foods: Partial<Merchant>[] = []; // Utilisez Partial<Merchant> si certains champs peuvent manquer
        snapshot.forEach(doc => {
            const food: Partial<Merchant> = { id: doc.id, ...doc.data() };
            foods.push(food);
        });

        res.status(200).send(foods);
    } catch (error) {
        res.status(500).send({ message: 'Error getting foods', error: error.message });
    }
};

export const updateMerchant = async (req: Request, res: Response): Promise<void> => {
    const merchantId = req.params.merchantId;
    const updates: Partial<Merchant> = req.body; // Utilisez Partial<Merchant> si certains champs peuvent manquer

    try {
        const merchantRef = db.collection('merchants').doc(merchantId);
        await merchantRef.update(updates);
        res.status(200).send({ message: "Merchant updated successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error updating merchant", error: error.message });
    }
};
