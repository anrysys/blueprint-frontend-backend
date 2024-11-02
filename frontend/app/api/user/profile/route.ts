// src/app/api/user/profile/route.ts

'use server';

export async function GET(req: Request) {
  const url = process.env.NEXT_PUBLIC_API_USER_PROFILE_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_USER_PROFILE_URL is not defined');
  }
  const headers = req.headers;
  const token = headers.get('Authorization');
  if (!token) {
    throw new Error('Token is missing');
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(req: Request) {
  const url = process.env.NEXT_PUBLIC_API_USER_PROFILE_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_USER_PROFILE_URL is not defined');
  }
  const headers = req.headers;
  const token = headers.get('Authorization');
  if (!token) {
    throw new Error('Token is missing');
  }

  const body = await req.json();
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}