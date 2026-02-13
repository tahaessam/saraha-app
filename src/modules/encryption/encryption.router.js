import { Router } from "express";
import * as ec from "./encryption.controller.js";

const encryptionRouter = Router();

// Encryption & Hashing Test Routes
encryptionRouter.post("/test/symmetric-encryption", ec.testSymmetricEncryption);
encryptionRouter.post("/test/cryptojs-encryption", ec.testCryptoJsEncryption);
encryptionRouter.post("/test/sha256", ec.testSHA256);
encryptionRouter.post("/test/sha512", ec.testSHA512);
encryptionRouter.post("/test/hmac", ec.testHMAC);
encryptionRouter.post("/test/rsa-encryption", ec.testAsymmetricEncryption);
encryptionRouter.post("/test/rsa-signature", ec.testRSASignature);
encryptionRouter.post("/test/random-hash", ec.testRandomHash);

export default encryptionRouter;
