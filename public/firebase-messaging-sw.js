// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCHIX68-JJHkTEpPjFHoQCJO9jxD01_5XU",
  authDomain: "movieexplorer-57075.firebaseapp.com",
  projectId: "movieexplorer-57075",
  storageBucket: "movieexplorer-57075.firebasestorage.app",
  messagingSenderId: "972960795720",
  appId: "1:972960795720:web:a125cffdb37e3c420e1c7d"
};

try {
  // Access modular Firebase SDK
  const { initializeApp } = firebase.app;
  const { getMessaging, onBackgroundMessage } = firebase.messaging;

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  // Handle background messages
  onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);
    const notificationTitle = payload.notification?.title || 'Notification';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new message.',
      icon: payload.notification?.image || '/favicon.ico',
      data: payload.data || {}
    };

    // Show notification
    return self.registration.showNotification(notificationTitle, notificationOptions);
  });

  console.log('[firebase-messaging-sw.js] Service worker initialized successfully');
} catch (error) {
  console.error('[firebase-messaging-sw.js] Error in service worker:', error);
}

// Optional: Handle notification click events
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});