export interface IUser{
    name:string;
    email:string;
    password:string;
    avatar:string;
    date:Date;
}

export interface IUserInputDto{
    name:string;
    email:string;
    password:string;
}