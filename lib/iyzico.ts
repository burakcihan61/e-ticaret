import Iyzipay from "iyzipay"

// Initialize iyzico client
const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY || "",
    secretKey: process.env.IYZICO_SECRET_KEY || "",
    uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
})

export interface PaymentItem {
    id: string
    name: string
    category1: string
    itemType: string
    price: string
}

export interface BuyerInfo {
    id: string
    name: string
    surname: string
    email: string
    identityNumber: string
    registrationAddress: string
    city: string
    country: string
    ip: string
}

export interface AddressInfo {
    contactName: string
    city: string
    country: string
    address: string
    zipCode?: string
}

export interface PaymentRequest {
    locale: string
    conversationId: string
    price: string
    paidPrice: string
    currency: string
    basketId: string
    paymentGroup: string
    callbackUrl: string
    enabledInstallments: number[]
    buyer: BuyerInfo
    shippingAddress: AddressInfo
    billingAddress: AddressInfo
    basketItems: PaymentItem[]
}

/**
 * Initialize checkout form with iyzico
 */
export async function initializeCheckoutForm(
    paymentRequest: PaymentRequest
): Promise<{ checkoutFormContent: string; token: string; paymentPageUrl: string }> {
    return new Promise((resolve, reject) => {
        iyzipay.checkoutFormInitialize.create(paymentRequest as any, (err: any, result: any) => {
            if (err) {
                console.error("iyzico error:", err)
                reject(err)
            } else if (result.status === "success") {
                resolve({
                    checkoutFormContent: result.checkoutFormContent,
                    token: result.token,
                    paymentPageUrl: result.paymentPageUrl,
                })
            } else {
                reject(new Error(result.errorMessage || "Payment initialization failed"))
            }
        })
    })
}

/**
 * Retrieve checkout form result
 */
export async function retrieveCheckoutFormResult(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
        iyzipay.checkoutForm.retrieve(
            {
                locale: Iyzipay.LOCALE.TR,
                conversationId: token,
                token: token,
            } as any,
            (err: any, result: any) => {
                if (err) {
                    console.error("iyzico retrieve error:", err)
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        )
    })
}

/**
 * Format price for iyzico (must be string with 2 decimals)
 */
export function formatIyzicoPrice(price: number): string {
    return price.toFixed(2)
}

/**
 * Generate conversation ID
 */
export function generateConversationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`
}

/**
 * Calculate installment options
 */
export function getInstallmentOptions(amount: number): number[] {
    // For amounts over 100 TL, allow installments
    if (amount >= 100) {
        return [1, 2, 3, 6, 9]
    }
    return [1]
}

export default iyzipay
