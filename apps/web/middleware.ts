import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // TODO: Re-enable admin auth check once login flow is implemented
    // For now, allow all routes through
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
