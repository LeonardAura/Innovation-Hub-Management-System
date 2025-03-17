"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Startup {
  id: string;
  name: string;
  description: string;
  industry: string;
  stage: string;
  location: string;
  foundedYear: number;
  teamSize: number;
  website?: string;
  logo?: string;
}

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All Industries")
  const [selectedStage, setSelectedStage] = useState<string>("All Stages")

  const industries: string[] = [
    "All Industries",
    "Software",
    "HealthTech",
    "FinTech",
    "EdTech",
    "CleanTech",
    "Logistics",
    "E-commerce",
    "AI/ML",
    "Hardware",
  ]

  const stages: string[] = ["All Stages", "Idea", "Pre-seed", "Seed", "Series A", "Series B", "Series C+"]

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/startups')
        
        if (!response.ok) {
          throw new Error('Failed to fetch startups')
        }
        
        const data: Startup[] = await response.json()
        setStartups(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchStartups()
  }, [])

  const filteredStartups = startups.filter((startup) => {
    const matchesSearch =
      searchTerm === "" ||
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesIndustry = selectedIndustry === "All Industries" || startup.industry === selectedIndustry
    const matchesStage = selectedStage === "All Stages" || startup.stage === selectedStage

    return matchesSearch && matchesIndustry && matchesStage
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Startups</h1>
          <p className="text-gray-500">Discover innovative startups in our incubator program</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search startups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <select
              id="industry"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {industries.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
              Stage
            </label>
            <select
              id="stage"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8"><p className="text-red-700">{error}</p></div>}

      {!loading && !error && (
        <>
          {filteredStartups.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No startups found</h3>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedIndustry("All Industries")
                  setSelectedStage("All Stages")
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStartups.map((startup) => (
                <div key={startup.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
                  <h2 className="text-lg font-bold text-gray-800">{startup.name}</h2>
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{startup.description}</p>
                  <Link href={`/startups/${startup.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">View Profile</Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
