"use client";

import { useState, useEffect, useRef } from "react";
import { decodeJWT } from "@/lib/jwt";
import type { UserInfo } from "@/services/user.services";

export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const lastTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        let token: string | null = null;

        // 1️⃣ Get token from localStorage
        token = localStorage.getItem("token");

        // 2️⃣ Fallback to cookies
        if (!token) {
          const tokenCookie = document.cookie
            .split(";")
            .find(c => c.trim().startsWith("token="));
          token = tokenCookie?.split("=")[1] ?? null;
          console.log("Token not found");
        }

        // 🔒 No token
        if (!token) {
          lastTokenRef.current = null;
          setUser(null);
          setLoading(false);
          return;
        }

        // 🛑 Token unchanged → DO NOTHING
        if (token === lastTokenRef.current) {
          setLoading(false);
          return;
        }

        lastTokenRef.current = token;

        const decoded = decodeJWT(token);
        if (!decoded) {
          setUser(null);
          setLoading(false);
          return;
        }

        const userInfo: UserInfo = {
          id: decoded.userId || decoded.id || "",
          userId: decoded.userId || decoded.id || "",
          email: decoded.email || "",
          name: decoded.name || "",
          role: decoded.role || "CUSTOMER",
        };

        setUser(userInfo);
        setLoading(false);
      } catch (err) {
        console.error("Auth error:", err);
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();

    // ✅ React to login/logout only
    window.addEventListener("storage", checkAuth);
    window.addEventListener("focus", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
