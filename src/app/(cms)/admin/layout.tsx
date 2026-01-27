import { validateRequest } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CMSSidebar } from "@/components/cms/CMSSidebar"
import "./admin.css"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="admin-layout">
      <CMSSidebar user={user} />
      <main className="admin-main">
        <div className="admin-content">{children}</div>
      </main>
    </div>
  )
}
