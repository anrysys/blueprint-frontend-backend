export async function subscribe() {
  console.log('Attempting to subscribe to notifications...');
  try {
    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker ready:', registration);

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      throw new Error('VAPID public key is not defined');
    }
    const applicationServerKey = urlB64ToUint8Array(vapidPublicKey);
    console.log('Application Server Key:', applicationServerKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    console.log('Subscription obtained:', subscription);
    console.log('Subscription JSON:', JSON.stringify(subscription));
    const subscriptionJson = subscription.toJSON();
    console.log('Subscription keys:', subscriptionJson.keys);
    if (subscriptionJson.keys) {
      console.log('p256dh key length:', Buffer.byteLength(subscriptionJson.keys.p256dh, 'base64'));
    } else {
      console.warn('Subscription keys are undefined');
    }

    // Save subscription to localStorage to prevent duplicate subscriptions
    localStorage.setItem('subscription', JSON.stringify(subscription));

    // Send subscription to the server
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Subscribed successfully:', subscription);
  } catch (error) {
    console.error('Error during subscription:', error);
  }
}

function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
