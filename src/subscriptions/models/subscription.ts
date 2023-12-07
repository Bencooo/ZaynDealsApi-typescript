export interface Subscription {
    id: string;
    subId: string;
    title: string;
    price: number;
    description: string;
    duration: number; // ou string, selon comment vous stockez la durée
}
