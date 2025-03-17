/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Type definitions
type ApplicationQuestion = {
  id: string;
  question: string;
  required: boolean;
};

type Application = {
  id: string;
  status: string;
  createdAt: string;
  startup: {
    id: string;
    name: string;
    logo: string | null;
  };
};

type ProgramDetail = {
  id: string;
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  maxParticipants: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  applicationQuestions: ApplicationQuestion[];
  applications: Application[];
};

export default function ProgramDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(`/api/programs/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Program not found");
          }
          throw new Error("Failed to fetch program");
        }
        const data = await response.json();
        setProgram(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgram();
  }, [params.id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => router.push("/programs")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Back to Programs
        </button>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Program Not Found</h1>
        <p className="text-gray-700 mb-6">The program you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <button
          onClick={() => router.push("/programs")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Back to Programs
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/programs" className="text-blue-500 hover:underline">
          &larr; Back to Programs
        </Link>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/programs/${program.id}/edit`)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Edit Program
          </button>
          <button
            onClick={() => router.push(`/programs/${program.id}/applications`)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            View Applications
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{program.name}</h1>
          <span className={`px-3 py-1 rounded-full text-sm ${program.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {program.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 whitespace-pre-line">{program.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-gray-700">Start Date</h3>
            <p>{formatDate(program.startDate)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-gray-700">End Date</h3>
            <p>{formatDate(program.endDate)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-gray-700">Max Participants</h3>
            <p>{program.maxParticipants || "No limit"}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-gray-700">Created</h3>
            <p>{formatDate(program.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Application Questions Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Questions</h2>
        {program.applicationQuestions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {program.applicationQuestions.map((question) => (
              <li key={question.id} className="py-4">
                <div className="flex justify-between">
                  <p className="text-gray-800">{question.question}</p>
                  <span className={`px-2 py-1 rounded text-xs ${question.required ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                    {question.required ? "Required" : "Optional"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No application questions defined yet.</p>
        )}
        <div className="mt-4">
          <button
            onClick={() => router.push(`/programs/${program.id}/questions`)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Manage Questions
          </button>
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Applications</h2>
        {program.applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {program.applications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {application.startup.logo ? (
                          <img
                            src={application.startup.logo}
                            alt={application.startup.name}
                            className="h-10 w-10 rounded-full mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-500 font-medium">
                              {application.startup.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {application.startup.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        application.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                        application.status === "APPROVED" ? "bg-green-100 text-green-800" :
                        application.status === "REJECTED" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/applications/${application.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No applications received yet.</p>
        )}
      </div>
    </div>
  );
}