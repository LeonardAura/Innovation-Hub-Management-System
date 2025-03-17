import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  title?: string
  className?: string
  hover?: boolean
}

export default function Card({ children, title, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-card overflow-hidden ${
        hover ? "transition-shadow hover:shadow-card-hover" : ""
      } ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-secondary">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

