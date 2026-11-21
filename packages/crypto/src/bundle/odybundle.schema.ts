import { z } from "zod";

export const OdybundleV1Schema = z.object({
  format: z.literal("odyssey-bundle"),
  bundleVersion: z.literal(1),
  schemaVersion: z.number().int().positive(),
  exportedAt: z.number().int().positive(),
  kdf: z.object({
    algorithm: z.literal("argon2id"),
    memoryKiB: z.number().min(65536),
    iterations: z.number().min(3),
    parallelism: z.literal(1),
    saltBase64: z.string().min(1),
  }),
  cipher: z.object({
    algorithm: z.literal("AES-256-GCM"),
    ivBase64: z.string().min(1),
    aad: z.literal("odyssey:v1:bundle"),
  }),
  ciphertextBase64: z.string().min(1),
  bundleChecksumSha256: z.string().length(64),
});

export type OdybundleV1 = z.infer<typeof OdybundleV1Schema>;
