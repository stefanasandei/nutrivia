import { db } from '@/server/db';
import { api } from '@/trpc/server'
import { NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

// this api endpoint will be hit by a cron job
// randomly selects 10% of users and sends them a notification
export async function GET(_request: Request) {
    const usersCount = await db.user.count();
    const skip = Math.floor(Math.random() * usersCount);
    const take = Math.ceil(0.1 * usersCount);

    const users = await db.user.findMany({
        take: take,
        skip: skip
    });

    for (const user of users) {
        await api.user.sendNotification.mutate({
            title: `Hello, ${user.name}!`,
            body: "Check out the new posts in our forum!",
            userId: user.id
        });
    }

    return NextResponse.json({}, { status: 200 });
}
