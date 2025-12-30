declare module 'iyzipay' {
    export interface IyzipayConfig {
        apiKey: string
        secretKey: string
        uri: string
    }

    export class LOCALE {
        static TR: string
    }

    export default class Iyzipay {
        constructor(config: IyzipayConfig)
        checkoutFormInitialize: {
            create(request: any, callback: (err: any, result: any) => void): void
        }
        checkoutForm: {
            retrieve(request: any, callback: (err: any, result: any) => void): void
        }
        static LOCALE: typeof LOCALE
    }
}
