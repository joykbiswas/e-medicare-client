import { cookies } from "next/headers";
import { decodeJWT, getTokenFromCookies } from "@/lib/jwt";

export interface UserInfo {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  [key: string]: any; // For any additional fields
}

export const userService = {
  /**
   * Get user info from JWT token in cookies
   */
  getUserFromToken: async function (): Promise<{ data: UserInfo | null; error: string | null }> {
    try {
      const cookieStore = await cookies();
      
      // Get token from cookie (backend uses "token" as cookie name)
      const token = getTokenFromCookies(cookieStore, 'token');

      if (!token) {
        return { data: null, error: "Token not found in cookies" };
      }

      // Decode the JWT token
      const decoded = decodeJWT(token);

      if (!decoded) {
        return { data: null, error: "Invalid token format" };
      }

      // Extract user info from decoded token
      // Backend JWT payload: { userId, name, email, role }
      const userInfo: UserInfo = {
        id: decoded.userId || decoded.id || '',
        userId: decoded.userId || decoded.id || '',
        email: decoded.email || '',
        name: decoded.name || '',
        role: decoded.role || 'CUSTOMER',
        ...decoded, // Include any other fields from the token
      };

      return { data: userInfo, error: null };
    } catch (err) {
      console.error('Error getting user from token:', err);
      return { data: null, error: "Something Went Wrong" };
    }
  },

  /**
   * Legacy method - kept for backward compatibility
   */
  getSession: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${process.env.AUTH_URL || 'http://localhost:5000'}/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const session = await res.json();

      if (session === null) {
        return { data: null, error: { message: "Session is missing." } };
      }

      return { data: session, error: null };
    } catch (err) {
      console.error(err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};