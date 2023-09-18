// environment.prod.ts
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: '${FIREBASE_API_KEY}',
    authDomain: 'shopping-list-444aa.firebaseapp.com',
    databaseURL: 'https://shopping-list-444aa-default-rtdb.firebaseio.com',
    projectId: 'shopping-list-444aa',
    storageBucket: 'shopping-list-444aa.appspot.com',
    messagingSenderId: '872809261047',
    appId: '1:872809261047:web:4ec9a9066cd46bde5870f2',
  },
};
