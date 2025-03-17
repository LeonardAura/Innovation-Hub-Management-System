"use client"

import { useState } from "react"
import Link from "next/link"
import Card from "@/components/CCard"
import Badge from "@/components/ui/Badge"
import Button from "@/components/CButton"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"

// Mock data - would be fetched from API in a real app
const mockMentors = [
  {
    id: "1",
    name: "Dr. Emily Chen",
    avatar: null,
    title: "Former CTO at TechGiant",
    bio: "20+ years of experience in software engineering and AI. Helped scale multiple startups to successful exits.",
    expertise: ["Software Engineering", "AI/ML", "Technical Leadership", "Scaling"],
    company: "TechGiant",
    position: "Former CTO",
    yearsOfExperience: 20,
    location: "San Francisco, CA",
    availability: "10 hours/week",
    linkedIn: "https://linkedin.com/in/emilychen",
  },
  {
    id: "2",
    name: "James Wilson",
    avatar: null,
    title: "Angel Investor & Marketing Expert",
    bio: "Serial entrepreneur with 3 successful exits. Now an angel investor and mentor specializing in go-to-market strategies.",
    expertise: ["Marketing", "Growth", "Fundraising", "Product Strategy"],
    company: "Wilson Ventures",
    position: "Founder & CEO",
    yearsOfExperience: 15,
    location: "New York, NY",
    availability: "5 hours/week",
    linkedIn: "https://linkedin.com/in/jameswilson",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    avatar: null,
    title: "Product Leader & UX Specialist",
    bio: "Former Head of Product at leading tech companies. Expert in product development, UX design, and user research.",
    expertise: ["Product Management", "UX Design", "User Research", "Product Strategy"],
    company: "ProductLabs",
    position: "Principal Consultant",
    yearsOfExperience: 12,
    location: "Seattle, WA",
    availability: "8 hours/week",
    linkedIn: "https://linkedin.com/in/sarahjohnson",
  },
  {
    id: "4",
    name: "Michael Rodriguez",
    avatar: null,
    title: "Finance & Operations Expert",
    bio: "Former CFO with experience in both startups and Fortune 500 companies. Specializes in financial modeling and operational efficiency.",
    expertise: ["Finance", "Operations", "Fundraising", "Business Strategy"],
    company: "FinOps Advisors",
    position: "Managing Partner",
    yearsOfExperience: 18,
    location: "Chicago, IL",
    availability: "6 hours/week",
    linkedIn: "https://linkedin.com/in/michaelrodriguez",
  },
  {
    id: "5",
    name: "Dr. Aisha Patel",
    avatar: null,
    title: "HealthTech Innovator",
    bio: "MD-PhD with extensive experience in healthcare innovation. Founded two successful HealthTech startups.",
    expertise: ["HealthTech", "Medical Devices", "Regulatory Compliance", "Clinical Trials"],
    company: "HealthInnovate",
    position: "Founder & CEO",
    yearsOfExperience: 14,
    location: "Boston, MA",
    availability: "4 hours/week",
    linkedIn: "https://linkedin.com/in/aishapatel",
  },
  {
    id: "6",
    name: "Robert Kim",
    avatar: null,
    title: "Sales & Business Development",
    bio: "Sales leader who has built and scaled sales teams at multiple B2B SaaS companies. Expert in enterprise sales strategies.",
    expertise: ["Sales", "Business Development", "Go-to-Market", "Enterprise Sales"],
    company: "SalesAccelerator",
    position: "Founder",
    yearsOfExperience: 16,
    location: "Austin, TX",
    availability: "10 hours/week",
    linkedIn: "https://linkedin.com/in/robertkim",
  },
]

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

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("All Expertise")
  const [selectedAvailability, setSelectedAvailability] = useState("Any Availability")

  const filteredMentors = mockMentors.filter((mentor) => {
    const matchesSearch =
      searchTerm === "" ||
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesExpertise = selectedExpertise === "All Expertise" || mentor.expertise.includes(selectedExpertise)

    const matchesAvailability =
      selectedAvailability === "Any Availability" ||
      (selectedAvailability === "1-5 hours/week" && Number.parseInt(mentor.availability) <= 5) ||
      (selectedAvailability === "6-10 hours/week" &&
        Number.parseInt(mentor.availability) > 5 &&
        Number.parseInt(mentor.availability) <= 10) ||
      (selectedAvailability === "10+ hours/week" && Number.parseInt(mentor.availability) > 10)

    return matchesSearch && matchesExpertise && matchesAvailability
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Mentors</h1>
          <p className="text-gray-500">Connect with experienced mentors to help grow your startup</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/mentors/apply">
            <Button variant="primary">Become a Mentor</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Search mentors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            options={expertiseOptions.map((expertise) => ({
              value: expertise,
              label: expertise,
            }))}
            value={selectedExpertise}
            onChange={(e) => setSelectedExpertise(e.target.value)}
            label="Expertise"
          />
          <Select
            options={availabilityOptions.map((availability) => ({
              value: availability,
              label: availability,
            }))}
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            label="Availability"
          />
        </div>
      </div>

      {/* Results */}
      {filteredMentors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-secondary mb-2">No mentors found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedExpertise("All Expertise")
              setSelectedAvailability("Any Availability")
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} hover className="h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3 text-xl font-bold">
                  {mentor.avatar ? (
                    <img
                      src={mentor.avatar || "/placeholder.svg"}
                      alt={mentor.name}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    mentor.name.charAt(0)
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-secondary">{mentor.name}</h2>
                  <p className="text-sm text-primary">{mentor.title}</p>
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
                    <Badge key={index} variant="primary">
                      {skill}
                    </Badge>
                  ))}
                  {mentor.expertise.length > 3 && (
                    <Badge variant="secondary">+{mentor.expertise.length - 3} more</Badge>
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

              <div className="flex justify-between mt-auto pt-4 border-t border-gray-100">
                <Link href={`/mentors/${mentor.id}`}>
                  <Button variant="primary">View Profile</Button>
                </Link>
                {mentor.linkedIn && (
                  <a
                    href={mentor.linkedIn}
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
;```tsx file="app/mentors/[id]/page.tsx"
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

// Mock data - would be fetched from API in a real app
const mockMentors = [
  {
    id: "1",
    name: "Dr. Emily Chen",
    avatar: null,
    title: "Former CTO at TechGiant",
    bio: "20+ years of experience in software engineering and AI. Helped scale multiple startups to successful exits. Passionate about helping technical founders navigate the challenges of building and scaling engineering teams.",
    expertise: ["Software Engineering", "AI/ML", "Technical Leadership", "Scaling", "Engineering Management", "Cloud Architecture", "DevOps"],
    company: "TechGiant",
    position: "Former CTO",
    yearsOfExperience: 20,
    location: "San Francisco, CA",
    availability: "10 hours/week",
    linkedIn: "https://linkedin.com/in/emilychen",
    background: "Previously led engineering teams at Google and Amazon before becoming CTO at TechGiant, where she scaled the engineering team from 15 to 200+ engineers. Has a PhD in Computer Science from Stanford University.",
    mentoringSince: 2018,
    startupsMentored: 12,
    testimonials: [
      {
        text: "Emily's guidance was instrumental in helping us build a scalable architecture that could handle our rapid growth. Her technical insights saved us months of development time.",
        author: "Michael Lee",
        company: "DataFlow",
        position: "CTO & Co-founder",
      },
      {
        text: "Working with Emily transformed how we approach technical challenges. She helped us implement best practices that significantly improved our engineering velocity.",
        author: "Sarah Johnson",
        company: "CloudNative",
        position: "CEO",
      },
    ],
    mentorshipAreas: [
      "Technical architecture review",
      "Engineering team structure and hiring",
      "Technology stack selection",
      "Scaling infrastructure",
      "AI/ML implementation strategies",
    ],
  },
  {
    id: "2",
    name: "James Wilson",
    avatar: null,
    title: "Angel Investor & Marketing Expert",
    bio: "Serial entrepreneur with 3 successful exits. Now an angel investor and mentor specializing in go-to-market strategies. Passionate about helping founders find product-market fit and scale their customer acquisition.",
    expertise: ["Marketing", "Growth", "Fundraising", "Product Strategy", "Go-to-Market", "Customer Acquisition", "Brand Development"],
    company: "Wilson Ventures",
    position: "Founder & CEO",
    yearsOfExperience: 15,
    location: "New York, NY",
    availability: "5 hours/week",
    linkedIn: "https://linkedin.com/in/jameswilson",
    background: "Founded and exited three B2B SaaS companies, with the most recent exit valued at $120M. Angel investor in 20+ startups with 3 successful exits. MBA from Harvard Business School.",
    mentoringSince: 2016,
    startupsMentored: 25,
    testimonials: [
      {
        text: "James helped us completely revamp our go-to-market strategy, resulting in a 300% increase in customer acquisition within 6 months.",
        author: "Jessica Chen",
        company: "MarketBoost",
        position: "CEO & Co-founder",
      },
      {
        text: "His insights on positioning and messaging were game-changing for our startup. We went from struggling to explain our value to having customers instantly understand our offering.",
        author: "David Rodriguez",
        company: "SalesPro",
        position: "Founder",
      },
    ],
    mentorshipAreas: [
      "Go-to-market strategy",
      "Marketing and growth",
      "Fundraising preparation",
      "Pitch deck review",
      "Product positioning and messaging",
    ],
  },
];

export default function MentorDetailPage() {
  const { id } = useParams();
  const [mentor, setMentor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundMentor = mockMentors.find((m) => m.id === id);
      setMentor(foundMentor || null);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const availableDates = [
    "2024-03-15",
    "2024-03-16",
    "2024-03-18",
    "2024-03-20",
    "2024-03-22",
  ];

  const availableTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-secondary mb-2">
            Mentor not found
          </h3>
          <p className="text-gray-500 mb-4">
            The mentor you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/mentors">
            <Button variant="primary">Back to Mentors</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/mentors" className="text-primary hover:text-primary-hover flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Mentors
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4 text-2xl font-bold">
              {mentor.avatar ? (
                <img
                  src={mentor.avatar || "/placeholder.svg"}
                  alt={mentor.name}
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                mentor.name.charAt(0)
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary">
                {mentor.name}
              </h1>
              <p className="text-lg text-primary">{mentor.title}</p>
              <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                <span>{mentor.location}</span>
                <span className="mx-2">•</span>
                <span>{mentor.yearsOfExperience} years experience</span>
                <span className="mx-2">•</span>
                <span>Available {mentor.availability}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:ml-auto">
            {mentor.linkedIn && (
              <a
                href={mentor.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                LinkedIn Profile
              </a>
            )}
            <Button variant="primary">Request Mentorship</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="About">
            <p className="text-gray-600 whitespace-pre-line mb-4">
              {mentor.bio}
            </p>
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-medium text-secondary mb-2">Background</h3>
              <p className="text-gray-600">{mentor.background}</p>
            </div>
          </Card>

          <Card title="Expertise">
            <div className="flex flex-wrap gap-2 mb-6">
              {mentor.expertise.map((skill: string, index: number) => (
                <Badge key={index} variant="primary">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-medium text-secondary mb-2">
                Mentorship Areas
              </h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                {mentor.mentorshipAreas.map((area: string, index: number) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          </Card>

          <Card title="Testimonials">
            <div className="space-y-6">
              {mentor.testimonials.map((testimonial: any, index: number) => (
                <div
                  key={index}
                  className={`
$
{
  \
                    index &lt
  mentor.testimonials.length - 1 ? "pb-6 border-b border-gray-100" : ""
}
;`}
                >
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <span className="font-medium text-secondary">
                      {testimonial.author}
                    </span>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {testimonial.position}, {testimonial.company}
                    </span>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Schedule a Session">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Select a date</option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  disabled={!selectedDate}
                >
                  <option value="">Select a time</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant="primary"
                fullWidth
                disabled={!selectedDate || !selectedTime}
              >
                Book Session
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Sessions are 30 minutes long and conducted via video call
              </p>
            </div>
          </Card>

          <Card title="Mentorship Stats">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mentoring since</span>
                <span className="font-medium text-secondary">
                  {mentor.mentoringSince}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Startups mentored</span>
                <span className="font-medium text-secondary">
                  {mentor.startupsMentored}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current availability</span>
                <span className="font-medium text-secondary">
                  {mentor.availability}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Response rate</span>
                <span className="font-medium text-secondary">98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average rating</span>
                <div className="flex items-center">
                  <span className="font-medium text-secondary mr-1">4.9</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Similar Mentors">
            <div className="space-y-4">
              {mockMentors
                .filter((m) => m.id !== mentor.id)
                .slice(0, 2)
                .map((m) => (
                  <Link
                    key={m.id}
                    href={` /
  mentors /
  $
{
  m.id
}
`}
                    className="block hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                        {m.avatar ? (
                          <img
                            src={m.avatar || "/placeholder.svg"}
                            alt={m.name}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          m.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-secondary">
                          {m.name}
                        </h3>
                        <p className="text-xs text-gray-500">{m.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/mentors">
                <Button variant="outline" size="sm">
                  View All Mentors
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

