/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from '@/lib/firebase';
import { env } from '@/env';
import { api } from '@/trpc/react';

const useFcmToken = () => {
    const [token, setToken] = useState('');
    // const [notificationPermissionStatus, setNotificationPermissionStatus] =
    //     useState('');

    const subscribeToTopic = api.user.subscribeToTopic.useMutation();

    useEffect(() => {
        const retrieveToken = async () => {
            try {
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                    const messaging = getMessaging(firebaseApp);

                    // Retrieve the notification permission status
                    const permission = await Notification.requestPermission();
                    // setNotificationPermissionStatus(permission);

                    // Check if permission is granted before retrieving the token
                    if (permission === 'granted') {
                        const currentToken = await getToken(messaging, {
                            vapidKey:
                                env.NEXT_PUBLIC_VAPID_KEY,
                        });
                        if (currentToken) {
                            setToken(currentToken);
                            subscribeToTopic.mutate({ token: currentToken });
                        } else {
                            console.log(
                                'No registration token available. Request permission to generate one.'
                            );
                        }
                    }
                }
            } catch (error) {
                console.log('An error occurred while retrieving token:', error);
            }
        };

        void retrieveToken();
    }, []);

    return { fcmToken: token };
};

export default useFcmToken;