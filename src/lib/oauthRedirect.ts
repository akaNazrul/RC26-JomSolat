export function isMobileUserAgent(userAgent: string | undefined): boolean {
  if (!userAgent) return false;
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone|Opera Mini|IEMobile/i.test(userAgent);
}

export function pickOAuthRedirect(origin: string, userAgent?: string): string {
  const isMobile = isMobileUserAgent(userAgent);
  return isMobile ? `${origin}/#/auth/callback` : `${origin}/auth/callback`;
}