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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMerchantById = exports.getMerchantByName = exports.getMerchantCategory = exports.updateMerchant = exports.getAllFoodMerchants = exports.deleteMerchant = exports.createMerchant = void 0;
const firebase_1 = require("../../utils/firebase");
const merchant_1 = require("../models/merchant");
const subscriptionMiddlecare_1 = require("../../middlewares/subscriptionMiddlecare");
const date_fns_1 = require("date-fns");
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
const createMerchant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = merchant_1.merchantSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: "Validation error", error: error.details });
    }
    try {
        // Destructure `value` pour séparer `address` des autres attributs
        const { address } = value, merchantDetails = __rest(value, ["address"]);
        // Créez le document du marchand sans l'adresse
        const merchantRef = yield firebase_1.db.collection('merchants').add(Object.assign(Object.assign({}, merchantDetails), { createdAt: new Date() }));
        // Si `address` est présent, ajoutez-le à la collection `addresses` avec une référence au marchand
        if (address) {
            yield firebase_1.db.collection('addresses').add(Object.assign(Object.assign({}, address), { merchantId: merchantRef.id, createdAt: new Date() }));
        }
        res.status(201).send({ message: "Merchant created successfully", merchantId: merchantRef.id });
    }
    catch (error) {
        res.status(500).send({ message: "Error creating merchant", error: error.message });
    }
});
exports.createMerchant = createMerchant;
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
    const merchantId = req.params.merchantId; // Supposons que l'ID du marchand soit passé en paramètre d'URL
    const userId = req.user.uid;
    try {
        //Get Merchant with Address
        const merchantDoc = yield firebase_1.db.collection('merchants').doc(merchantId).get();
        const addressSnapshot = yield firebase_1.db.collection('addresses').where('merchantId', '==', merchantId).get();
        let addressData = {};
        const merchantData = merchantDoc.data();
        if (!merchantDoc.exists) {
            res.status(404).send({ message: 'Merchant not found.' });
            return;
        }
        if (merchantData.createdAt) {
            merchantData.createdAt = (0, date_fns_1.format)(merchantData.createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss');
        }
        if (!addressSnapshot.empty) {
            // Prendre la première adresse trouvée pour ce marchand
            addressData = addressSnapshot.docs[0].data();
        }
        //Get Coupons
        const couponsSnapshot = yield firebase_1.db.collection('coupons').where('merchantId', '==', merchantId).get();
        let couponsData = []; // Utilisez le type Coupon[] pour typer correctement la variable
        if (!couponsSnapshot.empty) {
            couponsData = couponsSnapshot.docs.map(doc => {
                const coupon = Object.assign({ id: doc.id }, doc.data());
                return coupon;
            });
        }
        //Get Valid User Subcription
        const isSubscriptionValid = yield (0, subscriptionMiddlecare_1.checkUserSubscription)(userId);
        if (!isSubscriptionValid) {
            couponsData = couponsData.map(coupon => (Object.assign(Object.assign({}, coupon), { state: 'unavailable' })));
        }
        //Get used Coupons
        // Récupérer les coupons utilisés par l'utilisateur
        const usedCouponsSnapshot = yield firebase_1.db.collection('usedCoupons').where('userId', '==', userId).get();
        let usedCouponsIds = new Set();
        if (!usedCouponsSnapshot.empty) {
            usedCouponsIds = new Set(usedCouponsSnapshot.docs.map(doc => doc.data().couponId));
        }
        // Ajuster le champ 'state' pour chaque coupon
        couponsData = couponsData.map(coupon => {
            if (usedCouponsIds.has(coupon.id)) {
                return Object.assign(Object.assign({}, coupon), { state: isSubscriptionValid ? 'consumed' : 'unavailable' }); // Marquer comme utilisé
            }
            else {
                // Si l'abonnement n'est pas valide, tous les coupons deviennent 'unavailable'
                //return { ...coupon, state: 'available'};
                return Object.assign(Object.assign({}, coupon), { state: isSubscriptionValid ? 'available' : 'unavailable' });
            }
        });
        const result = Object.assign(Object.assign({ id: merchantDoc.id }, merchantData), { address: addressData, coupons: couponsData });
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});
exports.getMerchantById = getMerchantById;
//# sourceMappingURL=merchantController.js.map