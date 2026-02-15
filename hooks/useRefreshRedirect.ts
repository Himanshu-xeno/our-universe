// // "use client";

// // import { useEffect } from "react";
// // import { useRouter, usePathname } from "next/navigation";

// // export const useRefreshRedirect = () => {
// //   const router = useRouter();
// //   const pathname = usePathname();

// //   useEffect(() => {
// //     // If we are on the landing page, mark the session as active
// //     if (pathname === "/") {
// //       sessionStorage.setItem("appSessionActive", "true");
// //       return;
// //     }

// //     // Check if the session is active (meaning the user came from the landing page)
// //     const isSessionActive = sessionStorage.getItem("appSessionActive");

// //     // Check navigation type to detect a refresh
// //     let isRefresh = false;
    
// //     // Performance API check for modern browsers
// //     if (typeof performance !== "undefined" && performance.getEntriesByType) {
// //       const navEntries = performance.getEntriesByType("navigation");
// //       if (navEntries.length > 0) {
// //         const navTiming = navEntries[0] as PerformanceNavigationTiming;
// //         if (navTiming.type === "reload") {
// //           isRefresh = true;
// //         }
// //       }
// //     }

// //     // Redirect to landing page if:
// //     // 1. The page was refreshed (reload)
// //     // 2. OR The session is not active (direct URL access)
// //     if (isRefresh || !isSessionActive) {
// //       // Clear session flag just in case
// //       sessionStorage.removeItem("appSessionActive");
// //       // Redirect to home
// //       router.replace("/");
// //     }
// //   }, [pathname, router]);
// // };

// "use client";

// import { useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";

// export const useRefreshRedirect = () => {
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     // 1. If we are on the Landing Page, set the session flag.
//     if (pathname === "/") {
//       sessionStorage.setItem("appSessionActive", "true");
//       return;
//     }

//     // 2. Check if the session flag exists.
//     const isSessionActive = sessionStorage.getItem("appSessionActive");

//     // 3. Check for performance navigation type (Refresh detection).
//     // Using performance.getEntriesByType is safer than deprecated performance.navigation
//     const navEntries = performance.getEntriesByType("navigation");
//     let isRefresh = false;
    
//     if (navEntries.length > 0) {
//       const navTiming = navEntries[0] as PerformanceNavigationTiming;
//       // "reload" means the user pressed F5 or Refresh button
//       if (navTiming.type === "reload") {
//         isRefresh = true;
//       }
//     }

//     // 4. Redirect Logic
//     // IF:
//     // - The session is NOT active (direct URL paste)
//     // - OR The user refreshed the page (F5)
//     if (!isSessionActive || isRefresh) {
//       console.log("[Redirect] Invalid session or refresh detected. Going home.");
      
//       // Clear flag to be safe
//       sessionStorage.removeItem("appSessionActive");
      
//       // Redirect
//       router.replace("/");
//     }
//   }, [pathname, router]);
// };


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