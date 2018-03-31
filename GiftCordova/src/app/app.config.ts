import { OpaqueToken } from "@angular/core";
export let APP_CONFIG = new OpaqueToken("app.config");

export interface IAppConfig {
    baseEndpoint: string;
    apiEndpoint: string;
}

export const AppConfig: IAppConfig = {    
    //baseEndpoint: "http://192.168.0.22:52264/",
    //apiEndpoint: "http://192.168.0.22:52264/api/"
    baseEndpoint: "http://ec2-54-171-222-244.eu-west-1.compute.amazonaws.com:8080/",
    apiEndpoint: "http://ec2-54-171-222-244.eu-west-1.compute.amazonaws.com:8080/api/"
};
