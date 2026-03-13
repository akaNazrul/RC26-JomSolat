import { describe, it, expect } from 'vitest';
import { isMobileUserAgent, pickOAuthRedirect } from '@/lib/oauthRedirect';

describe('oauthRedirect util', () => {
  it('detects mobile user agents', () => {
    expect(isMobileUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3) AppleWebKit')).toBe(true);
    expect(isMobileUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit')).toBe(false);
    expect(isMobileUserAgent(undefined)).toBe(false);
  });

  it('picks hash redirect for mobile and path redirect for desktop', () => {
    const origin = 'https://example.com';
    expect(pickOAuthRedirect(origin, 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3)')).toBe(
      'https://example.com/#/auth/callback'
    );
    expect(pickOAuthRedirect(origin, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe(
      'https://example.com/auth/callback'
    );
    // no UA defaults to desktop
    expect(pickOAuthRedirect(origin)).toBe('https://example.com/auth/callback');
  });
});
