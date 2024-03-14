import { Request, Response } from 'express';
import { db } from '../../utils/firebase';
import { Merchant, merchantSchema } from '../models/merchant';
import { Query, DocumentData } from '@google-cloud/firestore';
import { Coupon } from '../../coupons/models/coupon';
import { checkUserSubscriptionValidity, getValidSubscriptionId } from '../../middlewares/subscriptionMiddlecare';
import { format } from 'date-fns';
import { getDateOfActiveSubscriptions } from '../../subscriptions/controllers/subscriptionController';


export interface RequestWithUser extends Request {
    user: {
        uid: string;
        // Incluez d'autres propriétés de `user` si nécessaire
    };
}


/*export const createMerchant = async (req: Request, res: Response) => {
    const { name, description, category, subCategory, tags, address, phoneNumber, thumbnail, email, imageUrls, menuUrls, averageRate, pinCode, openingHours, instagram } = req.body;

    try {
        const merchantData: Partial<Merchant> = {
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
            averageRate,
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
};*/

export const createMerchant = async (req: Request, res: Response) => {
    const { error, value } = merchantSchema.validate(req.body);


    if (error) {
        return res.status(400).send({ message: "Validation error", error: error.details });
    }

    try {
        // Destructure `value` pour séparer `address` des autres attributs
        const { address, ...merchantDetails } = value;

        // Créez le document du marchand sans l'adresse
        const merchantRef = await db.collection('merchants').add({
            ...merchantDetails, // Ceci exclut maintenant `address`
            createdAt: new Date(),
        });

        // Si `address` est présent, ajoutez-le à la collection `addresses` avec une référence au marchand
        if (address) {
            await db.collection('addresses').add({
                ...address,
                merchantId: merchantRef.id,
            });
        }

        res.status(201).send({ message: "Merchant created successfully", merchantId: merchantRef.id });
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

export const getMerchantCategory = async (req: Request, res: Response): Promise<void> => {
    const { category, subCategory, tags, lastDocId, limit } = req.query;

    /*if (!category) {
        res.status(400).send({ message: 'Category is required' });
        return;
    }*/

    const limitSize = parseInt(limit as string, 10) || 25; // Défaut à 25 si non spécifié

    try {
        let query: Query<DocumentData> = db.collection('merchants');


        if (category) {
            query = query.where('category', '==', category);
        }

        if (subCategory) {
            //query = query.where('subCategory', '==', subCategory);
            query = query.where('subCategory', 'array-contains', subCategory);
        }

        if (tags) {
            // Assumer que tags est un seul tag pour la simplicité
            query = query.where('tags', 'array-contains', tags);
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
                averageRate: merchantData.averageRate,
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

/*export const getMerchantById = async (req: RequestWithUser, res: Response) => {
    const merchantId = req.params.merchantId; // Supposons que l'ID du marchand soit passé en paramètre d'URL
    const userId = req.user.uid

    try {
        //Get Merchant with Address
        const merchantDoc = await db.collection('merchants').doc(merchantId).get();
        const addressSnapshot = await db.collection('addresses').where('merchantId', '==', merchantId).get();
        let addressData = {};
        const merchantData = merchantDoc.data();

        if (!merchantDoc.exists) {
            res.status(404).send({ message: 'Merchant not found.' });
            return;
        }
        if (merchantData.createdAt) {
            merchantData.createdAt = format(merchantData.createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss');
        }
        if (!addressSnapshot.empty) {
            // Prendre la première adresse trouvée pour ce marchand
            addressData = addressSnapshot.docs[0].data();
        }

        //Get Coupons
        const couponsSnapshot = await db.collection('coupons').where('merchantId', '==', merchantId).get();
        let couponsData: Coupon[] = []; // Utilisez le type Coupon[] pour typer correctement la variable
        if (!couponsSnapshot.empty) {
            couponsData = couponsSnapshot.docs.map(doc => {
                const coupon: Coupon = {
                    id: doc.id, 
                    ...doc.data() as Coupon 
                };
                return coupon;
            });
        }

        //Get Valid User Subcription
        const isSubscriptionValid = await checkUserSubscriptionValidity(userId);
        console.log('isSubscriptionValid', isSubscriptionValid)
        if (!isSubscriptionValid) {
            couponsData = couponsData.map(coupon => ({
                ...coupon,
                state: 'unavailable'
            }));
        }

        //Get used Coupons
        
        // Récupérer les coupons utilisés par l'utilisateur
        const usedCouponsSnapshot = await db.collection('usedCoupons').where('userId', '==', userId).get();
        let usedCouponsData = {};
        let usedCouponsIds = new Set();
        if (!usedCouponsSnapshot.empty) {
            usedCouponsIds = new Set(usedCouponsSnapshot.docs.map(doc => doc.data().couponId));
        }

        // Ajuster le champ 'state' pour chaque coupon
        couponsData = couponsData.map(coupon => {


            if (usedCouponsIds.has(coupon.id)) {
                return { ...coupon, state: isSubscriptionValid ? 'consumed' : 'unavailable'}; // Marquer comme utilisé
            } else {
                // Si l'abonnement n'est pas valide, tous les coupons deviennent 'unavailable'
                //return { ...coupon, state: 'available'};
                return { ...coupon, state: isSubscriptionValid ? 'available' : 'unavailable' };
            }
        });



        const result = {
            id: merchantDoc.id,
            ...merchantData,
            address: addressData, // Cela inclut les détails de l'adresse récupérés séparément
            coupons: couponsData,
        };

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};*/


export const getMerchantById = async (req: RequestWithUser, res: Response) => {
    const merchantId = req.params.merchantId; // Supposons que l'ID du marchand soit passé en paramètre d'URL
    const userId = req.user.uid

    try {
        //Get Merchant with Address
        const merchantDoc = await db.collection('merchants').doc(merchantId).get();
        const addressSnapshot = await db.collection('addresses').where('merchantId', '==', merchantId).get();
        let addressData = {};
        const merchantData = merchantDoc.data();

        if (!merchantDoc.exists) {
            res.status(404).send({ message: 'Merchant not found.' });
            return;
        }
        if (merchantData.createdAt) {
            merchantData.createdAt = format(merchantData.createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss');
        }
        if (!addressSnapshot.empty) {
            // Prendre la première adresse trouvée pour ce marchand
            addressData = addressSnapshot.docs[0].data();
        }

        //Get Coupons
        const couponsSnapshot = await db.collection('coupons').where('merchantId', '==', merchantId).get();
        let couponsData: Coupon[] = []; // Utilisez le type Coupon[] pour typer correctement la variable
        if (!couponsSnapshot.empty) {
            couponsData = couponsSnapshot.docs.map(doc => {
                const coupon: Coupon = {
                    id: doc.id,
                    ...doc.data() as Coupon
                };
                return coupon;
            });
        }

        //Get Valid User Subcription
        const isSubscriptionValid = await checkUserSubscriptionValidity(userId);
        console.log('isSubscriptionValid', isSubscriptionValid)
        if (!isSubscriptionValid) {
            couponsData = couponsData.map(coupon => ({
                ...coupon,
                state: 'unavailable'
            }));
        }

        const validSubscriptionId = await getValidSubscriptionId(userId);

        //Get used Coupons
        // Récupérer les coupons utilisés par l'utilisateur
        const usedCouponsSnapshot = await db.collection('usedCoupons').where('userId', '==', userId).get();
        let usedCouponsSubscriptionIds = new Map(); // Utiliser une Map pour stocker les paires couponId et leur subscriptionId

        if (!usedCouponsSnapshot.empty) {
            usedCouponsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                usedCouponsSubscriptionIds.set(data.couponId, data.subscriptionId);
            });
        }

        let validityDateFormatted = await getDateOfActiveSubscriptions();

        // Ajuster le champ 'state' pour chaque coupon
        couponsData = couponsData.map(coupon => {
            // Vérifier si le coupon a été utilisé avec l'abonnement valide
            if (usedCouponsSubscriptionIds.has(coupon.id) && usedCouponsSubscriptionIds.get(coupon.id) === validSubscriptionId && coupon.reusable === false) {
                // Le coupon a été utilisé avec l'abonnement valide
                return { 
                    ...coupon, 
                    state: 'consumed',
                    validityDate: validityDateFormatted,
                };
            } else {
                // Le coupon n'a pas été utilisé ou a été utilisé avec un abonnement différent
                return { 
                    ...coupon,
                    validityDate: validityDateFormatted, 
                    state: validSubscriptionId ? 'available' : 'unavailable' };
            }
        });



        const result = {
            id: merchantDoc.id,
            ...merchantData,
            address: addressData, // Cela inclut les détails de l'adresse récupérés séparément
            coupons: couponsData,
        };

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};
