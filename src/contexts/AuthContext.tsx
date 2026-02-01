"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { decodeJWT } from "@/lib/jwt";
import type { UserInfo } from "@/services/user.services";

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  isAuthenticated: boolean;
  resetAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const lastTokenRef = useRef<string | null>(null);

  const resetAuth = () => {
    console.log("Resetting auth state...");
    lastTokenRef.current = null;
    setUser(null);
    setLoading(false);
  };

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

    // Listen for custom auth change event
    const handleAuthChange = () => {
      console.log("Custom auth change event received");
      lastTokenRef.current = null; // Force re-check
      checkAuth();
    };

    // ✅ React to login/logout only
    window.addEventListener("storage", checkAuth);
    window.addEventListener("focus", checkAuth);
    window.addEventListener("auth:change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
      window.removeEventListener("auth:change", handleAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        resetAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
