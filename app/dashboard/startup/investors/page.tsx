"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Loader2 } from "lucide-react";
interface InvestorProfile {
  id: string;
  firmName: string;
  bio: string;
  investmentStages: string[];
  investmentSizeLower: number | null;
  investmentSizeUpper: number | null;
  industries: string[];
  portfolioSize: number | null;
  website?: string;
  linkedIn?: string;
  user: {
    profile: {
      name: string;
      avatar?: string;
      location?: string;
    }
  }
}

export default function InvestorsPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All Industries")
  const [selectedStage, setSelectedStage] = useState<string>("All Stages")
  const [investors, setInvestors] = useState<InvestorProfile[]>([]);

  const searchParams = useSearchParams()

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

  const investmentStages: string[] = [
    "All Stages", 
    "Pre-seed", 
    "Seed", 
    "Series A", 
    "Series B", 
    "Series C+"
  ]

  useEffect(() => {
    // Set initial filters from URL parameters if they exist
    const industryParam = searchParams.get('industry');
    const stageParam = searchParams.get('stage');
    const searchParam = searchParams.get('search');
    
    if (industryParam && industries.includes(industryParam)) {
      setSelectedIndustry(industryParam);
    }
    
    if (stageParam && investmentStages.includes(stageParam)) {
      setSelectedStage(stageParam);
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    const fetchInvestors = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/investors');
      
          if (!response.ok) {
            throw new Error('Failed to fetch investors');
          }
      
          const data = await response.json();
          if (!Array.isArray(data)) {
            throw new Error('Invalid API response format');
          }
      
          setInvestors(data);
        } catch (err) {
          setError((err as Error).message);
          setInvestors([]); // Ensure investors is an array
        } finally {
          setLoading(false);
        }
      };
      

    fetchInvestors()
  }, [searchParams])

  const filteredInvestors = Array.isArray(investors) ? investors.filter((investor) => {
    const matchesSearch =
      searchTerm === "" ||
      investor.firmName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.user.profile.name.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesIndustry = 
      selectedIndustry === "All Industries" || 
      investor.industries.includes(selectedIndustry);
  
    const matchesStage = 
      selectedStage === "All Stages" || 
      investor.investmentStages.includes(selectedStage);
  
    return matchesSearch && matchesIndustry && matchesStage;
  }) : [];
  

  // Format currency for investment sizes
  const formatInvestmentSize = (amount: number | null): string => {
    if (amount === null) return "N/A";
    
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount}`;
    }
  }

  return (
    <DashboardLayout>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Investors</h1>
          <p className="text-gray-500">Connect with investors interested in startups like yours</p>
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
              placeholder="Search investors..."
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
              Investment Stage
            </label>
            <select
              id="stage"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {investmentStages.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && 
  (<Loader2 
    className="w-10 h-10 text-blue-600 mx-auto animate-spin"
  />)
      }
      {error && <div className="bg-white border border-red-200 rounded-lg p-4 mb-8"><p className="text-red-700">{error}</p></div>}

      {!loading && !error && (
        <>
          {filteredInvestors.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No investors found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
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
              {filteredInvestors.map((investor) => (
                <div key={investor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
                  <div className="p-5 flex-grow">
                    <div className="flex items-center mb-4">
                      <div className="mr-3">
                        {investor.user.profile.avatar ? (
                          <img 
                            src={investor.user.profile.avatar} 
                            alt={investor.user.profile.name} 
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-lg">
                              {investor.user.profile.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">{investor.firmName || "Independent Investor"}</h2>
                        <p className="text-sm text-gray-500">{investor.user.profile.name}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{investor.bio}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Investment Range</p>
                        <p className="font-medium">
                          {investor.investmentSizeLower && investor.investmentSizeUpper
                            ? `${formatInvestmentSize(investor.investmentSizeLower)} - ${formatInvestmentSize(investor.investmentSizeUpper)}`
                            : investor.investmentSizeLower
                            ? `From ${formatInvestmentSize(investor.investmentSizeLower)}`
                            : investor.investmentSizeUpper
                            ? `Up to ${formatInvestmentSize(investor.investmentSizeUpper)}`
                            : "Not specified"}
                        </p>
                      </div>
                      {investor.portfolioSize && (
                        <div>
                          <p className="text-sm text-gray-500">Portfolio Size</p>
                          <p className="font-medium">{investor.portfolioSize} companies</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Industries</p>
                      <div className="flex flex-wrap gap-1">
                        {investor.industries.slice(0, 3).map((industry, index) => (
                          <span key={index} className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                            {industry}
                          </span>
                        ))}
                        {investor.industries.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded-full">
                            +{investor.industries.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Investment Stages</p>
                      <div className="flex flex-wrap gap-1">
                        {investor.investmentStages.map((stage, index) => (
                          <span key={index} className="inline-block px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                            {stage}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* <div className="border-t border-gray-100 p-4 mt-auto">
                    <Link 
                      href={`/dashboard/startup/investors/${investor.id}`} 
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block text-center"
                    >
                      View Profile
                    </Link>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>

    </DashboardLayout>
   
  )
}