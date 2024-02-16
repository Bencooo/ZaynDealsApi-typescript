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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserInfo = exports.createUser = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebase_1 = require("../../utils/firebase");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName, phoneNumber, role = 'customer' } = req.body;
    const currentDate = new Date();
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).send({ message: "Unprocessable entity." });
    }
    try {
        const userRecord = yield firebase_admin_1.default.auth().createUser({
            email,
            password,
            displayName: `${firstName} ${lastName}`,
            //...(phoneNumber ? { phoneNumber } : {}), // Inclut phoneNumber seulement s'il est fourni
        });
        const userData = Object.assign({ id: userRecord.uid, email,
            firstName,
            lastName,
            role, dateOfCreation: currentDate }, (phoneNumber && { phoneNumber }));
        yield firebase_1.db.collection('users').doc(userRecord.uid).set(userData);
        res.status(201).send({ message: "OK" });
    }
    catch (error) {
        console.error("Error creating user:", error);
        if (error.code === 'auth/email-already-exists') {
            return res.status(409).send({ message: "Conflict." });
        }
        else {
            return res.status(500).send({ message: "Internal Server Error", error: error.message });
        }
    }
});
exports.createUser = createUser;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //const userId = req.user?.uid;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
    const userRef = firebase_1.db.collection('users').doc(userId);
    const doc = yield userRef.get();
    if (!doc.exists) {
        return res.status(404).send('User not found');
    }
    res.status(200).send(doc.data());
});
exports.getUserInfo = getUserInfo;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.uid; // ou récupérer l'ID de l'utilisateur d'une autre manière
    const userRef = firebase_1.db.collection('users').doc(userId);
    try {
        const userData = req.body; // Les données à mettre à jour
        yield userRef.update(userData);
        res.status(200).send({ message: "User updated successfully" });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: "Error updating user", error: error.message });
    }
});
exports.updateUser = updateUser;
//# sourceMappingURL=userController.js.map