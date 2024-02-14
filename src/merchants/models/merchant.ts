export interface Merchant {
    id: string;
    name: string;//
    description: string;
    category: string;//
    subCategory: string[];//
    tags: string[];//
    address: string;//
    phoneNumber: string;
    email: string;
    imageUrls: string[];//
    menuUrls: string[]; // (beta)
    pinCode: string;
    openingHours: string[];
    createdAt: Date;
    instagram:string;
    // TODO Reviews (beta)
    // TODO Add Tags (beta)
}