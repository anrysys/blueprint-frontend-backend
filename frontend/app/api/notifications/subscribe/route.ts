'use server'
export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
    }
    const response = await fetch(`${backendUrl}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to subscribe:', errorText);
      throw new Error('Failed to subscribe');
    }
    return new Response('Subscribed successfully', { status: 200 });
  } catch (error) {
    console.error('Error in subscribe route:', error);
    return new Response((error as Error).message, { status: 500 });
  }
}
