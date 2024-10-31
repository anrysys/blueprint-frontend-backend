// src/app/api/auth/refresh/route.ts
'use server'

export async function POST(req: Request) {
    const url = process.env.NEXT_PUBLIC_API_AUTH_REFRESH_URL;
  
    if (!url) {
      throw new Error('NEXT_PUBLIC_API_AUTH_REFRESH_URL is not defined');
    }
  
    const body = await req.json();
    //const { refreshToken } = body;


    console.log('\n\n\n--------POST /auth/refresh - Body:', JSON.stringify  (body));
  
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify  (body),
        // body: JSON.stringify({
        //   refreshToken,
        // }),        
      });
  
      const data = await res.json();

      console.log('\n\n\n--------Tokens generated (auth/refresh):', JSON.stringify(data));
  
      if (!res.ok) {
        throw new Error(data.message);
      }
  
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error during token refresh:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }