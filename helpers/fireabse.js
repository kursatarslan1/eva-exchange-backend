const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyB0UQcvjr_-VeiE3iY0IIawLVmtLFKk5Uc",
  authDomain: "evcil-dostum-cloud.firebaseapp.com",
  projectId: "evcil-dostum-cloud",
  storageBucket: "evcil-dostum-cloud.appspot.com",
  messagingSenderId: "832205741621",
  appId: "1:832205741621:web:d569f93accbdfa6d7c5b7c"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { app, storage };
