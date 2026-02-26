// app/auth-callback/page.tsx (Domain B)
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useUser();
  const [status, setStatus] = useState("Verifying authentication securely...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("No token provided. Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    const authenticateWithToken = async () => {
      try {
        // Send the token to Domain B's backend to secretly verify it and set cookies
        const response = await fetch("/api/verify-dashboard-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          const {
            userId,
            userEmail,
            userName,
            userApiKey,
            token: verifiedToken,
          } = result.data ?? {};

          // ✅ Save to global context (which also persists to localStorage)
          setUser({
            userId: userId ?? null,
            userEmail: userEmail ?? null,
            userName: userName ?? null,
            userApiKey: userApiKey ?? null,
            token: verifiedToken || token,
          });

          setStatus(
            "Authentication successful! Taking you to the dashboard...",
          );
          router.push("/"); // The final secure destination
        } else {
          setStatus(
            `Authentication failed: ${result.error ?? "Unknown error"}`,
          );
          setTimeout(() => router.push("/login"), 3000);
        }
      } catch {
        setStatus("A network error occurred. Please try again.");
      }
    };

    authenticateWithToken();
  }, [searchParams, router, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 text-center bg-white shadow-xl rounded-xl">
        <h1 className="text-xl font-semibold text-gray-800">{status}</h1>
      </div>
    </div>
  );
}
