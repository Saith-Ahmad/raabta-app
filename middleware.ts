// import { authMiddleware } from "@clerk/nextjs"

// export default authMiddleware({
//     publicRoutes: ["/","/api/webhook/clerk"],
  
//     ignoredRoutes: ["/api/webhook/clerk"],
//   });

// export const config = {
//     matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
//   };

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define the public routes
const isPublicRoute = createRouteMatcher(['/','/api/webhook/clerk', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes except the ones defined as public
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
