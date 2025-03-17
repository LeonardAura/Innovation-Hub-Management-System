import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function StartupProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STARTUP") {
    redirect(`/dashboard/${user.role.toLowerCase()}`);
  }

  // Get startup profile
  const startup = await db.startup.findUnique({
    where: { userId: user.id },
  });

  // If no startup profile exists, redirect to create page
  if (!startup) {
    redirect("/dashboard/startup/profile/create");
  }

  return (
    <DashboardLayout userRole={user.role} userName={user.profile?.name || "User"} userAvatar={user.profile?.avatar || undefined}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Startup Profile</h1>
          <div className="flex gap-2 mt-4 md:mt-0">
            <a href="/dashboard/startup" className="px-4 py-2 border rounded-md">Cancel</a>
            <button type="submit" form="profile-form" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Changes</button>
          </div>
        </div>

        <form id="profile-form" action="/api/startup/profile" method="POST" className="space-y-6">
          <div className="border p-6 bg-white shadow-sm rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Startup Name</label>
                <input type="text" name="name" defaultValue={startup.name} required className="w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Founded Year</label>
                <input type="number" name="foundedYear" defaultValue={startup.foundedYear?.toString()} className="w-full border rounded-md p-2" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea name="description" rows={4} defaultValue={startup.description} required className="w-full border rounded-md p-2"></textarea>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
