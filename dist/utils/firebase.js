"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const zayn_deals_json_1 = __importDefault(require("../zayn-deals.json"));
const firebaseConfig = zayn_deals_json_1.default;
// Initialisation de Firebase
const app = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)(zayn_deals_json_1.default)
});
// Initialisation de Firestore
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
//# sourceMappingURL=firebase.js.map