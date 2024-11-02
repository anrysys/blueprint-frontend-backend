'use server'
export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    const response = await fetch(`${process.env.BACKEND_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    if (!response.ok) {
      throw new Error('Failed to subscribe');
    }
    return new Response('Subscribed successfully', { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
