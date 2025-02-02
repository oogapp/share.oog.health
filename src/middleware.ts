import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.ico$).*)'],
}
