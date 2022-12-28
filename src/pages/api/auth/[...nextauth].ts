import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.sub ?? user.id;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    process.env.NODE_ENV === "development" &&
      Credentials({
        credentials: { email: { label: "Email" } },
        authorize: async (credentials) => {
          const { email } = credentials ?? {};
          return await prisma.user.findUnique({ where: { email } });
        },
      }),
  ].filter(Boolean) as Provider[],
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
