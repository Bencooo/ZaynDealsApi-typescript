export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfCreation: Date;
    role: string;
}

// TODO Role (customer, merchant, admin) default value = customer