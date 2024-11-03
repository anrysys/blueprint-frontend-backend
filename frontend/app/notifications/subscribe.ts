export async function subscribe() {
  try {
    console.log('Attempting to subscribe to notifications...');
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permission not granted for Notification');
    }
    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker ready:', registration);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });
    console.log('Subscription obtained:', subscription);
    console.log('Subscription JSON:', JSON.stringify(subscription));
    const subscriptionKeys = {
      p256dh: subscription.getKey('p256dh'),
      auth: subscription.getKey('auth'),
    };
    console.log('Subscription keys:', subscriptionKeys);
    if (!subscriptionKeys.p256dh || !subscriptionKeys.auth) {
      throw new Error('Subscription keys are missing or invalid');
    }
    const p256dhKey = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(subscriptionKeys.p256dh))));
    const authKey = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(subscriptionKeys.auth))));
    console.log('p256dh key length:', p256dhKey.length);
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: p256dhKey,
          auth: authKey,
        },
      }),
    });
    console.log('Subscribed successfully:', subscription);
  } catch (error) {
    console.error('Failed to subscribe', error);
  }
}
