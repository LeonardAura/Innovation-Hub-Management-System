/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Loader2 } from "lucide-react";
interface Expertise {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
// Types
interface Mentor {
  id: string
  name: string
  avatar: string | null
  title: string
  bio: string
  expertise: Expertise[]
  company: string
  position: string
  yearsOfExperience: number
  location: string
  availability: string
  linkedIn: string | null
}

export default function StartupMentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("All Expertise")
  const [selectedAvailability, setSelectedAvailability] = useState("Any Availability")

  const expertiseOptions = [
    "All Expertise",
    "Software Engineering",
    "AI/ML",
    "Product Management",
    "UX Design",
    "Marketing",
    "Sales",
    "Finance",
    "Operations",
    "HealthTech",
    "Business Strategy",
    "Fundraising",
  ]

  const availabilityOptions = ["Any Availability", "1-5 hours/week", "6-10 hours/week", "10+ hours/week"]

  useEffect(() => {
    const fetchMentors = async () => {
        try {
          setIsLoading(true);
          const response = await fetch("/api/mentors");
          if (!response.ok) {
            throw new Error("Failed to fetch mentors");
          }
          const data = await response.json();
          
          console.log("Fetched mentors data:", data); // Debugging log
      
          if (!Array.isArray(data.mentors)) {
            throw new Error("Invalid data format: Expected mentors to be an array");
          }
      
          setMentors(data.mentors); // Fix: use data.mentors instead of data
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setIsLoading(false);
        }
      };
      

    fetchMentors()
  }, [])

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      searchTerm === "" ||
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesExpertise =
      selectedExpertise === "All Expertise" ||
      mentor.expertise.some((skill) => skill?.name === selectedExpertise)
    

    const availabilityHours = parseInt(mentor.availability.split(" ")[0])
    const matchesAvailability =
      selectedAvailability === "Any Availability" ||
      (selectedAvailability === "1-5 hours/week" && availabilityHours <= 5) ||
      (selectedAvailability === "6-10 hours/week" && availabilityHours > 5 && availabilityHours <= 10) ||
      (selectedAvailability === "10+ hours/week" && availabilityHours > 10)

    return matchesSearch && matchesExpertise && matchesAvailability
  })

  return (
    <DashboardLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Startup Mentors</h1>
            <p className="text-gray-500">Connect with industry experts to help grow your startup</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Expertise Dropdown */}
            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-1">
                Expertise
              </label>
              <select
                id="expertise"
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {expertiseOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Dropdown */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                id="availability"
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Loader2 className="w-10 h-10 text-blue-600 mx-auto animate-spin" />
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-8">
            <p className="font-medium">Error: {error}</p>
            <p className="mt-1">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredMentors.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">No mentors found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedExpertise("All Expertise")
                setSelectedAvailability("Any Availability")
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && filteredMentors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold mr-3">
                      {mentor.avatar ? (
                        <img
                          src={mentor.avatar}
                          alt={mentor.name || "Mentor"}
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        (mentor.name || "Mentor").charAt(0)
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{mentor.name}</h2>
                      <p className="text-sm text-blue-600">{mentor.title}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>{mentor.location}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{mentor.bio}</p>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {skill.name}
                            </span>
                            ))}

                      {mentor.expertise.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                          +{mentor.expertise.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div>
                      <span className="font-medium">Experience:</span> {mentor.yearsOfExperience} years
                    </div>
                    <div>
                      <span className="font-medium">Availability:</span> {mentor.availability}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center px-6 py-4 mt-auto border-t border-gray-100">
                  {/* <button
                    onClick={() => router.push(`/dashboard/startup/mentors/${mentor.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm font-medium"
                  >
                    View Profile
                  </button> */}
                  {mentor.linkedIn && (
                    <a
                      href={mentor.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <span className="mr-1">LinkedIn</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}