import { useState, useEffect } from 'react';

const useIndexedDB = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  useEffect(() => {
    const openDB = () => {
      return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('myDatabase', 1);

        request.onerror = () => {
          console.log('IndexedDB error:', request.error);
          reject(request.error);
        };

        request.onsuccess = () => {
          const db = request.result;

          const transaction = db.transaction('userStore', 'readonly');
          const objectStore = transaction.objectStore('userStore');
          const getRequest = objectStore.get(1);

          getRequest.onsuccess = () => {
            const userData = getRequest.result;
            if (userData) {
              setUserEmail(userData.email);
              setUserPassword(userData.password);
            }

            resolve();
          };

          transaction.oncomplete = () => {
            db.close();
          };
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;

          if (!db.objectStoreNames.contains('userStore')) {
            const objectStore = db.createObjectStore('userStore', { keyPath: 'id' });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('password', 'password');
          }
        };
      });
    };

    openDB()
      .then(() => {
        console.log('IndexedDB connection successful');
      })
      .catch((error) => {
        console.error('IndexedDB connection error:', error);
      });
  }, []);

  return { userEmail, userPassword };
};

export default useIndexedDB;