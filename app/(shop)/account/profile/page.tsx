import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { CardDescription, CardTitle } from "@/components/ui/card"
import ProfileForm from "@/components/account/profile-form"
import PasswordForm from "@/components/account/password-form"
import { notFound } from "next/navigation"

export default async function ProfilePage() {
    const session = await getSession()
    if (!session) return null

    // Fetch fresh user data to get phone etc.
    const user = await prisma.user.findUnique({
        where: { id: session.id },
        select: {
            name: true,
            email: true,
            phone: true,
        },
    })

    if (!user) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div>
                <CardTitle className="text-2xl">Profil Bilgileri</CardTitle>
                <CardDescription>Hesap bilgilerinizi buradan güncelleyebilirsiniz.</CardDescription>
            </div>

            <ProfileForm user={user} />

            <PasswordForm />
        </div>
    )
}
