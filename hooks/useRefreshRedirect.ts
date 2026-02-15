"use client";

import { useCallback } from "react";

export const useRefreshRedirect = () => {
  const initializeSession = useCallback(() => {}, []);
  const markTransitioning = useCallback(() => {}, []);
  return { initializeSession, markTransitioning };
};

export const useNavigateWithSession = () => {
  const navigateTo = useCallback((_path: string) => {}, []);
  return { navigateTo };
};