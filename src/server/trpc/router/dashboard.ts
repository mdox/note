import { Stage } from "../../../utils/consts";
import { protectedProcedure, router } from "../trpc";

export const dashboardRouter = router({
  makeNote: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.note
      .findFirst({
        where: { userId: ctx.session.user.id, stage: Stage.Private },
        select: { id: true },
      })
      .then((note) => {
        return (
          note ||
          ctx.prisma.note.create({
            data: {
              userId: ctx.session.user.id,
              stage: Stage.Private,
            },
            select: { id: true },
          })
        );
      });
  }),
  getNoteList: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: { stage: Stage.Public },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        user: { select: { name: true } },
        title: true,
        desc: true,
        docs: {
          take: 1,
          where: { stage: Stage.Public },
          select: { path: true },
        },
        comments: { take: 1, select: { id: true } },
        publishedAt: true,
      },
    });
  }),
});
