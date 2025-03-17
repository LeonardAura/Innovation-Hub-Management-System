import * as React from "react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, description, icon, trend, className }: StatsCardProps) {
  // Simple utility function to merge classNames
  const cn = (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div className={cn("rounded-lg border border-slate-200 shadow-sm overflow-hidden", className)}>
      <div className="flex flex-row items-center justify-between p-4 pb-2">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        {icon && <div className="text-[#FF6B00]">{icon}</div>}
      </div>
      <div className="px-4 pb-4">
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center mt-1">
            {trend && (
              <span className={cn("text-xs font-medium mr-2", trend.isPositive ? "text-green-600" : "text-red-600")}>
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
            )}
            {description && <p className="text-xs text-slate-500">{description}</p>}
          </div>
        )}
      </div>
    </div>
  )
}