export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  publicKeyPem: string;
  privateKeyPem: string;
}

export async function generateKeyPair(): Promise<KeyPair> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  const publicKeyPem = await exportKeyToPem(keyPair.publicKey, "PUBLIC");
  const privateKeyPem = await exportKeyToPem(keyPair.privateKey, "PRIVATE");

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    publicKeyPem,
    privateKeyPem,
  };
}

async function exportKeyToPem(
  key: CryptoKey,
  type: "PUBLIC" | "PRIVATE",
): Promise<string> {
  const exported = await window.crypto.subtle.exportKey(
    type === "PUBLIC" ? "spki" : "pkcs8",
    key,
  );
  const base64 = arrayBufferToBase64(exported);
  const formatted = base64.match(/.{1,64}/g)?.join("\n") || base64;
  return `-----BEGIN ${type} KEY-----\n${formatted}\n-----END ${type} KEY-----`;
}

export async function encryptMessage(
  message: string,
  publicKey: CryptoKey,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    data,
  );

  return arrayBufferToBase64(encrypted);
}

export async function decryptMessage(
  encryptedBase64: string,
  privateKey: CryptoKey,
): Promise<string> {
  const encrypted = base64ToArrayBuffer(encryptedBase64);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encrypted,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
