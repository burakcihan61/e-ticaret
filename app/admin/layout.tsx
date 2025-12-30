import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import AdminSidebar from "@/components/admin/admin-sidebar"

interface AdminLayoutProps {
    children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
    const session = await getSession()

    // Protection: Redirect to login if not authenticated or not an admin
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
        redirect("/login?callbackUrl=/admin")
    }

    return (
        <div className="bg-background flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 overflow-x-hidden transition-all duration-300">
                <div className="p-8">{children}</div>
            </main>
        </div>
    )
}
