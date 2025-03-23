/** @format */

import CryptoJS from "crypto-js";

const SECRET_KEY = "MySuperSecretKey123"; // Must be 16, 24, or 32 characters

export function encryptToken(token) {
	return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
}

export function decryptToken(encryptedToken) {
	try {
		const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
		return bytes.toString(CryptoJS.enc.Utf8);
	} catch (error) {
		console.error("Error decrypting token:", error);
		return null;
	}
}
