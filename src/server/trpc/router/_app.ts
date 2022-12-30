import { router } from "../trpc";
import { dashboardRouter } from "./dashboard";
import { editRouter } from "./edit";

export const appRouter = router({
  dashboard: dashboardRouter,
  edit: editRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
