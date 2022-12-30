import { signIn } from "next-auth/react";
import { trpc } from "../../utils/trpc";

export default function AuthGuard() {
  trpc.auth.validate.useQuery(undefined, {
    retry: false,
    onError: () => signIn(),
  });

  return null;
}
