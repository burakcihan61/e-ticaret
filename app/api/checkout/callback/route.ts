import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { retrieveCheckoutFormResult } from "@/lib/iyzico"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const token = formData.get("token") as string

        if (!token) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?error=token_missing`,
                { status: 303 }
            )
        }

        // Retrieve payment result from iyzico
        const result = await retrieveCheckoutFormResult(token)
        console.log("iyzico callback result:", result)

        // Find the payment record by token
        const payment = await prisma.payment.findFirst({
            where: { iyzicoTransactionId: token },
            include: { order: { include: { items: true } } },
        })

        if (!payment) {
            console.error("Payment not found for token:", token)
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?error=payment_not_found`,
                { status: 303 }
            )
        }

        const order = payment.order

        if (result.status === "success" && result.paymentStatus === "SUCCESS") {
            // Check if already processed to avoid double stock decrement
            if (order.status !== "PAID") {
                // Update payment record
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: "COMPLETED",
                        iyzicoPaymentId: result.paymentId,
                        iyzicoConversationId: result.conversationId,
                        paidAt: new Date(),
                    },
                })

                // Update order status
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        status: "PAID",
                        paymentStatus: "COMPLETED",
                    },
                })

                // Update product stock and sales count
                for (const item of order.items) {
                    await prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: { decrement: item.quantity },
                            salesCount: { increment: item.quantity },
                        },
                    })
                }
            }

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}?status=success`,
                { status: 303 }
            )
        } else {
            // Payment failed
            console.error("Payment failed:", result.errorMessage)

            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: "FAILED",
                    errorMessage: result.errorMessage || "Ödeme başarısız oldu",
                },
            })

            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: "PAYMENT_FAILED",
                    paymentStatus: "FAILED",
                },
            })

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}?status=error&message=${encodeURIComponent(
                    result.errorMessage || "Ödeme başarısız oldu"
                )}`,
                { status: 303 }
            )
        }
    } catch (error: any) {
        console.error("Callback error:", error)
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?error=callback_error`,
            { status: 303 }
        )
    }
}
