"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export const useRefreshRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If we are on the landing page, mark the session as active
    if (pathname === "/") {
      sessionStorage.setItem("appSessionActive", "true");
      return;
    }

    // Check if the session is active (meaning the user came from the landing page)
    const isSessionActive = sessionStorage.getItem("appSessionActive");

    // Check navigation type to detect a refresh
    let isRefresh = false;
    
    // Performance API check for modern browsers
    if (typeof performance !== "undefined" && performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const navTiming = navEntries[0] as PerformanceNavigationTiming;
        if (navTiming.type === "reload") {
          isRefresh = true;
        }
      }
    }

    // Redirect to landing page if:
    // 1. The page was refreshed (reload)
    // 2. OR The session is not active (direct URL access)
    if (isRefresh || !isSessionActive) {
      // Clear session flag just in case
      sessionStorage.removeItem("appSessionActive");
      // Redirect to home
      router.replace("/");
    }
  }, [pathname, router]);
};