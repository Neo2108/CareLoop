import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const { PrismaClient } = await import("./app/generated/prisma/client");
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (
          user?.password &&
          bcrypt.compareSync(
            credentials.password as string,
            user.password
          )
        ) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        }
        return null;
      },
    }),
  ],
});
