export async function generateKeys() {
  const keys = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 1024, // Can be 1024, 2048, 4096
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
      hash: "SHA-256",
    },
    true, // extractable
    ["encrypt", "decrypt", "wrapKey", "unwrapKey"] // key usages
  );
  // console.log(keys.privateKey);
  return keys;
}

export async function generateSigningKeyPair(){
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5", // Algorithm for signing
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    true, // extractable
    ["sign", "verify"] // key usages
  );
  // console.log(keyPair);
  return keyPair;
}

export async function exportKeyToJWK(key) {
  return await crypto.subtle.exportKey("jwk", key);
}