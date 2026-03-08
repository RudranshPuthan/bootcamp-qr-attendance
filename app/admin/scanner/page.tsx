import AdminScannerClient from "@/components/admin/AdminScannerClient";
import { requireAdmin } from "@/lib/auth";

export default async function AdminScannerPage() {
  await requireAdmin();

  return <AdminScannerClient />;
}
