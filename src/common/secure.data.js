import { symmetricEncryption, hashingUtils } from "./encryption.utils.js";

// ===================== SECURE DATA STORAGE UTILITIES =====================

export const secureDataUtils = {
  // Encrypt sensitive user data before storing
  encryptUserData: (userData) => {
    const sensitiveFields = {
      email: userData.email,
      phone: userData.phone,
    };

    if (Object.values(sensitiveFields).some((val) => val)) {
      const encrypted = symmetricEncryption.encrypt(sensitiveFields);
      return {
        ...userData,
        // store encrypted data as a simple string
        encryptedData: encrypted,
      };
    }

    return userData;
  },

  // Decrypt user data when retrieving
  decryptUserData: (userData) => {
    if (userData.encryptedData) {
      try {
        const decrypted = symmetricEncryption.decrypt(userData.encryptedData);
        return {
          ...userData,
          email: decrypted.email || userData.email,
          phone: decrypted.phone || userData.phone,
          encryptedData: undefined, // remove the encrypted string
        };
      } catch (error) {
        console.error("Failed to decrypt user data:", error.message);
      }
    }

    return userData;
  },

  // Generate data fingerprint for integrity check
  generateFingerprint: (data) => {
    return hashingUtils.sha256(data);
  },

  // Verify data hasn't been tampered with
  verifyFingerprint: (data, fingerprint) => {
    return secureDataUtils.generateFingerprint(data) === fingerprint;
  },
};
