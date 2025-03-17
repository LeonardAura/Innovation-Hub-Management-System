"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Button from "@/components/CButton"
import Card from "@/components/CCard"
import Badge from "@/components/ui/Badge"
import Input from "@/components/CInput"

// Mock data - would be fetched from API in a real app
const mockPosts = [
  {
    id: "1",
    title: "How to approach angel investors for seed funding?",
    content:
      "I'm preparing to raise a seed round for my startup and would appreciate advice on how to approach angel investors...",
    author: {
      id: "1",
      name: "John Smith",
      role: "STARTUP",
      avatar: null,
    },
    tags: ["Funding", "Investors", "Seed Round"],
    createdAt: "2024-02-15T10:30:00Z",
    commentsCount: 12,
    likesCount: 24,
  },
  {
    id: "2",
    title: "Best practices for customer acquisition in B2B SaaS",
    content: "We're a B2B SaaS startup and struggling with customer acquisition. What strategies have worked for you?",
    author: {
      id: "2",
      name: "Sarah Johnson",
      role: "STARTUP",
      avatar: null,
    },
    tags: ["Marketing", "B2B", "SaaS"],
    createdAt: "2024-02-14T15:45:00Z",
    commentsCount: 8,
    likesCount: 16,
  },
  {
    id: "3",
    title: "Advice on scaling engineering team from 5 to 20",
    content:
      "Our startup is growing rapidly and we need to scale our engineering team. Looking for advice on hiring, onboarding, and team structure.",
    author: {
      id: "3",
      name: "Michael Chen",
      role: "STARTUP",
      avatar: null,
    },
    tags: ["Engineering", "Hiring", "Team Building"],
    createdAt: "2024-02-13T09:15:00Z",
    commentsCount: 15,
    likesCount: 32,
  },
  {
    id: "4",
    title: "Mentor perspective: Common pitfalls in startup pitch decks",
    content:
      "As a mentor who has reviewed hundreds of pitch decks, I wanted to share some common mistakes I see founders make...",
    author: {
      id: "4",
      name: "David Williams",
      role: "MENTOR",
      avatar: null,
    },
    tags: ["Pitch Deck", "Fundraising", "Advice"],
    createdAt: "2024-02-12T14:20:00Z",
    commentsCount: 21,
    likesCount: 45,
  },
  {
    id: "5",
    title: "How we secured our first enterprise client - lessons learned",
    content:
      "After months of effort, we finally closed our first enterprise client. Here's what worked, what didn't, and what I wish I knew earlier...",
    author: {
      id: "5",
      name: "Jessica Lee",
      role: "STARTUP",
      avatar: null,
    },
    tags: ["Enterprise Sales", "Success Story", "B2B"],
    createdAt: "2024-02-11T11:10:00Z",
    commentsCount: 18,
    likesCount: 37,
  },
]

const popularTags = [
  "Funding",
  "Marketing",
  "Product Development",
  "Hiring",
  "Growth",
  "Pitch Deck",
  "SaaS",
  "B2B",
  "Success Story",
  "Advice",
]

export default function Forum() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTag = selectedTag === null || post.tags.includes(selectedTag)

    return matchesSearch && matchesTag
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Community Forum</h1>
          <p className="text-gray-500">Connect, share knowledge, and learn from other members</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/forum/new">
            <Button variant="primary">Create New Post</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          {selectedTag && (
            <div className="mb-4 flex items-center">
              <span className="text-sm text-gray-500 mr-2">Filtered by:</span>
              <Badge variant="primary" className="flex items-center">
                {selectedTag}
                <button onClick={() => setSelectedTag(null)} className="ml-2 text-xs">
                  ✕
                </button>
              </Badge>
            </div>
          )}

          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-secondary mb-2">No posts found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedTag(null)
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} hover className="transition-all duration-200">
                  <Link href={`/forum/${post.id}`}>
                    <h2 className="text-xl font-bold text-secondary mb-2 hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault()
                          handleTagClick(tag)
                        }}
                      >
                        <Badge variant={selectedTag === tag ? "primary" : "secondary"}>{tag}</Badge>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-2">
                        {post.author.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium">{post.author.name}</span>
                        <span className="mx-1">•</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
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
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        {post.commentsCount}
                      </div>
                      <div className="flex items-center">
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
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        {post.likesCount}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card title="Popular Tags">
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, index) => (
                <button key={index} onClick={() => handleTagClick(tag)}>
                  <Badge variant={selectedTag === tag ? "primary" : "secondary"} className="mb-2">
                    {tag}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>

          <Card title="Forum Guidelines" className="mt-6">
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Be respectful and constructive in your comments</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Share knowledge and experiences to help others</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Use appropriate tags to categorize your posts</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No promotional content or spam</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/forum/guidelines">
                <Button variant="outline" size="sm" fullWidth>
                  Read Full Guidelines
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

