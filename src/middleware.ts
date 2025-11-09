import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: [
    // Protect all app pages except API routes and public assets.
    // Exclude ALL `/api/**` so API requests don't get redirected to HTML,
    // which breaks server-side fetch JSON parsing.
    "/((?!api|signin|_next/static|_next/image|favicon.ico|logo.png).*)",
  ],
};


