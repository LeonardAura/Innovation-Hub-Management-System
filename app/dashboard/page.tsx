/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Loader2 } from "lucide-react";

// Updated interfaces to match the API response
export type Role = "STARTUP" | "MENTOR" | "INVESTOR" | "ADMIN";

export interface User {
  id: string; // Changed from number to string to match API
  email: string;
  role: Role;
  isActive: boolean;
}

export interface Profile {
  name: string;
  bio?: string;
  avatar?: string;
  location?: string;
}

export interface Milestone {
  id: string;
  title: string;
  status: string;
  targetDate?: string; // Made optional to match API
}

export interface Application {
  id: string;
  programName: string;
  status: string;
  submittedDate: string;
}

export interface Startup {
  id: string; // Changed from number to string
  name: string;
  stage?: string; // Made optional to match API
  industry?: string; // Made optional to match API
  description: string;
  foundedYear?: number;
  teamSize?: number;
  fundingRaised?: number;
  milestones: Milestone[];
  applications: Application[];
}

export interface DashboardData {
  user: User;
  profile?: Profile;
  startup?: Startup;
  mentor?: any; // Add interfaces for these if needed
  investor?: any;
  admin?: any;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard");
        const result: DashboardData = await response.json();
        console.log("Dashboard data:", result); // Debug log
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
       <Loader2 size={48} className="text-blue-600 animate-spin text-center flex justify-center items-center m-auto" />
      </DashboardLayout>
    );
  }

  if (!data || !data.user) {
    return <div>No data available. Please check the console for API response details.</div>;
  }

  const { user, profile, startup } = data;

  const renderStartupDashboard = () => {
    if (!startup) {
      return <div>No startup data available. You may need to complete your startup profile.</div>;
    }
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-white shadow rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {startup.name}
                </h2>
                <div className="flex items-center mb-2">
                  {startup.stage && (
                    <span className="px-2 py-1 bg-blue-500 text-white rounded mr-2">
                      {startup.stage}
                    </span>
                  )}
                  {startup.industry && (
                    <span className="text-gray-500">{startup.industry}</span>
                  )}
                </div>
                <p className="text-gray-600">{startup.description}</p>
              </div>
              <Link href="startup/profile" className="border border-blue-600 text-blue-600 px-3 py-1 rounded">
                Edit Profile
              </Link>
            </div>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link href="/applications/new" className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded">
                Apply to Program
              </Link>
              <Link href="/milestones/new" className="block w-full text-center border border-blue-600 text-blue-600 px-4 py-2 rounded">
                Add Milestone
              </Link>
              <Link href="/mentors" className="block w-full text-center border border-blue-600 text-blue-600 px-4 py-2 rounded">
                Find Mentor
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Upcoming Milestones
            </h2>
            {startup.milestones.length > 0 ? (
              <div className="space-y-4">
                {startup.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {milestone.title}
                      </h3>
                      {milestone.targetDate && (
                        <p className="text-sm text-gray-500">
                          Target:{" "}
                          {new Date(milestone.targetDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded ${
                        milestone.status === "COMPLETED"
                          ? "bg-green-500 text-white"
                          : milestone.status === "IN_PROGRESS"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {milestone.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No milestones yet. Add your first milestone!</p>
            )}
            <div className="mt-4 text-right">
              <Link href="/milestones" className="text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm">
                View All
              </Link>
            </div>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Program Applications
            </h2>
            {startup.applications.length > 0 ? (
              <div className="space-y-4">
                {startup.applications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {application.programName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Submitted:{" "}
                        {new Date(application.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded ${
                        application.status === "APPROVED"
                          ? "bg-green-500 text-white"
                          : application.status === "REJECTED"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No applications yet. Apply to a program!</p>
            )}
            <div className="mt-4 text-right">
              <Link href="/applications" className="text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm">
                View All
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recommended Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">
                Growth Accelerator
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Perfect for startups with initial traction looking to scale.
              </p>
              <Link href="/programs/growth-accelerator" className="text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm">
                Learn More
              </Link>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">
                Investor Pitch Day
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Present your startup to our network of investors.
              </p>
              <Link href="/programs/investor-pitch-day" className="text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderMentorDashboard = () => {
    return <div>Mentor dashboard coming soon...</div>;
  };

  const renderInvestorDashboard = () => {
    return <div>Investor dashboard coming soon...</div>;
  };

  const renderAdminDashboard = () => {
    return <div>Admin dashboard coming soon...</div>;
  };

  const renderDashboardContent = () => {
    switch (user.role) {
      case "STARTUP":
        return renderStartupDashboard();
      case "MENTOR":
        return renderMentorDashboard();
      case "INVESTOR":
        return renderInvestorDashboard();
      case "ADMIN":
        return renderAdminDashboard();
      default:
        return <div>Dashboard for role {user.role} is not implemented.</div>;
    }
  };

  return (
    <DashboardLayout>
 <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, {profile?.name || user.email}! Here&apos;s an overview of your account.
        </p>
      </div>
      {renderDashboardContent()}
    </div>

    </DashboardLayout>
   
  );
}