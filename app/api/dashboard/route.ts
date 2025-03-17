/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

export type Role = "STARTUP" | "MENTOR" | "INVESTOR" | "ADMIN";

interface User {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
}

interface Profile {
  name: string;
  bio?: string;
  avatar?: string;
  location?: string;
}

interface Milestone {
  id: string;
  title: string;
  description?: string;
  status: string;
  targetDate?: Date;
}

interface Application {
  id: string;
  status: string;
  feedbackNote?: string;
  programName: string;
  submittedDate: Date;
}

export interface DashboardData {
  user: User;
  profile?: Profile;
  startup?: {
    id: string;
    name: string;
    stage?: string;
    industry?: string;
    description: string;
    foundedYear?: number;
    teamSize?: number;
    fundingRaised?: number;
    milestones: {
      id: string;
      title: string;
      status: string;
      targetDate?: string;
    }[];
    applications: {
      id: string;
      programName: string;
      status: string;
      submittedDate: string;
    }[];
  };
  mentor?: {
    id: string;
    bio: string;
    yearsOfExperience?: number;
    company?: string;
    position?: string;
    availability?: string;
    expertise: string[];
  };
  investor?: {
    id: string;
    bio: string;
    firmName?: string;
    investmentStages: string[];
    investmentSizeLower?: number;
    investmentSizeUpper?: number;
    portfolioSize?: number;
    industries: string[];
  };
  admin?: {
    stats: {
      totalUsers: number;
      totalStartups: number;
      totalApplications: number;
      totalForumPosts: number;
    };
  };
}

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userId = await getCurrentUser();

    console.log("userId", userId);
    
    
    // Handle case where user is not authenticated
    if (!userId || !userId.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { id: userId.id },
      include: {
        profile: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const dashboardData: DashboardData = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as Role,
        isActive: user.isActive
      },
    };

    // Add profile data if available
    if (user.profile) {
      dashboardData.profile = {
        name: user.profile.name,
        bio: user.profile.bio || undefined,
        avatar: user.profile.avatar || undefined,
        location: user.profile.location || undefined
      };
    }

    if (user.role === "STARTUP") {
      // Fetch the startup profile including related milestones and applications
      const startup = await prisma.startup.findUnique({
        where: { userId: user.id },
        include: {
          milestones: true,
          applications: {
            include: {
              program: true
            }
          }
        },
      });

      if (startup) {
        dashboardData.startup = {
          id: startup.id,
          name: startup.name,
          stage: startup.stage || undefined,
          industry: startup.industry || undefined,
          description: startup.description,
          foundedYear: startup.foundedYear || undefined,
          teamSize: startup.teamSize || undefined,
          fundingRaised: startup.fundingRaised || undefined,
          milestones: startup.milestones.map((m) => ({
            id: m.id,
            title: m.title,
            status: m.status,
            targetDate: m.targetDate ? m.targetDate.toISOString() : undefined,
          })),
          applications: startup.applications.map((a) => ({
            id: a.id,
            programName: a.program.name,
            status: a.status,
            submittedDate: a.createdAt.toISOString(),
          })),
        };
      }
    }

    if (user.role === "MENTOR") {
      // Fetch mentor profile with related information
      const mentorProfile = await prisma.mentorProfile.findUnique({
        where: { userId: user.id },
        include: {
          expertise: true
        }
      });

      if (mentorProfile) {
        dashboardData.mentor = {
          id: mentorProfile.id,
          bio: mentorProfile.bio,
          yearsOfExperience: mentorProfile.yearsOfExperience || undefined,
          company: mentorProfile.company || undefined,
          position: mentorProfile.position || undefined,
          availability: mentorProfile.availability || undefined,
          expertise: mentorProfile.expertise.map(e => e.name)
        };
      }
    }

    if (user.role === "INVESTOR") {
      // Fetch investor profile with related information
      const investorProfile = await prisma.investorProfile.findUnique({
        where: { userId: user.id }
      });

      if (investorProfile) {
        dashboardData.investor = {
          id: investorProfile.id,
          bio: investorProfile.bio,
          firmName: investorProfile.firmName || undefined,
          investmentStages: investorProfile.investmentStages,
          investmentSizeLower: investorProfile.investmentSizeLower || undefined,
          investmentSizeUpper: investorProfile.investmentSizeUpper || undefined,
          portfolioSize: investorProfile.portfolioSize || undefined,
          industries: investorProfile.industries
        };
      }
    }

    if (user.role === "ADMIN") {
      // Fetch admin dashboard data
      const stats = await prisma.$transaction([
        prisma.user.count(),
        prisma.startup.count(),
        prisma.application.count(),
        prisma.forumPost.count(),
      ]);

      dashboardData.admin = {
        stats: {
          totalUsers: stats[0],
          totalStartups: stats[1],
          totalApplications: stats[2],
          totalForumPosts: stats[3],
        }
      };
    }

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}