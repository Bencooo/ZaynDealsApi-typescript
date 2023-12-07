import { initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

interface FirebaseConfig {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
  }

import serviceAccount from '../zayn-deals.json';

const firebaseConfig: FirebaseConfig = serviceAccount as FirebaseConfig;

// Initialisation de Firebase
const app: App = initializeApp({
    credential: cert(serviceAccount as any)
});

// Initialisation de Firestore
const db: Firestore = getFirestore(app);

export { db };
