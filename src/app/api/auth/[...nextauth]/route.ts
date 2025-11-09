import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@zzmedia.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "changeme";
        if (
          credentials?.email &&
          credentials?.password &&
          credentials.email.toLowerCase().trim() === adminEmail.toLowerCase().trim() &&
          credentials.password === adminPassword
        ) {
          return {
            id: "admin",
            name: "Admin User",
            email: adminEmail,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };


