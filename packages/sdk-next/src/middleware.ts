import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function authMiddleware(req: NextRequest) {
    const token = req.cookies.get('access_token');

    if (!token && !req.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}
