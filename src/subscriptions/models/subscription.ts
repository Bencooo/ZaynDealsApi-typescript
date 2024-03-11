export interface Subscription {
    id: string;
    title: string;
    image: string;
    price: number;
    description: string;
    startDate: Date;
    endDate: Date;
    state?: 'consumed' | 'available';
}
