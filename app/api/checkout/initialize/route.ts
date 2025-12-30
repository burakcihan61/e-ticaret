import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { generateOrderNumber } from "@/lib/utils"
import {
    initializeCheckoutForm,
    generateConversationId,
    formatIyzicoPrice,
    getInstallmentOptions,
    type PaymentRequest,
} from "@/lib/iyzico"

export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 })
        }

        const body = await request.json()
        const { cartItems, shippingAddress, billingAddress, couponCode } = body

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: "Sepet boş" }, { status: 400 })
        }

        // Calculate totals
        const subtotal = cartItems.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        )
        const shipping = subtotal > 500 ? 0 : 29.99
        let tax = subtotal * 0.2

        // Coupon Logic
        let discount = 0
        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: couponCode },
            })

            if (coupon && coupon.isActive) {
                // Basic validation again (robustness)
                const isValidDate = !coupon.expiresAt || new Date() <= coupon.expiresAt
                const isValidLimit = !coupon.usageLimit || coupon.usageCount < coupon.usageLimit
                const isValidMinOrder =
                    !coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount)

                if (isValidDate && isValidLimit && isValidMinOrder) {
                    if (coupon.type === "PERCENTAGE") {
                        discount = (subtotal * Number(coupon.value)) / 100
                        if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
                            discount = Number(coupon.maxDiscount)
                        }
                    } else if (coupon.type === "FIXED_AMOUNT") {
                        discount = Number(coupon.value)
                    }

                    // Cap discount at subtotal
                    if (discount > subtotal) discount = subtotal
                }
            }
        }

        const total = subtotal + shipping + tax - discount

        // Create or find shipping address
        const [firstName, ...lastNameParts] = shippingAddress.fullName.split(" ")
        const lastName = lastNameParts.join(" ") || firstName

        let addressId: string

        // Check if identical address exists
        const existingAddress = await prisma.address.findFirst({
            where: {
                userId: session.id,
                address: shippingAddress.address,
                city: shippingAddress.city,
                district: shippingAddress.district,
                isDeleted: false,
                // We could add more checks like phone, but address/city/district is usually unique enough for a user
            },
        })

        if (existingAddress) {
            addressId = existingAddress.id
        } else {
            const createdAddress = await prisma.address.create({
                data: {
                    userId: session.id,
                    title: "Teslimat Adresi",
                    firstName,
                    lastName,
                    phone: shippingAddress.phone,
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    district: shippingAddress.district,
                    postalCode: shippingAddress.zipCode || "",
                    country: "Türkiye",
                },
            })
            addressId = createdAddress.id
        }

        // Create order in database
        const orderNumber = generateOrderNumber()
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: session.id,
                status: "PENDING",
                paymentStatus: "PENDING",
                total: total,
                subtotal: subtotal,
                shippingCost: shipping,
                tax: tax,
                discount: discount,
                couponCode: couponCode || null,
                paymentMethod: "CREDIT_CARD",
                shippingAddressId: addressId,
                items: {
                    create: cartItems.map((item: any) => {
                        const itemTotal = item.price * item.quantity
                        const itemTax = itemTotal * 0.2
                        return {
                            productId: item.productId,
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: item.price,
                            name: item.name,
                            sku: item.id || `SKU-${item.productId}`,
                            tax: itemTax,
                            total: itemTotal + itemTax,
                        }
                    }),
                },
            },
            include: {
                items: true,
            },
        })

        // Increment coupon usage
        if (couponCode && discount > 0) {
            await prisma.coupon.update({
                where: { code: couponCode },
                data: { usageCount: { increment: 1 } },
            })
        }

        // iyzico Payment Integration
        const conversationId = generateConversationId()
        const basketId = order.id

        // Prepare iyzico payment request
        const paymentRequest: PaymentRequest = {
            locale: "tr",
            conversationId,
            price: formatIyzicoPrice(subtotal),
            paidPrice: formatIyzicoPrice(total),
            currency: "TRY",
            basketId,
            paymentGroup: "PRODUCT",
            callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/callback`,
            enabledInstallments: getInstallmentOptions(total),
            buyer: {
                id: session.id,
                name: shippingAddress.fullName.split(" ")[0] || "Ad",
                surname: shippingAddress.fullName.split(" ").slice(1).join(" ") || "Soyad",
                email: shippingAddress.email,
                identityNumber: "11111111111", // Should come from user profile
                registrationAddress: shippingAddress.address,
                city: shippingAddress.city,
                country: "Turkey",
                ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
            },
            shippingAddress: {
                contactName: shippingAddress.fullName,
                city: shippingAddress.city,
                country: "Turkey",
                address: shippingAddress.address,
                zipCode: shippingAddress.zipCode,
            },
            billingAddress: {
                contactName: billingAddress?.fullName || shippingAddress.fullName,
                city: billingAddress?.city || shippingAddress.city,
                country: "Turkey",
                address: billingAddress?.address || shippingAddress.address,
                zipCode: billingAddress?.zipCode || shippingAddress.zipCode,
            },
            basketItems: cartItems.map((item: any) => ({
                id: item.productId,
                name: item.name,
                category1: "Product",
                itemType: "PHYSICAL",
                price: formatIyzicoPrice(item.price * item.quantity),
            })),
        }

        // Initialize iyzico checkout
        const iyzicoResult = await initializeCheckoutForm(paymentRequest)

        // Save payment token
        await prisma.payment.create({
            data: {
                orderId: order.id,
                amount: total,
                status: "PENDING",
                paymentMethod: "CREDIT_CARD",
                iyzicoTransactionId: iyzicoResult.token,
            },
        })

        return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber: order.orderNumber,
            checkoutFormContent: iyzicoResult.checkoutFormContent,
            paymentPageUrl: iyzicoResult.paymentPageUrl,
            token: iyzicoResult.token,
        })
    } catch (error: any) {
        console.error("Checkout error:", error)
        return NextResponse.json(
            { error: error.message || "Ödeme işlemi başlatılamadı" },
            { status: 500 }
        )
    }
}
