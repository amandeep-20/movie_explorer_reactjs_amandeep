import { initializeApp } from "firebase/app";
import { deleteToken, getMessaging, getToken, onMessage } from "firebase/messaging";
import { sendTokenToBackend } from "../utils/API";

const firebaseConfig = {
  apiKey: "AIzaSyCHIX68-JJHkTEpPjFHoQCJO9jxD01_5XU",
  authDomain: "movieexplorer-57075.firebaseapp.com",
  projectId: "movieexplorer-57075",
  storageBucket: "movieexplorer-57075.firebasestorage.app",
  messagingSenderId: "972960795720",
  appId: "1:972960795720:web:a125cffdb37e3c420e1c7d"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    if (Notification.permission === "granted") {
      // const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";
      const vapidKey = "BBbMH-bPmaNatLYbh_FIRM4KJr9fpulK_dAUgK73FCOpOErYrf0QN-W-G3GxOzZ2jT6v8O5keE3CsXDA1Nj_sH8";

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

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      if (permission !== "granted") {
        console.warn("Notification permission not granted:", permission);
        return null;
      }
    }


      const vapidKey = "BBbMH-bPmaNatLYbh_FIRM4KJr9fpulK_dAUgK73FCOpOErYrf0QN-W-G3GxOzZ2jT6v8O5keE3CsXDA1Nj_sH8";
      // const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";
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
      const vapidKey = "BBbMH-bPmaNatLYbh_FIRM4KJr9fpulK_dAUgK73FCOpOErYrf0QN-W-G3GxOzZ2jT6v8O5keE3CsXDA1Nj_sH8";
      // const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";
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