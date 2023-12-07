"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.createUser = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebase_1 = require("../../utils/firebase");
const createUser = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const currentDate = new Date();
    try {
        const userRecord = await firebase_admin_1.default.auth().createUser({
            email,
            password,
            displayName: `${firstName} ${lastName}`
        });
        const userData = {
            id: userRecord.uid,
            email,
            firstName,
            lastName,
            dateOfCreation: currentDate
        };
        await firebase_1.db.collection('users').doc(userRecord.uid).set(userData);
        res.status(201).send({ message: "User created successfully", userId: userRecord.uid });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ message: "Error creating user", error: error.message });
    }
};
exports.createUser = createUser;
const getUserInfo = async (req, res) => {
    const userId = req.user?.uid;
    //const userId = (req as any).user?.uid;
    //const userId = req.user.uid;
    const userRef = firebase_1.db.collection('users').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) {
        return res.status(404).send('User not found');
    }
    res.status(200).send(doc.data());
};
exports.getUserInfo = getUserInfo;
//# sourceMappingURL=userController.js.map