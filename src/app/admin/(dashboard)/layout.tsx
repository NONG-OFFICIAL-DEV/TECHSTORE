import { requireAdminSession } from "@/lib/dal";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Toaster } from "@/components/admin/toaster";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar adminEmail={session.email} />
      <main className="min-w-0 flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      <Toaster />
    </div>
  );
}
