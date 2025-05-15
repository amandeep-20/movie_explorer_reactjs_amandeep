importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const firebaseConfig = {
  // apiKey: "AIzaSyCKt2wYuYzr0uKWe8o5jUE6p9wb-3lSK68",
  // authDomain: "movie-explorer-5bc8a.firebaseapp.com",
  // projectId: "movie-explorer-5bc8a",
  // storageBucket: "movie-explorer-5bc8a.firebasestorage.app",
  // messagingSenderId: "561268525206",
  // appId: "1:561268525206:web:9ba893c094bf72aed81ab7",
  // measurementId: "G-XPP4G1SXPV"
  
   apiKey: "AIzaSyCHIX68-JJHkTEpPjFHoQCJO9jxD01_5XU",
  authDomain: "movieexplorer-57075.firebaseapp.com",
  projectId: "movieexplorer-57075",
  storageBucket: "movieexplorer-57075.firebasestorage.app",
  messagingSenderId: "972960795720",
  appId: "1:972960795720:web:a125cffdb37e3c420e1c7d"
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