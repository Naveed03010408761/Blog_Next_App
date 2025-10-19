import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function checkAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/"); // Redirect non-admin users
  }
  return session;
}
