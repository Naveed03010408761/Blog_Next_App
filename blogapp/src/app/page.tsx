import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative h-[90vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.jpg')" }}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 text-center text-white max-w-2xl">
        <h1 className="text-5xl font-extrabold leading-tight drop-shadow-lg">
          Share Your Voice.<br />Inspire the World.
        </h1>
        <p className="mt-3 text-gray-300 text-lg">
          Blogify is your gateway to writing, discovering, and connecting with like-minded thinkers.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-lg transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-lg transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}