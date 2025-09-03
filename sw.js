// sw.js - Service Worker for Rest Reminder

const ACTIONS = {
  SNOOZE: 'snooze',
  SKIP: 'skip',
  CLICK: 'click'
};
const SYNC_TAG = 'reminder-check';

// Event handler for when the periodic sync fires
self.addEventListener('periodicsync', (event) => {
  if (event.tag === SYNC_TAG) {
    // waitUntil() ensures the SW doesn't terminate before the async task is done
    event.waitUntil(checkAndShowNotification());
  }
});

async function checkAndShowNotification() {
  console.log('[SW] Periodic Sync triggered. Checking for reminder...');
  // We need to store state in IndexedDB because localStorage is not available in SW
  const state = await getStateFromDB();
  
  if (state && state.enabled) {
    console.log('[SW] Reminders are enabled. Showing notification.');
    const title = 'Time to rest/stretch! 💪';
    const body = 'Stand up, loosen your shoulders, look 20 feet away for 20 seconds.';
    
    self.registration.showNotification(title, {
      body,
      icon: 'https://www.google.com/s2/favicons?domain=example.com&sz=128',
      tag: 'rest-reminder-notification',
      actions: [
        { action: ACTIONS.SNOOZE, title: 'Snooze (Not yet implemented in BG)' },
        { action: ACTIONS.SKIP, title: 'Dismiss' },
      ]
    });
  } else {
    console.log('[SW] Reminders are disabled or state not found. Skipping notification.');
  }
}

// Handler for when a user clicks a notification or its action buttons
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const action = event.action || ACTIONS.CLICK;
  
  // This part focuses the existing app window or opens a new one.
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        // A simple check to find the right window
        if (client.url.includes('index.html') && 'focus' in client) {
          client.postMessage({ type: 'NOTIFICATION_ACTION', action: action });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});

// A simple key-value store using IndexedDB because SW can't access localStorage
const DB_NAME = 'RestReminderDB';
const STORE_NAME = 'stateStore';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = self.indexedDB.open(DB_NAME, 1);
    request.onerror = (event) => reject('DB error: ' + event.target.errorCode);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
  });
}

async function getStateFromDB() {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('appState');
    request.onsuccess = () => resolve(request.result ? request.result.value : null);
    request.onerror = () => resolve(null); // Resolve null on error
  });
}