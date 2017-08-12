export class RegisterViewModel {
    constructor(
        public email: string,
        public userName: string,
        public password: string,
        public gender: number,
        public confirmPassword: string,
        public birthdate: string
    ) { }
}

export class RegisterApiModel {
    constructor(
        public email: string,
        public userName: string,
        public gender: number,
        public password: string,
        public confirmPassword: string,
        public birthdate: string
    ) { 
        this.firstName = '';
        this.lastName = '';
    }
    public firstName: string;
    public lastName: string;
}

export class LoginViewModel {
    constructor(
        public userName: string,
        public password: string
    ) { }
}

export class UserInfo {
    constructor(
        public Id: number,
        public UserName: string,
        public Email: string,
        public ImagePath: string,
        public HasRegistered: boolean,
        public LoginProvider: string
    ) { }      
}

export class AccessTokenModel
{
    public access_token: string;
    public token_type: string;
    public expires_in: string;
    public userName: string;
    public '.issued': string;
    public '.expires': string;
}

export interface IName {
    firstName: string;
    lastName: string;
}

export interface IExternalAccessTokenBindingModel {
    providerKey: string;
    loginProvider: string;
    externalAccessToken: string;
}

export class EmailModel {
    email: string;
}

export class RegisterExternalBindingModel {
    constructor(
        public userName: string,
        public email: string,
        public imagePath: string,
        public externalAccessToken: string,
        public loginProvider: string,
        public providerKey: string
    ) { }
}

export class StoredUserModel {
    constructor(
        public id: number,
        public userName: string,
        public email: string,
        public imagePath: string,
        public gender: string,
        public birthdate: Date,
        public sessionKey: boolean,
        public secret: string
    ) { }
}