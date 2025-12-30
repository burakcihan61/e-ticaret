import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    pool: {
        max: 10, // Limit to 1 connection in Session mode
    },
})

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
    })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
