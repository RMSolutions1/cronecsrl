import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto"

function getEncryptionKey(): Buffer {
  const secret =
    process.env.SESSION_SECRET?.trim() ||
    process.env.EMAIL_ENCRYPTION_KEY?.trim() ||
    "cronec-session-secret-min-32-chars-long"
  return scryptSync(secret, "cronec-email-smtp-v1", 32)
}

/** Cifra un secreto (p. ej. contraseña SMTP) para guardarlo en BD. */
export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString("base64")
}

/** Descifra un secreto guardado en BD. */
export function decryptSecret(ciphertext: string): string {
  const buf = Buffer.from(ciphertext, "base64")
  if (buf.length < 29) throw new Error("Secreto cifrado inválido")
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const encrypted = buf.subarray(28)
  const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8")
}
