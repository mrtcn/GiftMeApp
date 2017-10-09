import { OpaqueToken } from "@angular/core";
export let APP_CONFIG = new OpaqueToken("app.config");

export interface IAppConfig {
    baseEndpoint: string;
    apiEndpoint: string;
}

export const AppConfig: IAppConfig = {    
    baseEndpoint: "http://192.168.0.13:52264/",
    apiEndpoint: "http://192.168.0.13:52264/api/"
    //baseEndpoint: "http://api.movieconnections.huretsucuklari.com/",
    //apiEndpoint: "http://api.movieconnections.huretsucuklari.com/"    
};
