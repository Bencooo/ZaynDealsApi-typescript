export interface Merchant {
    id: string;
    name: string;
    description: string;
    category: string;
    subCategory: string;
    phoneNumber: string;
    email: string;
    imageUrls: string[];
    menuUrls: string[]; // (beta)
    pinCode: string;
    openingHours: string; //TODO Add as a list
    createdAt: Date;
    // TODO Add instagram link
    // TODO Add address
    // TODO Reviews (beta)
    // TODO Add Tags (beta)
}