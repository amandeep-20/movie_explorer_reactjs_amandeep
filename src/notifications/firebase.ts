import { initializeApp } from "firebase/app";
import { deleteToken, getMessaging, getToken, onMessage } from "firebase/messaging";
import { sendTokenToBackend } from "../utils/API";

const firebaseConfig = {
  apiKey: "AIzaSyCKt2wYuYzr0uKWe8o5jUE6p9wb-3lSK68",
  authDomain: "movie-explorer-5bc8a.firebaseapp.com",
  projectId: "movie-explorer-5bc8a",
  storageBucket: "movie-explorer-5bc8a.firebasestorage.app",
  messagingSenderId: "561268525206",
  appId: "1:561268525206:web:9ba893c094bf72aed81ab7",
  measurementId: "G-XPP4G1SXPV"

  // apiKey: "AIzaSyAU1fNyonSkzJdRmcwPLhOrBLCqGlmRpm8",
  // authDomain: "movie-explorer-acf7c.firebaseapp.com",
  // projectId: "movie-explorer-acf7c",
  // storageBucket: "movie-explorer-acf7c.firebasestorage.app",
  // messagingSenderId: "478584909632",
  // appId: "1:478584909632:web:64c604248d081920d114a5",
  // measurementId: "G-VHTF0G8C2K"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    // Check if permission is already granted
    if (Notification.permission === "granted") {
      const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";
      // const vapidKey = "BC-X5xRxSuqmP23YIvvnmFEeLlttSgvWm4J7yTUvutVlN7RHUra21Wu-mQf-bnzvgSsrYxo8hMwlY_nt-sZsaRg";

      const token = await getToken(messaging, { vapidKey });

      if (token) {
        console.log("Existing FCM Token:", token);
        // Optionally validate token format
        if (typeof token === "string" && token.length >= 50) {
          await sendTokenToBackend(token);
          return token;
        }
      }
    }

    // Request permission if not granted
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      if (permission !== "granted") {
        console.warn("Notification permission not granted:", permission);
        return null;
      }
    }

    // Generate new token
      // const vapidKey = "BC-X5xRxSuqmP23YIvvnmFEeLlttSgvWm4J7yTUvutVlN7RHUra21Wu-mQf-bnzvgSsrYxo8hMwlY_nt-sZsaRg";
      const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";
    const token = await getToken(messaging, { vapidKey });
    console.log("New FCM Token:", token);

    if (!token || typeof token !== "string" || token.length < 50) {
      console.warn("Generated token appears invalid");
      return null;
    }

    await sendTokenToBackend(token);
    console.log("Token sent to backend:", token);
    return token;
  } catch (error) {
    console.error("Error generating FCM token or sending to backend:", error);
    return null;
  }
};

export const monitorToken = async () => {
  try {
      // const vapidKey = "BC-X5xRxSuqmP23YIvvnmFEeLlttSgvWm4J7yTUvutVlN7RHUra21Wu-mQf-bnzvgSsrYxo8hMwlY_nt-sZsaRg";
      const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";
    const token = await getToken(messaging, { vapidKey }).catch(async (error) => {
      if (
        error.code === "messaging/token-unsubscribed" ||
        error.code === "messaging/invalid-token"
      ) {
        console.log("Token invalid or unsubscribed, generating new token");
        const newToken = await generateToken();
        return newToken;
      }
      throw error;
    });

    if (token) {
      if (typeof token !== "string" || token.length < 50) {
        console.warn("Monitored token appears invalid");
        return null;
      }
      console.log("Token validated:", token);
      await sendTokenToBackend(token);
    }
    return token;
  } catch (error) {
    console.error("Error monitoring FCM token:", error);
    return null;
  }
};

export { onMessage };