export class HttpResponseSuccessModel {
    constructor(
        public code: number,
        public message: string,
        public content: any
    ) { }
}

export class HttpResponseErrorModel {
    constructor(
        public errorCode: number,
        public errorMessage: string,
        public errorContent: any
    ) { }
}

export class HttpResponseTokenErrorModel {
  constructor(
    public error: string,
    public error_description: string
  ) { }
}
