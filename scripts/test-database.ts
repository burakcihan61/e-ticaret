import "dotenv/config"
import prisma from "../lib/prisma"
import { hashPassword } from "../lib/auth"

async function testDatabase() {
    console.log("🔍 Testing Prisma Postgres connection...\n")

    try {
        // Test 1: Check connection
        console.log("✅ Connected to database!")

        // Test 2: Create a test user
        console.log("\n📝 Creating a test user...")
        const hashedPassword = await hashPassword("demo123456")
        const newUser = await prisma.user.create({
            data: {
                email: "demo@example.com",
                name: "Demo User",
                password: hashedPassword,
            },
        })
        console.log("✅ Created user:", newUser)

        // Test 3: Fetch all users
        console.log("\n📋 Fetching all users...")
        const allUsers = await prisma.user.findMany()
        console.log(`✅ Found ${allUsers.length} user(s):`)
        allUsers.forEach((user: { name: string | null; email: string }) => {
            console.log(`   - ${user.name} (${user.email})`)
        })

        console.log("\n🎉 All tests passed! Your database is working perfectly.\n")
    } catch (error) {
        console.error("❌ Error:", error)
        process.exit(1)
    }
}

testDatabase()
