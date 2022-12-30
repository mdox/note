import { router } from "../trpc";
import { dashboardRouter } from "./dashboard";
import { editRouter } from "./edit";
import { viewRouter } from "./view";

export const appRouter = router({
  dashboard: dashboardRouter,
  edit: editRouter,
  view: viewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
