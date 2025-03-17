import type { ReactNode } from "react"
import Sidebar from "./Sidebar"
import Breadcrumb from "../BreadCrumb"

type Props = {
  children: ReactNode
  userRole?: string
}

export default function DashboardLayout({ children, userRole = "STARTUP" }: Props) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-16 md:ml-64 p-8 overflow-y-auto">
      <Breadcrumb userRole={userRole} />
        <main>{children}</main>
      </div>
    </div>
  )
}

