/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  Briefcase,
  FileText,
  BarChart,
  BookOpen,
  Calendar,
  Award,
  Menu,
  X,
} from "lucide-react"
import Breadcrumb from "../BreadCrumb"
import { RoleSwitcher } from "../RoleSwitcher"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: "STARTUP" | "MENTOR" | "INVESTOR" | "ADMIN"
  userName: string
  userAvatar?: string
}

export function DashboardLayout({ children, userRole, userName, userAvatar }: DashboardLayoutProps) {
  const router = useRouter()
  const [notifications, setNotifications] = React.useState(3)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  // Define sidebar items based on user role
  const getSidebarItems = () => {
    const commonItems = [
      {
        title: "Dashboard",
        href: `/dashboard/${userRole.toLowerCase()}`,
        icon: <Home size={18} />,
      },
      {
        title: "Messages",
        href: `/dashboard/${userRole.toLowerCase()}/messages`,
        icon: <MessageSquare size={18} />,
      },
      {
        title: "Knowledge Hub",
        href: `/dashboard/${userRole.toLowerCase()}/forum`,
        icon: <BookOpen size={18} />,
      },
      {
        title: "Settings",
        href: `/dashboard/${userRole.toLowerCase()}/settings`,
        icon: <Settings size={18} />,
      },
    ]

    switch (userRole) {
      case "STARTUP":
        return [
          ...commonItems,
          {
            title: "My Startup",
            href: `/dashboard/startup/profile`,
            icon: <Briefcase size={18} />,
          },
          {
            title: "Applications",
            href: `/dashboard/startup/applications`,
            icon: <FileText size={18} />,
          },
          {
            title: "Mentors",
            href: `/dashboard/startup/mentors`,
            icon: <Users size={18} />,
          },
          {
            title: "Investors",
            href: `/dashboard/startup/investors`,
            icon: <Award size={18} />,
          },
        ]
      case "MENTOR":
        return [
          ...commonItems,
          {
            title: "My Profile",
            href: `/dashboard/mentor/profile`,
            icon: <Briefcase size={18} />,
          },
          {
            title: "Startups",
            href: `/dashboard/mentor/startups`,
            icon: <Users size={18} />,
          },
          {
            title: "Applications",
            href: `/dashboard/mentor/applications`,
            icon: <FileText size={18} />,
          },
          {
            title: "Schedule",
            href: `/dashboard/mentor/schedule`,
            icon: <Calendar size={18} />,
          },
        ]
      case "INVESTOR":
        return [
          ...commonItems,
          {
            title: "My Profile",
            href: `/dashboard/investor/profile`,
            icon: <Briefcase size={18} />,
          },
          {
            title: "Startups",
            href: `/dashboard/investor/startups`,
            icon: <Users size={18} />,
          },
          {
            title: "Investment Opportunities",
            href: `/dashboard/investor/opportunities`,
            icon: <Award size={18} />,
          },
        ]
      case "ADMIN":
        return [
          ...commonItems,
          {
            title: "Users",
            href: `/dashboard/admin/users`,
            icon: <Users size={18} />,
          },
          {
            title: "Programs",
            href: `/dashboard/admin/programs`,
            icon: <Award size={18} />,
          },
          {
            title: "Applications",
            href: `/dashboard/admin/applications`,
            icon: <FileText size={18} />,
          },
          {
            title: "Analytics",
            href: `/dashboard/admin/analytics`,
            icon: <BarChart size={18} />,
          },
        ]
      default:
        return commonItems
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar toggle */}
      <button 
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-orange-500 text-white rounded-md shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900 bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-orange-600">Startup Incubator</h2>
          </div>
          
          <nav className="flex-1 overflow-auto py-4">
            <ul className="space-y-1 px-2">
              {getSidebarItems().map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-orange-50"
                    onClick={(e) => {
                      if (window.innerWidth < 768) {
                        setIsSidebarOpen(false);
                      }
                    }}
                  >
                    <span className="text-orange-500">{item.icon}</span>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`md:ml-64 min-h-screen transition-all duration-200`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200">
          <h1 className="text-lg font-semibold text-orange-600 md:hidden ml-8">Startup Incubator</h1>

          <div className="flex items-center ml-auto space-x-4">
            {/* Role Switcher */}
            <div className="hidden md:block">
              <RoleSwitcher currentRole={userRole} />
            </div>

            <div className="relative">
              <button className="p-2 rounded-full hover:bg-orange-100">
                <Bell size={20} className="text-slate-700" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-orange-800">{userName.charAt(0)}</span>
                )}
              </div>
              <span className="text-sm font-medium hidden md:inline-block text-slate-700">{userName}</span>
            </div>

            <button 
              className="p-2 rounded-full hover:bg-orange-100" 
              onClick={handleLogout} 
              title="Logout"
            >
              <LogOut size={18} className="text-slate-700" />
            </button>
          </div>
        </header>

        {/* Mobile Role Switcher */}
        <div className="md:hidden p-4 bg-white border-b border-slate-200">
          <RoleSwitcher currentRole={userRole} />
        </div>

        {/* Breadcrumb and Content */}
        <Breadcrumb userRole={userRole} />

        <main className="p-4 md:p-6 bg-white m-4 rounded-lg shadow-sm">{children}</main>
      </div>
    </div>
  )
}