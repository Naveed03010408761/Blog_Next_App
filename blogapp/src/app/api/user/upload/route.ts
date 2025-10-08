import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json(); // Expecting Base64 image string

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "user_avatars", // You can change this folder name
    });

    return NextResponse.json(
      { url: uploadResponse.secure_url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
