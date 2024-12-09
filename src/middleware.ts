import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const bearerToken = request.cookies.get("token")?.value;
    if(bearerToken) {
        console.log("Bearer token found in cookies: ", bearerToken);
    } else {
        console.log("Bearer token not found in cookies");
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.ico$).*)'],
}
