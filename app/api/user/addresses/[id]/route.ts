import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // params is a Promise in Next.js 15
) {
    try {
        const session = await getSession()
        if (!session) {
            return new NextResponse("Yetkisiz erişim", { status: 401 })
        }

        const { id } = await params
        const body = await request.json()

        // Verify ownership
        const existingAddress = await prisma.address.findUnique({
            where: { id },
        })

        if (!existingAddress || existingAddress.userId !== session.id) {
            return new NextResponse("Adres bulunamadı", { status: 404 })
        }

        // Map form fields to schema fields
        const { fullName, zipCode, email, ...rest } = body
        let updateData: any = { ...rest }

        if (fullName) {
            const [firstName, ...lastNameParts] = fullName.split(" ")
            updateData.firstName = firstName
            updateData.lastName = lastNameParts.join(" ") || firstName
        }

        if (zipCode) {
            updateData.postalCode = zipCode
        }

        const updatedAddress = await prisma.address.update({
            where: { id },
            data: updateData,
        })

        return NextResponse.json(updatedAddress)
    } catch (error) {
        console.error("[ADDRESS_PATCH]", error)
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession()
        if (!session) {
            return new NextResponse("Yetkisiz erişim", { status: 401 })
        }

        const { id } = await params

        // Verify ownership
        const existingAddress = await prisma.address.findUnique({
            where: { id },
        })

        if (!existingAddress || existingAddress.userId !== session.id) {
            return new NextResponse("Adres bulunamadı", { status: 404 })
        }

        await prisma.address.update({
            where: { id },
            data: { isDeleted: true },
        })

        return NextResponse.json({ message: "Adres silindi" })
    } catch (error) {
        console.error("[ADDRESS_DELETE]", error)
        return new NextResponse("İç sunucu hatası", { status: 500 })
    }
}
