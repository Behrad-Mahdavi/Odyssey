/**
 * Securely overwrites a Uint8Array buffer with zeros to purge sensitive keys from memory.
 */
export function zeroize(buffer: Uint8Array): void {
  buffer.fill(0);
}

/**
 * Constant-time comparison between two strings or buffers to prevent timing side-channel attacks.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
