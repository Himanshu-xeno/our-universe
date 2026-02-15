"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export const useRefreshRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Prevent running twice in React StrictMode
    if (hasChecked.current) return;
    hasChecked.current = true;

    // 1. Landing page sets the session flag
    if (pathname === "/") {
      sessionStorage.setItem("appSessionActive", "true");
      return;
    }

    // 2. Check if session is active
    const isSessionActive = sessionStorage.getItem("appSessionActive");

    // 3. Check navigation type for refresh detection
    let isRefresh = false;

    try {
      if (typeof performance !== "undefined" && performance.getEntriesByType) {
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0) {
          const navTiming = navEntries[0] as PerformanceNavigationTiming;
          isRefresh = navTiming.type === "reload";
        }
      }
    } catch (error) {
      console.warn("[useRefreshRedirect] Performance API error:", error);
    }

    // 4. Redirect if:
    //    - Session is NOT active (direct URL access)
    //    - OR user refreshed the page
    if (!isSessionActive || isRefresh) {
      console.log("[Redirect] Invalid access detected:", {
        pathname,
        isSessionActive: !!isSessionActive,
        isRefresh,
      });

      // Clear session flag
      sessionStorage.removeItem("appSessionActive");

      // Redirect to home
      router.replace("/");
    }
  }, [pathname, router]);

  // Reset check flag when pathname changes (for future navigations)
  useEffect(() => {
    return () => {
      hasChecked.current = false;
    };
  }, [pathname]);
};