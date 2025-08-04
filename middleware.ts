import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isSignInPage = createRouteMatcher(["/sign-in"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/dashboard"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId, redirectToSignIn } = await auth();

    if (isSignInPage(req) && userId) {
      return Response.redirect(new URL("/dashboard", req.url));
    }

    if (isProtectedRoute(req) && !userId) {
      return redirectToSignIn();
    }
  } catch (error) {
    console.error("Authentication error in middleware:", error);
    if (isProtectedRoute(req)) {
      return Response.redirect(new URL("/sign-in", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
