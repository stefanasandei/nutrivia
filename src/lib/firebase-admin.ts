import admin from 'firebase-admin';
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { env } from "@/env";

export const getFirebaseAdmin = () => {
    if (!getApps().length) {
        initializeApp({
            projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT,
            credential: cert({
                projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT,
                privateKey: env.FIREBASE_PRIVATE_KEY,
                clientEmail: env.FIREBASE_PRIVATE_EMAIL
            })
        });
    }

    return admin.app();
}