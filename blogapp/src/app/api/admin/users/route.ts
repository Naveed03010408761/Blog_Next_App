import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/lib/auth";

// ✅ GET: Fetch all users (Admin only)
export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const users = await User.find({}, "name email role createdAt");

  return NextResponse.json(users);
}

// ✅ PATCH: Update user role (Promote/Demote)
export async function PATCH(req: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, newRole } = await req.json();
  if (!userId || !newRole) {
    return NextResponse.json({ error: "Missing userId or newRole" }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Role updated successfully", user });
}

// ✅ DELETE: Remove user (optional)
export async function DELETE(req: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  await dbConnect();
  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "User deleted successfully" });
}
