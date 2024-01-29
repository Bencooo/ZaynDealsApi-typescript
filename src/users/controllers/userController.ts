import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { db } from '../../utils/firebase';
import { User } from '../models/user';

export const createUser = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, role = 'customer' } = req.body; // Ajout de role avec une valeur par défaut
    const currentDate = new Date();

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: `${firstName} ${lastName}`
        });

        const userData: User = {
            id: userRecord.uid,
            email,
            firstName,
            lastName,
            dateOfCreation: currentDate,
            role // Ajout du rôle à userData
        };

        await db.collection('users').doc(userRecord.uid).set(userData);

        res.status(201).send({ message: "User created successfully", userId: userRecord.uid });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ message: "Error creating user", error: error.message });
    }
};


export const getUserInfo = async (req: Request, res: Response) => {
    //const userId = req.user?.uid;
    const userId = (req as any).user?.uid;
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
        return res.status(404).send('User not found');
    }

    res.status(200).send(doc.data());
};


export const updateUser = async (req: Request, res: Response) => {
    const userId = (req as any).user?.uid; // ou récupérer l'ID de l'utilisateur d'une autre manière
    const userRef = db.collection('users').doc(userId);

    try {
        const userData = req.body; // Les données à mettre à jour
        await userRef.update(userData);

        res.status(200).send({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: "Error updating user", error: error.message });
    }
};

