export async function subscribe() {
  try {
    console.log('Attempting to subscribe to notifications...');
    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker ready:', registration);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });
    console.log('Subscription obtained:', subscription);
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    console.log('Subscribed successfully:', subscription);
  } catch (error) {
    console.error('Failed to subscribe', error);
  }
}
