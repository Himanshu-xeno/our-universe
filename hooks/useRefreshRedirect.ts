"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const SESSION_KEY = "universeSessionActive";
const TRANSITION_KEY = "universeTransitioning";

export const useRefreshRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const hasChecked = useRef(false);

  const initializeSession = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch (e) {
      console.warn("Session storage error:", e);
    }
  }, []);

  const markTransitioning = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(TRANSITION_KEY, "true");
      setTimeout(() => {
        sessionStorage.removeItem(TRANSITION_KEY);
      }, 3000);
    } catch (e) {
      console.warn("Session storage error:", e);
    }
  }, []);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    if (typeof window === "undefined") return;

    // Landing page - initialize session
    if (pathname === "/" || pathname === "/landing") {
      initializeSession();
      return;
    }

    // Check session and refresh
    try {
      const isSessionActive = sessionStorage.getItem(SESSION_KEY) === "true";
      const isTransitioning = sessionStorage.getItem(TRANSITION_KEY) === "true";

      // Check if page was refreshed
      let isRefresh = false;
      if (performance.getEntriesByType) {
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0) {
          const navTiming = navEntries[0] as PerformanceNavigationTiming;
          isRefresh = navTiming.type === "reload";
        }
      }

      // Allow if transitioning
      if (isTransitioning) {
        sessionStorage.removeItem(TRANSITION_KEY);
        return;
      }

      // Redirect if no session or refreshed
      if (!isSessionActive || isRefresh) {
        sessionStorage.removeItem(SESSION_KEY);
        router.replace("/");
      }
    } catch (e) {
      console.warn("Redirect check error:", e);
    }
  }, [pathname, router, initializeSession]);

  useEffect(() => {
    return () => {
      hasChecked.current = false;
    };
  }, [pathname]);

  return { initializeSession, markTransitioning };
};

export const useNavigateWithSession = () => {
  const router = useRouter();

  const navigateTo = useCallback((path: string) => {
    if (typeof window === "undefined") return;

    try {
      sessionStorage.setItem(TRANSITION_KEY, "true");
      setTimeout(() => {
        sessionStorage.removeItem(TRANSITION_KEY);
      }, 3000);
    } catch (e) {
      console.warn("Navigation error:", e);
    }

    router.push(path);
  }, [router]);

  return { navigateTo };
};