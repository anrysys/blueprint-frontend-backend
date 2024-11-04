import { toast } from 'react-toastify';
import { subscribe } from '../app/notifications/subscribe';

let notificationDenied = false;

export const registerServiceWorker = async (token: string) => {
  if ('serviceWorker' in navigator) {
    console.log('Registering Service Worker...');
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered with scope:', registration.scope);

      const existingSubscription = await registration.pushManager.getSubscription();
      if (!existingSubscription) {
        const localSubscription = localStorage.getItem('subscription');
        const notificationPreference = localStorage.getItem('notificationPushApiDenied');

        if (notificationPreference === 'true') {
          console.log('User has previously denied notifications.');
          return;
        }

        if (!localSubscription) {
          console.log('No existing subscription found. Subscribing...');
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            await subscribe(token);
          } else {
            console.error('Permission for notifications was denied');
            if (!notificationDenied) {
              toast.error('You can always enable a subscription to current news in your profile.');
              notificationDenied = true;
              localStorage.setItem('notificationPushApiDenied', 'true');
            }
          }
        } else {
          console.log('User is already subscribed (localStorage):', JSON.parse(localSubscription));
        }
      } else {
        console.log('User is already subscribed:', existingSubscription);
      }
    } catch (error) {
      console.error('Error during subscription check:', error);
      toast.error('An error occurred during subscription. Please try again.');
    }
  } else {
    console.error('Service Worker not supported in this browser.');
    toast.error('Service Worker not supported in this browser.');
  }
};

export const enablePushNotifications = async (token: string) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await subscribe(token);
      localStorage.setItem('notificationPushApiDenied', 'false');

      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to notifications');
      }

      toast.success('Push notifications enabled successfully.');
    } else {
      console.error('Permission for notifications was denied');
      toast.error('Permission for notifications was denied.');
    }
  } catch (error) {
    console.error('Error enabling push notifications:', error);
    toast.error('An error occurred while enabling push notifications. Please try again.');
  }
};
