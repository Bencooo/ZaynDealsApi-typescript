export interface Coupon {
    id: string;
    subscriptionIds: string[];
    merchantId: string;
    title: string;
    description: string;
    price: string;
    rules: string;
    dealType: string;
    validityDate: Date;
    reusable: boolean;
}
