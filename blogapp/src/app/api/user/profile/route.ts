// /app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/lib/auth";

// GET user profile
export async function GET(req: NextRequest) {
  try {
    console.log("Profile fetch API called");
    
    const session = await auth();
    console.log("Session:", session?.user?.email);

    if (!session?.user?.email) {
      console.log("No session - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    console.log("Database connected");
    
    const user = await User.findOne({ email: session.user.email }).lean();
    console.log("Found user:", user);
    
    if (!user) {
      console.log("User not found for email:", session.user.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update profile
export async function PUT(req: NextRequest) {
  try {
    console.log("Profile update API called");
    
    const session = await auth();
    console.log("Session:", session?.user?.email);

    if (!session?.user?.email) {
      console.log("No session - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Update data:", body);

    await dbConnect();
    console.log("Database connected");

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        name: body.name,
        bio: body.bio,
        avatar: body.avatar,
      },
      { new: true }
    ).lean();

    console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      console.log("User not found for email:", session.user.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Profile update successful");
    return NextResponse.json({
      name: updatedUser.name,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      email: updatedUser.email,
      role: updatedUser.role,
    });

  } catch (error) {
    console.error("Profile update API error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}