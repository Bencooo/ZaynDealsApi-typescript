export interface Coupon {
    id: string;
    subscriptionIds: string[];
    merchantId: string;
    title: string;
    description: string;
    price: string;
    rules: string;
    dealType: string; // TODO use as an enum
    validityDate: Date; // TODO remove
    reusable: boolean;
    // TODO start and end validityDate (beta)
}
