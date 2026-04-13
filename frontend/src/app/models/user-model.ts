export interface User{
    id:number;
    name:string;
    email:string;
    role:'admin'|'user',
    isLocked:boolean
}

export interface userState{
    isLoggedIn:boolean,
    role:'admin'|'user'|null,
    userId?:number
}

export interface data{
    email:string,
    password:string
}