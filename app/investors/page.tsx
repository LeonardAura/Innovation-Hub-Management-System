"use client"

import { useState } from "react"
import Link from "next/link"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"

// Mock data - would be fetched from API in a real app
const mockInvestors = [
  {
    id: "1",
    name: "Alex Thompson",
    avatar: null,
    title: "Managing Partner at Horizon Ventures",
    bio: "Early-stage investor focused on B2B SaaS, AI, and FinTech startups. Previously founded and exited two tech companies.",
    firmName: "Horizon Ventures",
    investmentStages: ["Seed", "Series A"],
    investmentSizeLower: 250000,
    investmentSizeUpper: 2000000,
    industries: ["SaaS", "AI/ML", "FinTech"],
    portfolioSize: 18,
    location: "San Francisco, CA",
    website: "https://horizonventures.example.com",
    linkedIn: "https://linkedin.com/in/alexthompson",
  },
  {
    id: "2",
    name: "Sophia Chen",
    avatar: null,
    title: "Founder & GP at InnoFund Capital",
    bio: "Investing in healthcare innovation and life sciences. Looking for startups with strong IP and clear path to market.",
    firmName: "InnoFund Capital",
    investmentStages: ["Seed", "Series A", "Series B"],
    investmentSizeLower: 500000,
    investmentSizeUpper: 5000000,
    industries: ["HealthTech", "BioTech", "Medical Devices"],
    portfolioSize: 12,
    location: "Boston, MA",
    website: "https://innofund.example.com",
    linkedIn: "https://linkedin.com/in/sophiachen",
  },
  {
    id: "3",
    name: "Marcus Williams",
    avatar: null,
    title: "Angel Investor",
    bio: "Solo angel investor with focus on consumer tech and marketplaces. Former VP of Product at leading tech companies.",
    firmName: null,
    investmentStages: ["Pre-seed", "Seed"],
    investmentSizeLower: 25000,
    investmentSizeUpper: 250000,
    industries: ["Consumer Tech", "Marketplaces", "E-commerce"],
    portfolioSize: 15,
    location: "New York, NY",
    website: null,
    linkedIn: "https://linkedin.com/in/marcuswilliams",
  },
  {
    id: "4",
    name: "Olivia Rodriguez",
    avatar: null,
    title: "Partner at GreenTech Fund",
    bio: "Focused on sustainability and clean energy investments. Looking for startups with potential for significant environmental impact.",
    firmName: "GreenTech Fund",
    investmentStages: ["Seed", "Series A"],
    investmentSizeLower: 500000,
    investmentSizeUpper: 3000000,
    industries: ["CleanTech", "Renewable Energy", "Sustainability"],
    portfolioSize: 9,
    location: "Austin, TX",
    website: "https://greentechfund.example.com",
    linkedIn: "https://linkedin.com/in/oliviarodriguez",
  },
  {
    id: "5",
    name: "David Kim",
    avatar: null,
    title: "Managing Director at Global Ventures",
    bio: "International investor focused on startups with global expansion potential. Expertise in helping companies scale across borders.",
    firmName: "Global Ventures",
    investmentStages: ["Series A", "Series B"],
    investmentSizeLower: 1000000,
    investmentSizeUpper: 10000000,
    industries: ["Enterprise Software", "FinTech", "Logistics"],
    portfolioSize: 22,
    location: "Singapore",
    website: "https://globalventures.example.com",
    linkedIn: "https://linkedin.com/in/davidkim",
  },
  {
    id: "6",
    name: "Rachel Johnson",
    avatar: null,
    title: "Principal at Tech Accelerator Fund",
    bio: "Investing in early-stage tech startups with strong founding teams. Focus on product-led growth companies.",
    firmName: "Tech Accelerator Fund",
    investmentStages: ["Pre-seed", "Seed"],
    investmentSizeLower: 100000,
    investmentSizeUpper: 1000000,
    industries: ["SaaS", "Consumer Tech", "EdTech"],
    portfolioSize: 14,
    location: "Chicago, IL",
    website: "https://techaccelerator.example.com",
    linkedIn: "https://linkedin.com/in/racheljohnson",
  },
]

const industryOptions = [
  "All Industries",
  "SaaS",
  "AI/ML",
  "FinTech",
  "HealthTech",
  "BioTech",
  "CleanTech",
  "Consumer Tech",
  "Enterprise Software",
  "E-commerce",
  "EdTech",
]

const stageOptions = ["All Stages", "Pre-seed", "Seed", "Series A", "Series B", "Series C+"]

const investmentSizeOptions = ["Any Amount", "< $100K", "$100K - $500K", "$500K - $2M", "$2M - $5M", "$5M+"]

export default function InvestorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries")
  const [selectedStage, setSelectedStage] = useState("All Stages")
  const [selectedInvestmentSize, setSelectedInvestmentSize] = useState("Any Amount")

  const filteredInvestors = mockInvestors.filter((investor) => {
    const matchesSearch =
      searchTerm === "" ||
      investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (investor.firmName && investor.firmName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesIndustry = selectedIndustry === "All Industries" || investor.industries.includes(selectedIndustry)

    const matchesStage = selectedStage === "All Stages" || investor.investmentStages.includes(selectedStage)

    const matchesInvestmentSize = (() => {
      if (selectedInvestmentSize === "Any Amount") return true

      const lower = investor.investmentSizeLower
      const upper = investor.investmentSizeUpper

      switch (selectedInvestmentSize) {
        case "< $100K":
          return lower & lt
          100000
        case "$100K - $500K":
          return lower <= 500000 && upper >= 100000
        case "$500K - $2M":
          return lower <= 2000000 && upper >= 500000
        case "$2M - $5M":
          return lower <= 5000000 && upper >= 2000000
        case "$5M+":
          return upper > 5000000
        default:
          return true
      }
    })()

    return matchesSearch && matchesIndustry && matchesStage && matchesInvestmentSize
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Investors</h1>
          <p className="text-gray-500">Connect with investors looking for promising startups</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/investors/apply">
            <Button variant="primary">Join as Investor</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            type="text"
            placeholder="Search investors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            options={industryOptions.map((industry) => ({
              value: industry,
              label: industry,
            }))}
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            label="Industry"
          />
          <Select
            options={stageOptions.map((stage) => ({
              value: stage,
              label: stage,
            }))}
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            label="Investment Stage"
          />
          <Select
            options={investmentSizeOptions.map((size) => ({
              value: size,
              label: size,
            }))}
            value={selectedInvestmentSize}
            onChange={(e) => setSelectedInvestmentSize(e.target.value)}
            label="Investment Size"
          />
        </div>
      </div>

      {/* Results */}
      {filteredInvestors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-secondary mb-2">No investors found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedIndustry("All Industries")
              setSelectedStage("All Stages")
              setSelectedInvestmentSize("Any Amount")
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestors.map((investor) => (
            <Card key={investor.id} hover className="h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3 text-xl font-bold">
                  {investor.avatar ? (
                    <img
                      src={investor.avatar || "/placeholder.svg"}
                      alt={investor.name}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    investor.name.charAt(0)
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-secondary">{investor.name}</h2>
                  <p className="text-sm text-primary">{investor.title}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span>{investor.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{investor.bio}</p>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Industries</h3>
                <div className="flex flex-wrap gap-2">
                  {investor.industries.map((industry, index) => (
                    <Badge key={index} variant="primary">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Investment Stages</h3>
                <div className="flex flex-wrap gap-2">
                  {investor.investmentStages.map((stage, index) => (
                    <Badge key={index} variant="secondary">
                      {stage}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div>
                  <span className="font-medium">Check size:</span> ${(investor.investmentSizeLower / 1000).toFixed(0)}K
                  - ${(investor.investmentSizeUpper / 1000).toFixed(0)}K
                </div>
                <div>
                  <span className="font-medium">Portfolio:</span> {investor.portfolioSize} companies
                </div>
              </div>

              <div className="flex justify-between mt-auto pt-4 border-t border-gray-100">
                <Link href={`/investors/${investor.id}`}>
                  <Button variant="primary">View Profile</Button>
                </Link>
                {investor.linkedIn && (
                  <a
                    href={investor.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary-hover"
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
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

