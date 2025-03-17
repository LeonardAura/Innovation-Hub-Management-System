import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface StartupCardProps {
  id: string
  name: string
  description: string
  logo?: string
  industry?: string
  stage?: string
  foundedYear?: number
  website?: string
}

export function StartupCard({ id, name, description, logo, industry, stage, foundedYear, website }: StartupCardProps) {
  return (
    <div className="h-full flex flex-col rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex flex-row items-center gap-4 p-4 pb-2">
        <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100">
          {logo ? (
            <img src={logo} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-medium">{name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          {industry && (
            <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
              {industry}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 px-4">
        <p className="text-sm text-slate-600 overflow-hidden text-ellipsis line-clamp-3">{description}</p>

        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          {stage && (
            <div>
              <span className="text-slate-500 block">Stage</span>
              <span className="font-medium">{stage}</span>
            </div>
          )}
          {foundedYear && (
            <div>
              <span className="text-slate-500 block">Founded</span>
              <span className="font-medium">{foundedYear}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between p-4 pt-2 border-t border-slate-200">
        <Link 
          href={`/startups/${id}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium px-3 py-1.5 bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          View Profile
        </Link>
        {website && (
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium px-3 py-1.5 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ExternalLink size={14} className="mr-1" />
            Website
          </a>
        )}
      </div>
    </div>
  )
}