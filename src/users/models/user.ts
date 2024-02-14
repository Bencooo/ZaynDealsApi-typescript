export interface User {
    id: string;
    email: string; //required
    firstName: string; //required
    lastName: string; //required
    phoneNumber: string;
    dateOfCreation: Date;
    role: string;
}

// TODO Role (customer, merchant, admin) default value = customer