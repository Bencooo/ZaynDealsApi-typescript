import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        (req as any).user = decodedToken;
        next();
    } catch (error) {
        res.status(403).send('Invalid token');
    }
};
