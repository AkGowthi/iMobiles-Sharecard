import { NextResponse } from "next/server";

// Pure edge placeholder to force cache invalidation of stale Vercel deployment matchers
export default function middleware() {
    return NextResponse.next();
}

// Pointing exclusively to a dummy non-existent path ensures zero runtime execution penalty
export const config = {
    matcher: ['/vercel-static-edge-cache-invalidation-route-only'],
};
