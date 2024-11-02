'use server'

export async function POST(req: Request) {
    const url = process.env.NEXT_PUBLIC_API_AUTH_REGISTER_URL; 

    if (!url) {
        throw new Error('NEXT_PUBLIC_API_AUTH_REGISTER_URL is not defined');
    }

    const body = await req.json();
    const { username, email, password } = body;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    });

    const data = await res.json();

    // If the response is not successful, throw an error
    if (data.status == 'fail') {
        throw new Error(data.message);
    }

    // Return the response
    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
    });
}