/**
 * UUIDv7 implementation for time-ordered entity primary keys.
 * RFC 9562 compliant, lexicographically sortable by creation time.
 */

export function generateUUIDv7(timestampMs: number = Date.now()): string {
  const bytes = new Uint8Array(16);

  // 48-bit timestamp in milliseconds
  bytes[0] = (timestampMs / 0x10000000000) & 0xff;
  bytes[1] = (timestampMs / 0x100000000) & 0xff;
  bytes[2] = (timestampMs / 0x1000000) & 0xff;
  bytes[3] = (timestampMs / 0x10000) & 0xff;
  bytes[4] = (timestampMs / 0x100) & 0xff;
  bytes[5] = timestampMs & 0xff;

  // 16-bit version & rand_a
  crypto.getRandomValues(bytes.subarray(6));
  const b6 = bytes[6] ?? 0;
  bytes[6] = (b6 & 0x0f) | 0x70; // version 7
  const b8 = bytes[8] ?? 0;
  bytes[8] = (b8 & 0x3f) | 0x80; // variant 1 (RFC 4122)

  return formatUuid(bytes);
}

function formatUuid(buf: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < 16; i++) {
    const b = buf[i] ?? 0;
    if (i === 4 || i === 6 || i === 8 || i === 10) {
      hex += "-";
    }
    hex += b < 16 ? `0${b.toString(16)}` : b.toString(16);
  }
  return hex;
}

export function isValidUUIDv7(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}
