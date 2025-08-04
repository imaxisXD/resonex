import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isSignInPage = createRouteMatcher(["/sign-in"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/dashboard"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  // If user is signed in and trying to access sign-in page, redirect to dashboard
  if (isSignInPage(req) && userId) {
    console.log("Redirecting authenticated user from sign-in to dashboard");
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // If accessing protected route without authentication, redirect to sign-in
  if (isProtectedRoute(req) && !userId) {
    console.log("Redirecting unauthenticated user to sign-in");
    return redirectToSignIn();
  }

  console.log("Allowing request to proceed");
  // Allow all other routes to proceed
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
