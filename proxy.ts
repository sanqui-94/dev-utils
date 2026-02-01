import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from "@/lib/supabase/proxy"
 
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  await updateSession(request);
  return NextResponse.redirect(new URL('/home', request.url));
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: '/about/:path*',
}
