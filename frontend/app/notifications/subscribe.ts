export async function subscribe() {
  try {
    console.log('Attempting to subscribe to notifications...');
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permission not granted for Notification');
    }

    const existingSubscription = localStorage.getItem('subscription');
    if (existingSubscription) {
      console.log('User is already subscribed:', JSON.parse(existingSubscription));
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker ready:', registration);
    const applicationServerKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!applicationServerKey) {
      throw new Error('VAPID public key is missing');
    }
    console.log('Application Server Key:', applicationServerKey);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
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

    // Save subscription to localStorage
    localStorage.setItem('subscription', JSON.stringify(subscription));

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

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
