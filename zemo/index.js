import { exportKeyToJWK, generateKeys, generateSigningKeyPair } from "./Keys.js"

const keysPair = await generateKeys()
const signKeysPair = generateSigningKeyPair()
// console.log(keysPair);

console.log(await exportKeyToJWK(keysPair.publicKey));
