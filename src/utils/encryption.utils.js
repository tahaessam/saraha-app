import crypto from "crypto";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-encryption-key-change-in-env";

// ===================== SYMMETRIC ENCRYPTION =====================
export const symmetricEncryption = {
  encrypt: (data, password = ENCRYPTION_KEY) => {
    try {
      const payload = JSON.stringify(data);
      return CryptoJS.AES.encrypt(payload, password).toString();
    } catch (error) {
      throw new Error(`Encryption error: ${error.message}`);
    }
  },

  decrypt: (encryptedString, password = ENCRYPTION_KEY) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedString, password);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error(`Decryption error: ${error.message}`);
    }
  },
};

// ===================== HASHING UTILITIES =====================
export const hashingUtils = {
  sha256: (data) => {
    try {
      return crypto
        .createHash("sha256")
        .update(typeof data === "string" ? data : JSON.stringify(data))
        .digest("hex");
    } catch (error) {
      throw new Error(`SHA-256 error: ${error.message}`);
    }
  },

  sha512: (data) => {
    try {
      return crypto
        .createHash("sha512")
        .update(typeof data === "string" ? data : JSON.stringify(data))
        .digest("hex");
    } catch (error) {
      throw new Error(`SHA-512 error: ${error.message}`);
    }
  },

  generateRandomHash: () => {
    try {
      return crypto.randomBytes(32).toString("hex");
    } catch (error) {
      throw new Error(`Random hash error: ${error.message}`);
    }
  },

  generateHMAC: (data, secret) => {
    try {
      return crypto
        .createHmac("sha256", secret)
        .update(typeof data === "string" ? data : JSON.stringify(data))
        .digest("hex");
    } catch (error) {
      throw new Error(`HMAC error: ${error.message}`);
    }
  },

  verifyHMAC: (data, secret, hash) => {
    try {
      const generated = crypto
        .createHmac("sha256", secret)
        .update(typeof data === "string" ? data : JSON.stringify(data))
        .digest("hex");
      return generated === hash;
    } catch (error) {
      throw new Error(`HMAC verify error: ${error.message}`);
    }
  },
};

// ===================== ASYMMETRIC ENCRYPTION =====================
export const asymmetricEncryption = {
  generateKeyPair: () => {
    try {
      const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });
      return { publicKey, privateKey };
    } catch (error) {
      throw new Error(`Key generation error: ${error.message}`);
    }
  },

  encrypt: (publicKey, data) => {
    try {
      const encrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(JSON.stringify(data))
      );
      return encrypted.toString("base64");
    } catch (error) {
      throw new Error(`RSA encryption error: ${error.message}`);
    }
  },

  decrypt: (privateKey, encryptedData) => {
    try {
      const decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(encryptedData, "base64")
      );
      return JSON.parse(decrypted.toString());
    } catch (error) {
      throw new Error(`RSA decryption error: ${error.message}`);
    }
  },

  sign: (privateKey, data) => {
    try {
      const sign = crypto.createSign("sha256");
      sign.update(JSON.stringify(data));
      return sign.sign(privateKey, "base64");
    } catch (error) {
      throw new Error(`Signing error: ${error.message}`);
    }
  },

  verify: (publicKey, data, signature) => {
    try {
      const verify = crypto.createVerify("sha256");
      verify.update(JSON.stringify(data));
      return verify.verify(publicKey, signature, "base64");
    } catch (error) {
      throw new Error(`Signature verify error: ${error.message}`);
    }
  },
};
