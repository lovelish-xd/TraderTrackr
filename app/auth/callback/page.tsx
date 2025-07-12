"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      try {
        // Delay slightly to ensure session is ready
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        // Try refreshing if session not immediately available
        if (!session) {
          const {
            data: { session: refreshedSession },
            error: refreshError,
          } = await supabase.auth.refreshSession();

          if (refreshError || !refreshedSession) {
            console.error("Session refresh error:", refreshError);
            setError("Authentication failed. Please try again.");
            setTimeout(() => router.replace("/login"), 3000);
            return;
          }

          session = refreshedSession;
        }

        if (!session?.user) {
          console.error("No session found after refresh.");
          setError("No session found. Redirecting to login...");
          setTimeout(() => router.replace("/login"), 3000);
          return;
        }

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Profile check error:", profileError);
          setError("Error checking profile. Please try again.");
          setTimeout(() => router.replace("/login"), 3000);
          return;
        }

        if (profile && profile.country) {
          router.replace("/dashboard");
        } else {
          router.replace("/complete-profile");
        }
      } catch (error) {
        console.error("Unexpected auth callback error:", error);
        setError("An unexpected error occurred. Please try again.");
        setTimeout(() => router.replace("/login"), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    checkSessionAndRedirect();
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-red-500 text-center">
          <p className="font-semibold">Authentication Error</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-8 w-8 text-[#185E61]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="#185E61"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="#185E61"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <span className="mt-4 text-[#185E61] font-semibold">
          Signing you in...
        </span>
      </div>
    </div>
  );
}
