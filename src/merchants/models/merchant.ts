export interface Merchant {
    id: string;
    name: string;
    description: string;
    category: string;
    subCategory: string;
    phoneNumber: string;
    email: string;
    imageUrls: string[];
    menuUrls: string[];
    pinCode: string;
    openingHours: string;
    createdAt: Date;
}