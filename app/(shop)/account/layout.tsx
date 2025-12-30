import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import AccountSidebar from "@/components/account/account-sidebar"

interface AccountLayoutProps {
    children: React.ReactNode
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
    const session = await getSession()

    if (!session) {
        redirect("/login?callbackUrl=/account/orders")
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Hesabım</h1>

            <div className="flex flex-col gap-8 lg:flex-row">
                <AccountSidebar />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    )
}
