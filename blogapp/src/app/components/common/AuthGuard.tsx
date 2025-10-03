"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect in useEffect to avoid triggering side effects during render
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin"); // replace avoids going back to protected page
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null; // Do not render protected content while redirecting
  }

  return <>{children}</>;
}
