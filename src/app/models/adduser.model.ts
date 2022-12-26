export interface AddUser{
    name: string;
    password:string;
    email: string;
    program_type:string
    disable_payment:number
    recaptcha:string
    is_admin: boolean;
}
