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
exports.getMerchantById = exports.getMerchantByName = exports.getMerchantCategory = exports.updateMerchant = exports.getAllFoodMerchants = exports.deleteMerchant = exports.createMerchantAndAddress = exports.createMerchant = void 0;
const firebase_1 = require("../../utils/firebase");
const createMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const docRef = yield firebase_1.db.collection('merchants').add(newMerchant);
        res.status(201).send({ message: "Merchant created successfully", merchantId: docRef.id });
    }
    catch (error) {
        res.status(500).send({ message: "Error creating merchant", error: error.message });
    }
});
exports.createMerchant = createMerchant;
const createMerchantAndAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, category, subCategory, tags, address, phoneNumber, thumbnail, email, imageUrls, menuUrls, averageRate, pinCode, openingHours, instagram } = req.body;
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
            averageRate,
            pinCode,
            openingHours,
            instagram,
            createdAt: new Date()
        };
        const merchantRef = yield firebase_1.db.collection('merchants').add(merchantData);
        if (address) {
            const addressData = Object.assign(Object.assign({}, address), { merchantId: merchantRef.id, createdAt: new Date() });
            yield firebase_1.db.collection('addresses').add(addressData);
        }
        res.status(201).send({ message: "Merchant and address created successfully", merchantId: merchantRef.id });
    }
    catch (error) {
        res.status(500).send({ message: "Error creating merchant and address", error: error.message });
    }
});
exports.createMerchantAndAddress = createMerchantAndAddress;
const deleteMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const merchantId = req.params.merchantId;
    try {
        yield firebase_1.db.collection('merchants').doc(merchantId).delete();
        res.status(200).send({ message: "Merchant deleted successfully" });
    }
    catch (error) {
        res.status(500).send({ message: "Error deleting merchant", error: error.message });
    }
});
exports.deleteMerchant = deleteMerchant;
const getAllFoodMerchants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foodsRef = firebase_1.db.collection('merchants');
        const snapshot = yield foodsRef.where('category', '==', 'Food').get();
        if (snapshot.empty) {
            res.status(404).send('No foods found in Food category');
            return;
        }
        let foods = []; // Utilisez Partial<Merchant> si certains champs peuvent manquer
        snapshot.forEach(doc => {
            const food = Object.assign({ id: doc.id }, doc.data());
            foods.push(food);
        });
        res.status(200).send(foods);
    }
    catch (error) {
        res.status(500).send({ message: 'Error getting foods', error: error.message });
    }
});
exports.getAllFoodMerchants = getAllFoodMerchants;
const updateMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const merchantId = req.params.merchantId;
    const updates = req.body; // Utilisez Partial<Merchant> si certains champs peuvent manquer
    try {
        const merchantRef = firebase_1.db.collection('merchants').doc(merchantId);
        yield merchantRef.update(updates);
        res.status(200).send({ message: "Merchant updated successfully" });
    }
    catch (error) {
        res.status(500).send({ message: "Error updating merchant", error: error.message });
    }
});
exports.updateMerchant = updateMerchant;
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
const getMerchantCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, subCategory, tags, lastDocId, limit } = req.query;
    /*if (!category) {
        res.status(400).send({ message: 'Category is required' });
        return;
    }*/
    const limitSize = parseInt(limit, 10) || 25; // Défaut à 25 si non spécifié
    try {
        let query = firebase_1.db.collection('merchants');
        if (category) {
            query = query.where('category', '==', category);
        }
        if (subCategory) {
            query = query.where('subCategory', '==', subCategory);
        }
        if (tags) {
            // Assumer que tags est un seul tag pour la simplicité
            query = query.where('tags', 'array-contains', tags);
        }
        // Pagination avec startAfter si lastDocId est fourni
        const lastDocId = req.query.lastDocId;
        if (lastDocId) {
            const lastDoc = yield firebase_1.db.collection('merchants').doc(lastDocId).get();
            query = query.startAfter(lastDoc);
        }
        const snapshot = yield query.limit(limitSize).get();
        if (snapshot.empty) {
            res.status(404).send({ message: 'No merchants found matching the criteria' });
            return;
        }
        // Récupérer les adresses pour chaque marchand trouvé
        const merchantsPromises = snapshot.docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
            const merchantData = doc.data();
            const merchantId = doc.id;
            // Trouver l'adresse associée à ce marchand
            const addressesSnapshot = yield firebase_1.db.collection('addresses')
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
        }));
        const merchants = yield Promise.all(merchantsPromises);
        res.status(200).send(merchants);
    }
    catch (error) {
        console.error("Error getting merchants by category and subCategory:", error);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});
exports.getMerchantCategory = getMerchantCategory;
const getMerchantByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Assurez-vous que `name` est une chaîne. S'il ne l'est pas, convertissez-le ou gérez l'erreur.
    const name = typeof req.query.name === 'string' ? req.query.name.trim() : null;
    // Si `name` est nul ou une chaîne vide, retournez `null`.
    if (!name) {
        res.status(200).send(null);
        return;
    }
    try {
        const merchantsRef = firebase_1.db.collection('merchants');
        const snapshot = yield merchantsRef
            .where('name', '>=', name)
            .where('name', '<=', name + '\uf8ff')
            .get();
        if (snapshot.empty) {
            res.status(404).send('No merchant found with the given name');
            return;
        }
        let merchants = [];
        snapshot.forEach(doc => {
            const merchant = Object.assign({ id: doc.id }, doc.data());
            merchants.push(merchant);
        });
        res.status(200).send(merchants);
    }
    catch (error) {
        res.status(500).send({ message: 'Error getting merchant by name', error: error.message });
    }
});
exports.getMerchantByName = getMerchantByName;
const getMerchantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const merchantId = req.params.id; // Supposons que l'ID du marchand soit passé en paramètre d'URL
    try {
        // Récupérer le document du marchand
        const merchantDoc = yield firebase_1.db.collection('merchants').doc(merchantId).get();
        if (!merchantDoc.exists) {
            res.status(404).send({ message: 'Merchant not found.' });
            return;
        }
        const merchantData = merchantDoc.data();
        // Supposons que l'adresse est stockée séparément et doit être jointe
        const addressSnapshot = yield firebase_1.db.collection('addresses').where('merchantId', '==', merchantId).get();
        let addressData = {};
        if (!addressSnapshot.empty) {
            // Prendre la première adresse trouvée pour ce marchand
            addressData = addressSnapshot.docs[0].data();
        }
        // Construire le résultat avec les informations du marchand et l'adresse
        const result = Object.assign(Object.assign({ id: merchantDoc.id }, merchantData), { address: addressData // Cela inclut les détails de l'adresse récupérés séparément
         });
        res.status(200).send(result);
    }
    catch (error) {
        console.error("Error getting merchant by ID:", error);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});
exports.getMerchantById = getMerchantById;
//# sourceMappingURL=merchantController.js.map