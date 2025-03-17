// components/RoleSwitcher.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

type UserRole = "STARTUP" | "MENTOR" | "INVESTOR" | "ADMIN"

interface RoleSwitcherProps {
  currentRole: UserRole
}

export function RoleSwitcher({ currentRole }: RoleSwitcherProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  
  const roles: UserRole[] = ["STARTUP", "MENTOR", "INVESTOR", "ADMIN"]
  
  const switchRole = async (role: UserRole) => {
    if (role === currentRole) {
      setIsOpen(false)
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/user/role-switch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to switch role")
      }
      
      // Close dropdown and refresh the page to apply the new role
      setIsOpen(false)
      router.refresh()
      
      // Redirect to appropriate dashboard based on the new role
      router.push(`/dashboard/${role.toLowerCase()}`)
    } catch (error) {
      console.error("Error switching role:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-role-switcher]')) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  return (
    <div className="relative" data-role-switcher>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-slate-700 bg-orange-100 border border-orange-300 rounded-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
      >
        <span className="mr-2">Role: {currentRole}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                disabled={isLoading}
                className={`
                  ${currentRole === role ? 'bg-orange-100 text-orange-700' : 'text-slate-700 hover:bg-orange-50'}
                  block w-full px-4 py-2 text-left text-sm transition-colors
                `}
              >
                {role}
                {currentRole === role && (
                  <span className="ml-2">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-md">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}