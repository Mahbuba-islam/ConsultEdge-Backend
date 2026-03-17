


export interface IcreateAdmin {
    password: string;
    admin:{
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    isDeleted?: boolean;
    deletedAt?: Date
    

    }
    
}



 