import { sendResponse, sendError } from "../../common/response.handler.js";
import {
  symmetricEncryption,
  cryptoJsEncryption,
  asymmetricEncryption,
  hashingUtils,
} from "../../common/encryption.utils.js";

// ===================== ENCRYPTION TEST ENDPOINTS =====================

// Symmetric Encryption Test
export const testSymmetricEncryption = async (req, res, next) => {
  try {
    const { data } = req.body;

    if (!data) {
      return sendError(res, 400, "Data is required");
    }

    const encrypted = symmetricEncryption.encrypt(data);
    const decrypted = symmetricEncryption.decrypt(encrypted);

    return sendResponse(res, 200, "Symmetric encryption test successful", {
      original: data,
      // encrypted string (shortened for readability)
      encrypted: typeof encrypted === "string" ? encrypted.substring(0, 80) + "..." : encrypted,
      decrypted,
      isMatch: JSON.stringify(data) === JSON.stringify(decrypted),
    });
  } catch (error) {
    next(error);
  }
};

// CryptoJS Encryption Test
export const testCryptoJsEncryption = async (req, res, next) => {
  try {
    const { data, password } = req.body;

    if (!data || !password) {
      return sendError(res, 400, "Data and password are required");
    }

    const encrypted = cryptoJsEncryption.encrypt(data, password);
    const decrypted = cryptoJsEncryption.decrypt(encrypted, password);

    return sendResponse(res, 200, "CryptoJS encryption test successful", {
      original: data,
      encrypted,
      decrypted,
      isMatch: JSON.stringify(data) === JSON.stringify(decrypted),
    });
  } catch (error) {
    next(error);
  }
};

// SHA-256 Hashing Test
export const testSHA256 = async (req, res, next) => {
  try {
    const { data } = req.body;

    if (!data) {
      return sendError(res, 400, "Data is required");
    }

    const hash = hashingUtils.sha256(data);

    return sendResponse(res, 200, "SHA-256 hashing test successful", {
      original: data,
      hash,
      hashLength: hash.length,
    });
  } catch (error) {
    next(error);
  }
};

// SHA-512 Hashing Test
export const testSHA512 = async (req, res, next) => {
  try {
    const { data } = req.body;

    if (!data) {
      return sendError(res, 400, "Data is required");
    }

    const hash = hashingUtils.sha512(data);

    return sendResponse(res, 200, "SHA-512 hashing test successful", {
      original: data,
      hash,
      hashLength: hash.length,
    });
  } catch (error) {
    next(error);
  }
};

// HMAC Test
export const testHMAC = async (req, res, next) => {
  try {
    const { data, secret } = req.body;

    if (!data || !secret) {
      return sendError(res, 400, "Data and secret are required");
    }

    const hmac = hashingUtils.generateHMAC(data, secret);
    const isValid = hashingUtils.verifyHMAC(data, secret, hmac);

    return sendResponse(res, 200, "HMAC test successful", {
      original: data,
      secret,
      hmac,
      isValid,
    });
  } catch (error) {
    next(error);
  }
};

// RSA Asymmetric Encryption Test
export const testAsymmetricEncryption = async (req, res, next) => {
  try {
    const { data } = req.body;

    if (!data) {
      return sendError(res, 400, "Data is required");
    }

    // Generate RSA key pair
    const keyPair = asymmetricEncryption.generateKeyPair();

    // Encrypt with public key
    const encrypted = asymmetricEncryption.encrypt(keyPair.publicKey, data);

    // Decrypt with private key
    const decrypted = asymmetricEncryption.decrypt(keyPair.privateKey, encrypted);

    return sendResponse(res, 200, "RSA encryption test successful", {
      original: data,
      encrypted: encrypted.substring(0, 50) + "...", // Shortened for readability
      decrypted,
      isMatch: JSON.stringify(data) === JSON.stringify(decrypted),
    });
  } catch (error) {
    next(error);
  }
};

// RSA Signature Test
export const testRSASignature = async (req, res, next) => {
  try {
    const { data } = req.body;

    if (!data) {
      return sendError(res, 400, "Data is required");
    }

    // Generate RSA key pair
    const keyPair = asymmetricEncryption.generateKeyPair();

    // Sign data
    const signature = asymmetricEncryption.sign(keyPair.privateKey, data);

    // Verify signature
    const isValid = asymmetricEncryption.verify(keyPair.publicKey, data, signature);

    return sendResponse(res, 200, "RSA signature test successful", {
      original: data,
      signature: signature.substring(0, 50) + "...", // Shortened for readability
      isValid,
    });
  } catch (error) {
    next(error);
  }
};

// Random Hash Generation Test
export const testRandomHash = async (req, res, next) => {
  try {
    const hash1 = hashingUtils.generateRandomHash();
    const hash2 = hashingUtils.generateRandomHash();

    return sendResponse(res, 200, "Random hash generation successful", {
      hash1,
      hash2,
      areUnique: hash1 !== hash2,
    });
  } catch (error) {
    next(error);
  }
};
