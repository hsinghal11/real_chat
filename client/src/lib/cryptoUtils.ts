// client/src/lib/cryptoUtils.ts
// This file will contain functions for key generation, encryption, decryption, signing, and verification.

/**
 * Generates an RSA public and private key pair for encryption/decryption and signing.
 * @returns A Promise that resolves to an object containing the public and private keys.
 */
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  // Generate an RSA key pair for encryption/decryption and signing
  // You might choose different algorithms and key sizes based on your security needs.
  // RSA-OAEP for encryption is standard, and RSASSA-PKCS1-v1_5 for signing.
  return await crypto.subtle
    .generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048, // Can be 4096 for stronger security
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: "SHA-256",
      },
      true, // extractable
      ["encrypt", "decrypt", "wrapKey", "unwrapKey"] // Key usages for encryption
    )
    .then(async (keyPair: CryptoKeyPair) => {
      // Also generate a separate key pair for signing for clarity, though RSA-OAEP can be used for both.
      // For simplicity, let's assume one key pair for both for now, or you can generate two separate pairs.
      // If using one key pair for both, ensure 'sign' and 'verify' are also in usages.
      const signingKeyPair = await crypto.subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: "SHA-256",
        },
        true,
        ["sign", "verify"]
      );
      return {
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        signingPublicKey: signingKeyPair.publicKey,
        signingPrivateKey: signingKeyPair.privateKey,
      };
    });
}

/**
 * Exports a CryptoKey to PEM format.
 * @param key The CryptoKey to export.
 * @returns A Promise that resolves to the PEM-encoded key string.
 */
export async function exportKeyToPem(
  key: CryptoKey,
  type: "public" | "private"
): Promise<string> {
  const exported = await crypto.subtle.exportKey(
    type === "public" ? "spki" : "pkcs8", // SPKI for public, PKCS8 for private
    key
  );
  const buffer = new Uint8Array(exported);
  const base64 = btoa(String.fromCharCode(...buffer));
  const pemHeader =
    type === "public"
      ? "-----BEGIN PUBLIC KEY-----"
      : "-----BEGIN PRIVATE KEY-----";
  const pemFooter =
    type === "public"
      ? "-----END PUBLIC KEY-----"
      : "-----END PRIVATE KEY-----";
  return `${pemHeader}\n${base64.match(/.{1,64}/g)!.join("\n")}\n${pemFooter}`;
}

/**
 * Imports a PEM-encoded key string into a CryptoKey object.
 * @param pem The PEM-encoded key string.
 * @param type 'public' or 'private' to indicate key type.
 * @param usages Array of key usages (e.g., ['encrypt'], ['decrypt'], ['sign'], ['verify']).
 * @returns A Promise that resolves to the CryptoKey object.
 */
export async function importKeyFromPem(
  pem: string,
  type: "public" | "private",
  usages: KeyUsage[]
): Promise<CryptoKey> {
  const base64 = pem
    .replace(/(-----(BEGIN|END) (PUBLIC|PRIVATE) KEY-----|\n)/g, "")
    .trim();
  const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  return await crypto.subtle.importKey(
    type === "public" ? "spki" : "pkcs8",
    buffer,
    type === "public"
      ? { name: "RSA-OAEP", hash: "SHA-256" }
      : { name: "RSA-OAEP", hash: "SHA-256" }, // Adjust algorithm based on key generation
    true, // extractable
    usages
  );
}

/**
 * Encrypts a message using a recipient's public key.
 * @param publicKey The recipient's public CryptoKey.
 * @param message The message string to encrypt.
 * @returns A Promise that resolves to the encrypted message (Base64 encoded string).
 */
export async function encryptMessage(
  publicKey: CryptoKey,
  message: string
): Promise<string> {
  const encoded = new TextEncoder().encode(message);
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    encoded
  );
  return btoa(String.fromCharCode(...new Uint8Array(encrypted))); // Base64 encode
}

/**
 * Decrypts an encrypted message using the user's private key.
 * @param privateKey The user's private CryptoKey.
 * @param encryptedMessage The Base64 encoded encrypted message.
 * @returns A Promise that resolves to the decrypted message string.
 */
export async function decryptMessage(
  privateKey: CryptoKey,
  encryptedMessage: string
): Promise<string> {
  const buffer = Uint8Array.from(atob(encryptedMessage), (c) =>
    c.charCodeAt(0)
  );
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    buffer
  );
  return new TextDecoder().decode(decrypted);
}

/**
 * Signs a message using the sender's private key.
 * @param privateKey The sender's private CryptoKey for signing.
 * @param message The message string to sign.
 * @returns A Promise that resolves to the digital signature (Base64 encoded string).
 */
export async function signMessage(
  privateKey: CryptoKey,
  message: string
): Promise<string> {
  const encoded = new TextEncoder().encode(message);
  const signature = await crypto.subtle.sign(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    privateKey,
    encoded
  );
  return btoa(String.fromCharCode(...new Uint8Array(signature))); // Base64 encode
}

/**
 * Verifies a message's signature using the sender's public key.
 * @param publicKey The sender's public CryptoKey for verification.
 * @param signature The Base64 encoded digital signature.
 * @param message The original message string that was signed.
 * @returns A Promise that resolves to a boolean indicating signature validity.
 */
export async function verifySignature(
  publicKey: CryptoKey,
  signature: string,
  message: string
): Promise<boolean> {
  const encodedMessage = new TextEncoder().encode(message);
  const bufferSignature = Uint8Array.from(atob(signature), (c) =>
    c.charCodeAt(0)
  );

  return await crypto.subtle.verify(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    publicKey,
    bufferSignature,
    encodedMessage
  );
}
