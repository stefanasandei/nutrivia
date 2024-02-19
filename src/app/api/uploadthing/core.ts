import { getServerAuthSession } from "@/server/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "8MB" } })
        .middleware(async () => {
            const session = await getServerAuthSession();

            if (!session) throw new UploadThingError("Unauthorized");

            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId, fileURL: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
