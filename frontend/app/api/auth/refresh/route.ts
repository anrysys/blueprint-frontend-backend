// app/api/auth/refresh/route.ts
'use server'

export async function POST(req: Request) {
    const url = process.env.NEXT_PUBLIC_API_AUTH_REFRESH_URL;

    if (!url) {
        throw new Error('NEXT_PUBLIC_API_AUTH_REFRESH_URL is not defined');
    }

    const body = await req.json();
    const { refreshToken } = body;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refreshToken,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message);
    }

    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
    });
}