'use server'
export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    if (!response.ok) {
      throw new Error('Failed to unsubscribe');
    }
    return new Response('Unsubscribed successfully', { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
