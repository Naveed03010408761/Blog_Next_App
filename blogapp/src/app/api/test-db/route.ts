import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    return Response.json({ message: "✅ Database connected successfully!" });
  } catch (error) {
    console.error("DB connection error:", error);
    return Response.json(
      { message: "❌ Database connection failed", error },
      { status: 500 }
    );
  }
}
