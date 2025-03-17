"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Type definitions based on your Prisma schema
type Program = {
  id: string;
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  maxParticipants: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
        try {
          const response = await fetch("/api/programs");
          if (!response.ok) {
            throw new Error("Failed to fetch programs");
          }
          const data = await response.json();
      
          // Fix: Extract the `programs` array from the response
          setPrograms(data.programs || []);
        } catch (err) {
          setError("Failed to load programs. Please try again later.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      

    fetchPrograms();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Accelerator Programs
          </h1>
          <p className="mt-3 text-xl text-orange-100 max-w-3xl">
            Discover our curated programs designed to help startups grow and thrive.
            Apply today to get expert mentorship, funding opportunities, and a supportive
            community.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Programs list */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {programs.length > 0 ? (
              programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="h-3 bg-orange-500"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-gray-800">{program.name}</h2>
                      {program.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-gray-600 line-clamp-3">{program.description}</p>
                    <div className="mt-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Start Date:</span>{" "}
                        {formatDate(program.startDate)}
                      </div>
                      <div>
                        <span className="font-medium">End Date:</span>{" "}
                        {formatDate(program.endDate)}
                      </div>
                      {program.maxParticipants && (
                        <div>
                          <span className="font-medium">Max Participants:</span>{" "}
                          {program.maxParticipants}
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <Link
                        href={`/programs/${program.id}`}
                        className="inline-block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                      >
                        View Details
                      </Link>
                      {program.isActive && (
                        <Link
                          href={`/applications/new?programId=${program.id}`}
                          className="inline-block px-4 py-2 ml-2 bg-white border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors"
                        >
                          Apply Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium text-gray-600">
                  No programs available at the moment.
                </h3>
                <p className="mt-2 text-gray-500">
                  Check back soon for new opportunities!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}