import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"
import AddressesClient from "./addresses-client"

export default async function AddressesPage() {
    const session = await getSession()
    if (!session) return null

    const addresses = await prisma.address.findMany({
        where: {
            userId: session.id,
            isDeleted: false,
        },
        orderBy: { isDefault: "desc" },
    })

    return <AddressesClient initialAddresses={addresses} />
}
