export interface Merchant {
    id: string;
    name: string;//
    description: string;
    category: string;//
    subCategory: string[];//
    tags: string[];//
    address: Address;//
    phoneNumber: string;
    email: string;
    thumbnail: string;
    imageUrls: string[];//
    menuUrls: string[]; // (beta)
    averageRate: string;
    pinCode: string;
    openingHours: string[];
    createdAt: Date;
    instagram:string;
    // TODO Reviews (beta)
}

export interface Address {
    id: string;
    street: string;
    area: string;
    city: string;
    postalcode: string;
}