import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/categories`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json() as Promise<Category[]>;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Categories</h1>
      <ul>
        {categories.map((cat) => (
          <li key={cat._id}>
            <Link href={`/categories/${cat.slug}`}>{cat.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
