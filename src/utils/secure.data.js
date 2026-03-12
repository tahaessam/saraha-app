import { symmetricEncryption, hashingUtils } from "./encryption.utils.js";

// ===================== SECURE DATA STORAGE =====================

export const secureDataUtils = {
  // Encrypt sensitive data
  encryptData: (data) => {
    try {
      return symmetricEncryption.encrypt(data);
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  },

  // Decrypt sensitive data
  decryptData: (encrypted) => {
    try {
      return symmetricEncryption.decrypt(encrypted);
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  },

  // Generate fingerprint for verification
  generateFingerprint: (data) => {
    return hashingUtils.sha256(data);
  },

  // Verify fingerprint
  verifyFingerprint: (data, fingerprint) => {
    return secureDataUtils.generateFingerprint(data) === fingerprint;
  },
};
