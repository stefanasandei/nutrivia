/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line no-undef
// @ts-expect-error it works
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js");
// eslint-disable-next-line no-undef
// @ts-expect-error it works
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js");

// this can be public, it's fine
// https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public
const firebaseConfig = {
  apiKey: "AIzaSyBW9ed9sh5wFwBruoQFseXbhDWvFZWG76U",
  authDomain: "nutrivia-43597.firebaseapp.com",
  projectId: "nutrivia-43597",
  storageBucket: "nutrivia-43597.appspot.com",
  messagingSenderId: "829558898487",
  appId: "1:829558898487:web:48cf060cce33c5e95ae4b2",
  measurementId: "G-4KJVEV2XVD",
};
// eslint-disable-next-line no-undef
// @ts-expect-error it works
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
// @ts-expect-error it works
const messaging = firebase.messaging();

// @ts-expect-error it works
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./icons/android-chrome-192x192.png",
  };
  // @ts-expect-error it works
  self.registration.showNotification(notificationTitle, notificationOptions);
});
