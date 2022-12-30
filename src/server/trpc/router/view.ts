import { z } from "zod";
import { Stage } from "../../../utils/consts";
import sanitizeHtml from "../../../utils/sanitizeHtml";
import { protectedProcedure, router } from "../trpc";

export const viewRouter = router({
  deleteComment: protectedProcedure
    .input(
      z.object({
        commentId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.comment.findFirstOrThrow({
        where: {
          id: input.commentId,
          userId: ctx.session.user.id,
          note: { stage: Stage.Public },
        },
      });

      await ctx.prisma.comment.delete({
        where: { id: input.commentId },
      });
    }),
  comments: protectedProcedure
    .input(
      z.object({
        noteId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: { noteId: input.noteId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          userId: true,
          user: { select: { name: true } },
          bodyHtml: true,
          createdAt: true,
        },
      });

      const results = comments.map((comment) => {
        const result = {
          id: comment.id,
          username: comment.user.name ?? "Unknown",
          bodyHtml: comment.bodyHtml,
          isOwner: comment.userId === ctx.session.user.id,
          createdAt: comment.createdAt,
        };

        return result;
      });

      return results;
    }),
  sendComment: protectedProcedure
    .input(
      z.object({
        noteId: z.number(),
        bodyHtml: z.string().max(8192),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.comment.create({
        data: {
          noteId: input.noteId,
          userId: ctx.session.user.id,
          bodyHtml: sanitizeHtml(input.bodyHtml),
          createdAt: new Date().toISOString(),
        },
      });
    }),
  info: protectedProcedure
    .input(z.object({ noteId: z.number() }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.findFirstOrThrow({
        where: { id: input.noteId, stage: Stage.Public },
        select: {
          userId: true,
          bodyHtml: true,
          docs: {
            where: { stage: Stage.Public },
            select: {
              path: true,
            },
          },
          stage: true,
          publishedAt: true,
        },
      });

      const result = {
        bodyHtml: note.bodyHtml,
        docs: note.docs,
        stage: note.stage,
        publishedAt: note.publishedAt,
        isOwner: note.userId === ctx.session.user.id,
      };

      return result;
    }),
});
