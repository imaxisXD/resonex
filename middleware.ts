import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isSignInPage = createRouteMatcher(["/signin"]);
const isProtectedRoute = createRouteMatcher([
  "/",
  "/dashboard",
  "/dashboard/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // If user is authenticated, redirect to dashboard
  // if (userId) {
  //   return Response.redirect(new URL("/dashboard", req.url));
  // }

  // Redirect authenticated users away from sign-in page
  if (isSignInPage(req) && userId) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req) && !userId) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
