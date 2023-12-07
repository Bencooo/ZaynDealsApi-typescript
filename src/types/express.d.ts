import 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: { uid: string }; // Assurez-vous que cette ligne est correcte
    }
}
