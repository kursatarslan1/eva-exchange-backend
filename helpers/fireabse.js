const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyDUdw_ZXqsgoH3A9d5FfQ7h-UI-Klqc-ew",
  authDomain: "steyon-cloud.firebaseapp.com",
  projectId: "steyon-cloud",
  storageBucket: "steyon-cloud.appspot.com",
  messagingSenderId: "44346110382",
  appId: "1:44346110382:web:d7c3c96a2ed3df4d26583f",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { app, storage };
