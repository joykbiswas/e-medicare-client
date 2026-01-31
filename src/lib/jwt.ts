/**
 * Decode JWT token without verification (for client-side use only)
 * Note: This only decodes the payload, it does NOT verify the signature
 */
export function decodeJWT(token: string): any | null {
    try {
      // JWT format: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
  
      // Decode the payload (second part)
      const payload = parts[1];
      
      // Add padding if needed for base64 decoding
      const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
      
      // Decode base64
      const decoded = Buffer.from(paddedPayload, 'base64').toString('utf-8');
      
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }
  
  /**
   * Get token from cookies
   */
  export function getTokenFromCookies(cookieStore: any, tokenName: string = 'token'): string | null {
    try {
      const token = cookieStore.get(tokenName);
      return token?.value || null;
    } catch (error) {
      console.error('Error getting token from cookies:', error);
      return null;
    }
  }