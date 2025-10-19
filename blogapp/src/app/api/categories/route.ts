import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

// ✅ GET - List all categories
export async function GET() {
  await dbConnect();
  const categories = await Category.find({});
  return NextResponse.json(categories, { status: 200 });
}

// ✅ POST - Create category
export async function POST(req: Request) {
  await dbConnect();
  const { name } = await req.json();
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  try {
    const category = await Category.create({ name, slug });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Category already exists" }, { status: 400 });
  }
}
