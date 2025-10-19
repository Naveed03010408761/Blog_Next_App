// "use client";
// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import Image from "next/image";
// import { useState } from "react";

// // ✅ Importing Icons
// import { 
//   HiHome, 
//   HiDocumentText, 
//   HiPlusCircle, 
//   HiUser, 
//   HiShieldCheck 
// } from "react-icons/hi2";

// export default function Navbar() {
//   const { data: session, status } = useSession();
//   const userRole = session?.user?.role; 
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <>
//       {/* Navbar */}
//       <nav className="bg-gray-900 text-white px-6 py-3 shadow-md fixed top-0 left-0 w-full flex justify-between items-center z-50">
//         <div className="flex items-center gap-4">
//           {/* Sidebar Toggle Button */}
//           {status === "authenticated" && (
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="text-white hover:text-blue-400"
//             >
//               ☰
//             </button>
//           )}

//           {/* Logo */}
//           <Link
//             href="/"
//             className="flex items-center gap-2 hover:opacity-80 transition"
//           >
//             <Image src="/logo.png" alt="Logo" width={35} height={35} />
//             <span className="text-xl font-bold">Blogify</span>
//           </Link>
//         </div>

//         {/* Center Navigation */}
//         <ul className="flex gap-6 items-center">
//           <li>
//             <Link href="/protected/home" className="hover:text-blue-400 transition">
//               Home
//             </Link>
//           </li>

//           {/* Categories Dropdown */}
//           <li className="relative group">
//             <button className="hover:text-blue-400 transition flex items-center gap-1">
//               Categories ▾
//             </button>
//             <ul className="absolute left-0 mt-2 bg-gray-800 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 w-40">
//               <li><Link href="/categories/technology" className="block px-4 py-2 hover:bg-gray-700">Technology</Link></li>
//               <li><Link href="/categories/lifestyle" className="block px-4 py-2 hover:bg-gray-700">Lifestyle</Link></li>
//               <li><Link href="/categories/health" className="block px-4 py-2 hover:bg-gray-700">Health</Link></li>
//               <li><Link href="/categories/travel" className="block px-4 py-2 hover:bg-gray-700">Travel</Link></li>
//             </ul>
//           </li>

//           <li>
//             <Link href="/about" className="hover:text-blue-400 transition">
//               About
//             </Link>
//           </li>
//         </ul>

//         {/* Auth Buttons */}
//         {status === "loading" ? null : status === "authenticated" ? (
//           <button
//             onClick={() => signOut()}
//             className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
//           >
//             Logout
//           </button>
//         ) : (
//           <Link
//             href="/signup"
//             className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
//           >
//             Signup
//           </Link>
//         )}
//       </nav>

//       {/* Sidebar Overlay */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)}>
//           <aside
//             className={`fixed top-0 left-0 w-44 h-full bg-gray-800 text-white shadow-lg p-5 z-50 transform transition-transform duration-300 ${
//               sidebarOpen ? "translate-x-0" : "-translate-x-full"
//             }`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-xl font-bold mb-4">Dashboard</h2>

//             {/* ✅ Icon Only + Hover Text Reveal */}
//             <ul className="space-y-3">
//               <li>
//                 <Link href="/protected/home" className="flex items-center gap-2 hover:text-blue-400 group">
//                   <HiHome size={22} />
//                   <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
//                     Dashboard Home
//                   </span>
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/protected/posts" className="flex items-center gap-2 hover:text-blue-400 group">
//                   <HiDocumentText size={22} />
//                   <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
//                     My Posts
//                   </span>
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/protected/new" className="flex items-center gap-2 hover:text-blue-400 group">
//                   <HiPlusCircle size={22} />
//                   <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
//                     Create Post
//                   </span>
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/protected/profile" className="flex items-center gap-2 hover:text-blue-400 group">
//                   <HiUser size={22} />
//                   <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
//                     Profile
//                   </span>
//                 </Link>
//               </li>
//               {userRole === "ADMIN" && (
//                 <li>
//                   <Link href="/protected/admin" className="flex items-center gap-2 hover:text-blue-400 group">
//                     <HiShieldCheck size={22} />
//                     <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
//                       Admin Panel
//                     </span>
//                   </Link>
//                 </li>
//               )}
//             </ul>

//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="mt-6 bg-red-500 hover:bg-red-600 px-3 py-1 rounded w-full"
//             >
//               Close
//             </button>
//           </aside>
//         </div>
//       )}
//     </>
//   );
// }



"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";

// ✅ Icons
import { 
  HiHome, 
  HiDocumentText, 
  HiPlusCircle, 
  HiUser, 
  HiShieldCheck 
} from "react-icons/hi2";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // ✅ Fetch categories ONLY when authenticated
  useEffect(() => {
    const fetchCategories = async () => {
      // Only fetch categories if user is authenticated
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/categories");
          const data = await res.json();
          setCategories(Array.isArray(data) ? data : data.categories || []);
        } catch (error) {
          console.error("Failed to fetch categories", error);
        }
      } else {
        // Clear categories when not authenticated
        setCategories([]);
      }
    };
    
    fetchCategories();
  }, [status]); // Re-fetch when authentication status changes

  // ✅ Clear categories on logout
  const handleSignOut = async () => {
    // Clear categories immediately
    setCategories([]);
    
    // Then sign out
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-900 text-white px-6 py-3 shadow-md fixed top-0 left-0 w-full flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          {status === "authenticated" && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:text-blue-400"
            >
              ☰
            </button>
          )}

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Image src="/logo.png" alt="Logo" width={35} height={35} />
            <span className="text-xl font-bold">Blogify</span>
          </Link>
        </div>

        {/* Center Nav */}
        <ul className="flex gap-6 items-center">
          <li>
            <Link href="/protected/home" className="hover:text-blue-400 transition">
              Home
            </Link>
          </li>

          {/* ✅ Dynamic Categories Dropdown - ONLY show when authenticated */}
          {status === "authenticated" && (
            <li className="relative group">
              <button className="hover:text-blue-400 transition flex items-center gap-1">
                Categories ▾
              </button>
              <ul className="absolute left-0 mt-2 bg-gray-800 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 w-40">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat._id}>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="block px-4 py-2 hover:bg-gray-700"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-400 text-sm">No Categories</li>
                )}
              </ul>
            </li>
          )}

          <li>
            <Link href="/about" className="hover:text-blue-400 transition">
              About
            </Link>
          </li>
        </ul>

        {/* Auth Buttons */}
        {status === "loading" ? null : status === "authenticated" ? (
          <button
            onClick={handleSignOut} // Use the updated function
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/signup"
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
          >
            Signup
          </Link>
        )}
      </nav>

      {/* Sidebar Overlay - ONLY show when authenticated */}
      {status === "authenticated" && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)}>
          <aside
            className={`fixed top-0 left-0 w-44 h-full bg-gray-800 text-white shadow-lg p-5 z-50 transform transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>

            {/* Sidebar Icons */}
            <ul className="space-y-3">
              <li>
                <Link href="/protected/home" className="flex items-center gap-2 hover:text-blue-400 group">
                  <HiHome size={22} />
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/protected/posts" className="flex items-center gap-2 hover:text-blue-400 group">
                  <HiDocumentText size={22} />
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                    My Posts
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/protected/new" className="flex items-center gap-2 hover:text-blue-400 group">
                  <HiPlusCircle size={22} />
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                    Create Post
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/protected/profile" className="flex items-center gap-2 hover:text-blue-400 group">
                  <HiUser size={22} />
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                    Profile
                  </span>
                </Link>
              </li>
              {userRole === "ADMIN" && (
                <li>
                  <Link href="/protected/admin" className="flex items-center gap-2 hover:text-blue-400 group">
                    <HiShieldCheck size={22} />
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                      Admin Panel
                    </span>
                  </Link>
                </li>
              )}
            </ul>

            <button
              onClick={() => setSidebarOpen(false)}
              className="mt-6 bg-red-500 hover:bg-red-600 px-3 py-1 rounded w-full"
            >
              Close
            </button>
          </aside>
        </div>
      )}
    </>
  );
}