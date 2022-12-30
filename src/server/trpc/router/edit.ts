import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { Stage } from "../../../utils/consts";
import { protectedProcedure, router } from "../trpc";

export const editRouter = router({
  save: protectedProcedure
    .input(
      z.object({
        noteId: z.number(),
        title: z.string().max(127).optional(),
        desc: z.string().max(255).optional(),
        bodyHtml: z.string().max(32767).optional(),
        bodyJson: z.string().max(32767).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.note.findFirstOrThrow({
        where: { id: input.noteId, userId: ctx.session.user.id },
      });

      await ctx.prisma.note.update({
        where: { id: input.noteId },
        data: {
          title: input.title,
          desc: input.desc,
          bodyHtml: input.bodyHtml,
          bodyJson: input.bodyJson,
          docs: {
            updateMany: {
              where: { stage: Stage.Private },
              data: { stage: Stage.Public },
            },
          },
        },
      });
    }),
  publish: protectedProcedure
    .input(
      z.object({
        noteId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.note.findFirstOrThrow({
        where: {
          id: input.noteId,
          userId: ctx.session.user.id,
          stage: Stage.Private,
        },
      });

      await ctx.prisma.note.update({
        where: { id: input.noteId },
        data: { stage: Stage.Public, publishedAt: new Date().toISOString() },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        noteId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.findFirstOrThrow({
        where: { id: input.noteId, userId: ctx.session.user.id },
        select: {
          docs: true,
        },
      });

      const collection = input.noteId.toString();
      const pairs = note.docs.map((doc) => doc.path.split("/").slice(-2));

      await fetch(`${env.STORAGE_SERVER_URL}/delete/${collection}`, {
        method: "POST",
        body: JSON.stringify(pairs),
        headers: {
          "Content-Type": "application/json",
        },
      });

      await ctx.prisma.note.delete({
        where: { id: input.noteId },
      });
    }),
  detach: protectedProcedure
    .input(
      z.object({
        noteId: z.number(),
        paths: z.string().array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.note.findFirstOrThrow({
        where: { id: input.noteId, userId: ctx.session.user.id },
      });

      const pairs = input.paths.map((path) => path.split("/").slice(-2));

      const deleteResponse = await fetch(
        `${env.STORAGE_SERVER_URL}/delete/${input.noteId}`,
        {
          method: "POST",
          body: JSON.stringify(pairs),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!deleteResponse.ok) {
        throw new Error("Something went wrong...");
      }

      const deleteData = (await deleteResponse.json()) as number[];

      const deletedPairs = pairs.filter(
        (_, index) => !deleteData.includes(index)
      );

      const deletedPaths = deletedPairs.map(
        ([fileid, filename]) =>
          `/api/storage/download/${input.noteId}/${fileid}/${filename}`
      );

      await ctx.prisma.doc.deleteMany({
        where: { path: { in: deletedPaths } },
      });
    }),
  attach: protectedProcedure
    .input(
      z.object({
        noteId: z.number(),
        paths: z.string().array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.note.findFirstOrThrow({
        where: { id: input.noteId, userId: ctx.session.user.id },
      });

      await ctx.prisma.$transaction(
        input.paths.map((path) => {
          return ctx.prisma.doc.upsert({
            where: { path },
            create: { noteId: input.noteId, path, stage: Stage.Private },
            update: {},
          });
        })
      );
    }),
  info: protectedProcedure
    .input(
      z.object({
        noteId: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findFirstOrThrow({
        where: { id: input.noteId, userId: ctx.session.user.id },
        select: {
          bodyJson: true,
          docs: {
            select: {
              path: true,
              stage: true,
            },
          },
          stage: true,
        },
      });
    }),
});
