import { protectedProcedure, router } from "../trpc";

export const authRouter = router({
  validate: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
    });
  }),
});
