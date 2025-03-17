"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"

// Mock data - would be fetched from API in a real app
const mockStartups = [
  {
    id: "1",
    name: "TechInnovate",
    logo: null,
    description:
      "AI-powered project management platform that helps teams collaborate more effectively and deliver projects on time. Our solution uses machine learning to predict project bottlenecks, automate routine tasks, and provide actionable insights to project managers.",
    industry: "Software",
    stage: "Seed",
    foundedYear: 2022,
    website: "https://techinnovate.example.com",
    teamSize: 8,
    location: "San Francisco, CA",
    fundingRaised: 750000,
    team: [
      {
        name: "Sarah Johnson",
        role: "CEO & Co-founder",
        bio: "Former product manager at Google with 10+ years of experience in tech.",
        avatar: null,
      },
      {
        name: "Michael Chen",
        role: "CTO & Co-founder",
        bio: "AI researcher with PhD from Stanford and previous experience at Meta.",
        avatar: null,
      },
      {
        name: "David Rodriguez",
        role: "Head of Product",
        bio: "Product leader with experience at Asana and Trello.",
        avatar: null,
      },
    ],
    milestones: [
      {
        title: "Company Founded",
        date: "January 2022",
        description: "TechInnovate was officially incorporated.",
        status: "COMPLETED",
      },
      {
        title: "MVP Launch",
        date: "June 2022",
        description: "Released minimum viable product to first beta users.",
        status: "COMPLETED",
      },
      {
        title: "Seed Funding",
        date: "November 2022",
        description: "Raised $750K in seed funding from angel investors.",
        status: "COMPLETED",
      },
      {
        title: "Enterprise Version",
        date: "April 2023",
        description: "Launch of enterprise version with advanced features.",
        status: "IN_PROGRESS",
      },
      {
        title: "Series A",
        date: "Q3 2023",
        description: "Target to raise $3M in Series A funding.",
        status: "PLANNED",
      },
    ],
    pitchDeck: "https://example.com/pitch-deck.pdf",
  },
  {
    id: "2",
    name: "GreenEnergy",
    logo: null,
    description:
      "Developing sustainable energy solutions for residential buildings with innovative solar panel technology. Our proprietary solar panels are 30% more efficient than traditional panels and can be installed at half the cost, making renewable energy more accessible to homeowners.",
    industry: "CleanTech",
    stage: "Series A",
    foundedYear: 2020,
    website: "https://greenenergy.example.com",
    teamSize: 15,
    location: "Austin, TX",
    fundingRaised: 3500000,
    team: [
      {
        name: "James Wilson",
        role: "CEO & Founder",
        bio: "Former Tesla engineer with expertise in renewable energy systems.",
        avatar: null,
      },
      {
        name: "Emily Chang",
        role: "COO",
        bio: "Operations expert with background in manufacturing and supply chain.",
        avatar: null,
      },
      {
        name: "Robert Martinez",
        role: "Chief Scientist",
        bio: "PhD in Materials Science with 15+ patents in solar technology.",
        avatar: null,
      },
    ],
    milestones: [
      {
        title: "Company Founded",
        date: "March 2020",
        description: "GreenEnergy was officially incorporated.",
        status: "COMPLETED",
      },
      {
        title: "Prototype Development",
        date: "December 2020",
        description: "First working prototype of high-efficiency solar panel.",
        status: "COMPLETED",
      },
      {
        title: "Seed Funding",
        date: "February 2021",
        description: "Raised $1.2M in seed funding.",
        status: "COMPLETED",
      },
      {
        title: "Series A",
        date: "January 2023",
        description: "Raised $3.5M in Series A funding.",
        status: "COMPLETED",
      },
      {
        title: "Manufacturing Scale-up",
        date: "Q4 2023",
        description: "Scale manufacturing to 10,000 units per month.",
        status: "IN_PROGRESS",
      },
    ],
    pitchDeck: "https://example.com/pitch-deck.pdf",
  },
]

export default function StartupDetailPage() {
  const { id } = useParams()
  const [startup, setStartup] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundStartup = mockStartups.find((s) => s.id === id)
      setStartup(foundStartup || null)
      setIsLoading(false)
    }, 500)
  }, [id])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!startup) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-secondary mb-2">Startup not found</h3>
          <p className="text-gray-500 mb-4">The startup you're looking for doesn't exist or has been removed.</p>
          <Link href="/startups">
            <Button variant="primary">Back to Startups</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/startups" className="text-primary hover:text-primary-hover flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Startups
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4 text-xl font-bold">
              {startup.logo ? (
                <img
                  src={startup.logo || "/placeholder.svg"}
                  alt={startup.name}
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                startup.name.charAt(0)
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary">{startup.name}</h1>
              <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                <span>{startup.location}</span>
                <span className="mx-2">•</span>
                <span>Founded {startup.foundedYear}</span>
                <span className="mx-2">•</span>
                <span>{startup.teamSize} team members</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:ml-auto">
            {startup.website && (
              <a href={startup.website} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Visit Website
              </a>
            )}
            <Button variant="primary">Contact Startup</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="primary">{startup.stage}</Badge>
          <Badge variant="secondary">{startup.industry}</Badge>
          {startup.fundingRaised && (
            <Badge variant="success">${(startup.fundingRaised / 1000000).toFixed(1)}M Raised</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="About">
            <p className="text-gray-600 whitespace-pre-line">{startup.description}</p>
          </Card>

          <Card title="Team">
            <div className="space-y-6">
              {startup.team.map((member: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-start ${
                    index < startup.team.length - 1 ? "pb-6 border-b border-gray-100" : ""
                  }`}
                >
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                    {member.avatar ? (
                      <img
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="text-sm text-gray-600 mt-1">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Milestones">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-8 relative">
                {startup.milestones.map((milestone: any, index: number) => (
                  <div key={index} className="flex items-start ml-6">
                    <div
                      className={`absolute left-4 -translate-x-4 w-4 h-4 rounded-full ${
                        milestone.status === "COMPLETED"
                          ? "bg-success"
                          : milestone.status === "IN_PROGRESS"
                            ? "bg-warning"
                            : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-secondary">{milestone.title}</h3>
                        <Badge
                          variant={
                            milestone.status === "COMPLETED"
                              ? "success"
                              : milestone.status === "IN_PROGRESS"
                                ? "warning"
                                : "secondary"
                          }
                          className="ml-2"
                        >
                          {milestone.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{milestone.date}</p>
                      <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Button variant="primary" fullWidth>
                Schedule Meeting
              </Button>
              <Button variant="outline" fullWidth>
                Request Pitch Deck
              </Button>
              {startup.pitchDeck && (
                <a
                  href={startup.pitchDeck}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full flex justify-center"
                >
                  View Pitch Deck
                </a>
              )}
            </div>
          </Card>

          <Card title="Investment Opportunity">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Stage</h3>
                <p className="font-medium text-secondary">{startup.stage}</p>
              </div>
              {startup.fundingRaised && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Funding Raised</h3>
                  <p className="font-medium text-secondary">${(startup.fundingRaised / 1000000).toFixed(1)}M</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Industry</h3>
                <p className="font-medium text-secondary">{startup.industry}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <Link href="/investors">
                  <Button variant="primary" fullWidth>
                    Investor Portal
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card title="Similar Startups">
            <div className="space-y-4">
              {mockStartups
                .filter((s) => s.id !== startup.id)
                .slice(0, 2)
                .map((s) => (
                  <Link
                    key={s.id}
                    href={`/startups/${s.id}`}
                    className="block hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                        {s.logo ? (
                          <img
                            src={s.logo || "/placeholder.svg"}
                            alt={s.name}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          s.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-secondary">{s.name}</h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <Badge variant="primary" className="mr-1">
                            {s.stage}
                          </Badge>
                          <span>{s.industry}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/startups">
                <Button variant="outline" size="sm">
                  View All Startups
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

