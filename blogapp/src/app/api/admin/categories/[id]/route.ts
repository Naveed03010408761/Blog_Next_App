import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { auth } from "@/lib/auth";

// UPDATE category
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { id } = params;
    const { name, description } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check if new name conflicts with other categories
    const duplicateCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      _id: { $ne: id }
    });

    if (duplicateCategory) {
      return NextResponse.json({ error: "Category name already exists" }, { status: 400 });
    }

    // Generate new slug if name changed
    const slug = name.trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        slug,
        description: description?.trim() || ''
      },
      { new: true }
    );

    return NextResponse.json({ 
      message: "Category updated successfully", 
      category: updatedCategory 
    });

  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { id } = params;

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // TODO: Check if category has posts before deleting
    // const postCount = await Post.countDocuments({ category: id });
    // if (postCount > 0) {
    //   return NextResponse.json({ 
    //     error: "Cannot delete category with existing posts" 
    //   }, { status: 400 });
    // }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ message: "Category deleted successfully" });

  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}