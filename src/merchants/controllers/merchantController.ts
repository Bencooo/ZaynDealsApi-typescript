import { Request, Response } from 'express';
import { db } from '../../utils/firebase';
import { Merchant } from '../models/merchant';
import { Query, CollectionReference, DocumentData } from '@google-cloud/firestore';

export const createMerchant = async (req: Request, res: Response) => {
    const { name, description, category, subCategory, tags, address, phoneNumber, email, thumbnail, imageUrls, menuUrls, pinCode, openingHours, instagram } = req.body;

    try {
        const newMerchant = {
            name,
            description,
            category,
            subCategory,
            tags,
            //address,
            phoneNumber,
            email,
            thumbnail,
            imageUrls,
            menuUrls,
            pinCode,
            openingHours,
            instagram,
            createdAt: new Date() // Date de création
        };

        const docRef = await db.collection('merchants').add(newMerchant);
        res.status(201).send({ message: "Merchant created successfully", merchantId: docRef.id });
    } catch (error) {
        res.status(500).send({ message: "Error creating merchant", error: error.message });
    }
};


export const createMerchantAndAddress = async (req: Request, res: Response) => {
    const { name, description, category, subCategory, tags, address, phoneNumber, thumbnail, email, imageUrls, menuUrls, note, reviews, pinCode, openingHours, instagram } = req.body;

    try {
        const merchantData = {
            name,
            description,
            category,
            subCategory,
            tags,
            phoneNumber,
            email,
            thumbnail,
            imageUrls,
            menuUrls,
            note,
            reviews,
            pinCode,
            openingHours,
            instagram,
            createdAt: new Date() 
        };

        const merchantRef = await db.collection('merchants').add(merchantData);

        if (address) {
            const addressData = {
                ...address, 
                merchantId: merchantRef.id, 
                createdAt: new Date() 
            };
            await db.collection('addresses').add(addressData);
        }

        res.status(201).send({ message: "Merchant and address created successfully", merchantId: merchantRef.id });
    } catch (error) {
        res.status(500).send({ message: "Error creating merchant and address", error: error.message });
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

/*export const getMerchantCategory = async (req: Request, res: Response): Promise<void> => {
    const { category, subCategory } = req.query; // Récupération de la catégorie et de la sous-catégorie depuis la requête

    try {
        let query = db.collection('merchants').where('category', '==', category);

        // Si une sous-catégorie est spécifiée, ajoute un filtre supplémentaire pour la sous-catégorie
        if (subCategory) {
            query = query.where('subCategory', '==', subCategory);
        }

        const snapshot = await query.get();

        if (snapshot.empty) {
            res.status(404).send({ message: 'Not Found' });
            return;
        }

        let merchants: Partial<Merchant>[] = [];
        snapshot.forEach(doc => {
            merchants.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).send(merchants);
    } catch (error) {
        console.error("Error getting merchants:", error);
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
};*/

/*export const getMerchantCategory = async (req: Request, res: Response): Promise<void> => {
    const { category, subCategory, startAt, limit } = req.query;

    // Convertir startAt et limit en nombres, avec des valeurs par défaut si non spécifiées
    const startAtIndex = parseInt(startAt as string, 10) || 0; // Défaut à 0 si non spécifié
    const limitSize = parseInt(limit as string, 10) || 25; // Défaut à 25 si non spécifié

    try {
        let query: Query<DocumentData> | CollectionReference<DocumentData> = db.collection('merchants');


        // Applique le filtre de catégorie seulement si la catégorie est spécifiée
        if (category) {
            query = query.where('category', '==', category);
        }

        // Applique le filtre de sous-catégorie seulement si la sous-catégorie est spécifiée
        if (subCategory && category) { // S'assure que subCategory est utilisée uniquement si category est aussi spécifiée
            query = query.where('subCategory', '==', subCategory);
        }

        // Appliquer la pagination
        // Note : Firestore ne supporte pas directement offset comme SQL. Vous pourriez utiliser startAfter
        // avec un document de référence ou une valeur pour simuler un offset, mais cela nécessite de récupérer
        // et de passer le dernier document de la page précédente comme référence pour startAfter.
        // Ici, nous utilisons simplement limit pour simplifier.
        query = query.limit(limitSize);

        const snapshot = await query.get();

        if (snapshot.empty) {
            res.status(404).send({ message: 'No merchants found matching the criteria' });
            return;
        }

        let merchants: Partial<Merchant>[] = [];
        snapshot.forEach(doc => {
            merchants.push({ id: doc.id, ...doc.data() });
        });

        // Si vous souhaitez implémenter une pagination efficace avec startAfter, vous devez ajuster cette partie.
        // Cela implique généralement de renvoyer également le dernier document de la requête actuelle au client pour une pagination future.

        res.status(200).send(merchants.slice(startAtIndex, startAtIndex + limitSize)); // Ceci est une simplification. Voir la note ci-dessus.
    } catch (error) {
        console.error("Error getting merchants by category and subCategory:", error);
        res.status(500).send({ message: 'Error getting merchants', error: error.message });
    }
};*/

export const getMerchantCategory = async (req: Request, res: Response): Promise<void> => {
    const { category, subCategory, lastDocId, limit } = req.query;

    const limitSize = parseInt(limit as string, 10) || 25; // Défaut à 25 si non spécifié

    try {
        let query: Query<DocumentData> = db.collection('merchants');


        // Filtres de catégorie et sous-catégorie
        if (category) {
            query = query.where('category', '==', category);
        }
        if (subCategory) {
            query = query.where('subCategory', '==', subCategory);
        }

        // Pagination avec startAfter si lastDocId est fourni
        const lastDocId = req.query.lastDocId as string;
        if (lastDocId) {
            const lastDoc = await db.collection('merchants').doc(lastDocId).get();
            query = query.startAfter(lastDoc);
        }

        const snapshot = await query.limit(limitSize).get();

        if (snapshot.empty) {
            res.status(404).send({ message: 'No merchants found matching the criteria' });
            return;
        }

        // Récupérer les adresses pour chaque marchand trouvé
        const merchantsPromises = snapshot.docs.map(async (doc) => {
            const merchantData = doc.data();
            const merchantId = doc.id;

            // Trouver l'adresse associée à ce marchand
            const addressesSnapshot = await db.collection('addresses')
                .where('merchantId', '==', merchantId)
                .get();

            const area = addressesSnapshot.empty ? null : addressesSnapshot.docs[0].data().area;

            // Renvoyer uniquement les champs spécifiés
            return {
                id: merchantId,
                name: merchantData.name,
                category: merchantData.category,
                subCategory: merchantData.subCategory,
                tags: merchantData.tags,
                area, // area récupérée de l'adresse
                thumbnail: merchantData.thumbnail,
                note: merchantData.note,
            };
        });

        const merchants = await Promise.all(merchantsPromises);

        res.status(200).send(merchants);
    } catch (error) {
        console.error("Error getting merchants by category and subCategory:", error);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};

export const getMerchantByName = async (req: Request, res: Response): Promise<void> => {
    // Assurez-vous que `name` est une chaîne. S'il ne l'est pas, convertissez-le ou gérez l'erreur.
    const name = typeof req.query.name === 'string' ? req.query.name.trim() : null;

    // Si `name` est nul ou une chaîne vide, retournez `null`.
    if (!name) {
        res.status(200).send(null);
        return;
    }

    try {
        const merchantsRef = db.collection('merchants');
        const snapshot = await merchantsRef
            .where('name', '>=', name)
            .where('name', '<=', name + '\uf8ff')
            .get();

        if (snapshot.empty) {
            res.status(404).send('No merchant found with the given name');
            return;
        }

        let merchants: Partial<Merchant>[] = [];
        snapshot.forEach(doc => {
            const merchant: Partial<Merchant> = { id: doc.id, ...doc.data() };
            merchants.push(merchant);
        });

        res.status(200).send(merchants);
    } catch (error) {
        res.status(500).send({ message: 'Error getting merchant by name', error: error.message });
    }
};




