import Cookies from 'js-cookie';

export async function unsubscribe() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      const token = Cookies.get('access_token');
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
      });
    }
  } catch (error) {
    console.error('Failed to unsubscribe', error);
  }
}
