export async function subscribe() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });
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

// Вызов функции подписки при загрузке страницы
window.addEventListener('load', () => {
  subscribe();
});
