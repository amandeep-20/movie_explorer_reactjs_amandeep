importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging.js');

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

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.getMessaging(app);

firebase.onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});