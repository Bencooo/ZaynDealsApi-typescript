import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { db } from '../../utils/firebase';
import { User } from '../models/user';

export const createUser = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
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
            dateOfCreation: currentDate
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
