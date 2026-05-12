/**
 * Browser notification utilities for the IOS Life App
 */

/**
 * Request notification permission from the user
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Send a browser notification if permission is granted
 */
export const sendNotification = (title: string, body: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  }
};

/**
 * Check if notifications are supported and permission is granted
 */
export const canSendNotifications = (): boolean => {
  return 'Notification' in window && Notification.permission === 'granted';
};

/**
 * Send a notification only if it's relevant and not spammy
 */
export const sendRelevantNotification = (title: string, body: string, condition: boolean): void => {
  if (condition && canSendNotifications()) {
    sendNotification(title, body);
  }
};
