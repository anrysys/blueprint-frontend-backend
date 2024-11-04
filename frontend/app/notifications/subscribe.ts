export const subscribe = async (token: string) => {
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

    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe to notifications');
    }

    localStorage.setItem('subscription', JSON.stringify(subscription));
  } catch (error) {
    console.error('Error during subscription:', error);
    throw error;
  }
};

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
