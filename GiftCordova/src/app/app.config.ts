import { OpaqueToken } from "@angular/core";
export let APP_CONFIG = new OpaqueToken("app.config");

export interface IAppConfig {
    baseEndpoint: string;
    apiEndpoint: string;
}

export const AppConfig: IAppConfig = {
    //apiEndpoint: "http://api.movieconnections.huretsucuklari.com/api/",
    //baseEndpoint: "https://192.168.0.32:44302/",
    //apiEndpoint: "https://192.168.0.32:44302/api/"
    baseEndpoint: "http://192.168.0.32:52264/",
    apiEndpoint: "http://192.168.0.32:52264/api/"
    //baseEndpoint: "https://localhost:44302/",
    //apiEndpoint: "https://localhost:44302/api/"
};