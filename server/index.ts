import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const t = initTRPC.create();

export const appRouter = t.router({
    getNotifications: t.procedure.query(async () => {
        return prisma.notification.findMany({orderBy: {createdAt: 'desc'}});
    }),

    createNotification: t.procedure
        .input(
            z.object({
                type: z.string(),
                message: z.string(),
                person: z.string().optional(),
                release: z.string().optional(),
            })
        )
        .mutation(async ({ input }) => {
            const newNotification = await prisma.notification.create({
                data: {
                    type: input.type,
                    message: input.message,
                    person: input.person,
                    release: input.release,
                },
            });

            return newNotification;
        }),
    markAsRead: t.procedure
        .input(z.string())
        .mutation(async ({ input }) => {
            const updatedNotification = await prisma.notification.update({
                where: { id: input },
                data: { read: true },
            });
            return updatedNotification;
        }),
});

export type AppRouter = typeof appRouter;
