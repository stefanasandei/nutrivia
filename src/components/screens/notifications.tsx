"use client";

import React, { useEffect } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import firebaseApp from "@/lib/firebase";
import useFcmToken from "@/hooks/use-fcm-token";

export default function Notifications() {
  const { fcmToken } = useFcmToken();
  fcmToken && console.log("FCM token:", fcmToken);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        new Notification(payload.notification?.title ?? "", {
          body: payload.notification?.body,
        });
      });
      return () => {
        unsubscribe();
      };
    }
  }, []);

  return <div />;
}
