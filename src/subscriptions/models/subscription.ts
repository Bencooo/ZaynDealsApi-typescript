export interface Subscription {
    id: string;
    // subId: string;
    title: string;
    price: number;
    description: string;
    duration: string; // or string
    startDate: Date;
    endDate: Date;
}
