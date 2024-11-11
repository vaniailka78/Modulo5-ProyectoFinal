import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');
    const path = request.nextUrl.searchParams.get('path');

    if (secret !== process.env.REVALIDATION_TOKEN) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (!path) {
        return NextResponse.json({ message: 'Path is required' }, { status: 400 });
    }

    try {
        revalidatePath(path);
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (error) {
        console.error('Error revalidating:', error);
        return NextResponse.json({ message: 'Error revalidating', error: (error as Error).message }, { status: 500 });
    }
}