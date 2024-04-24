const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyCBs8GJpTnOKOcFeVTp7lQ_d1KqwXh_V7Y",
  authDomain: "fatih-cloud-2c6f1.firebaseapp.com",
  projectId: "fatih-cloud-2c6f1",
  storageBucket: "fatih-cloud-2c6f1.appspot.com",
  messagingSenderId: "994673883855",
  appId: "1:994673883855:web:efccbd29885e95a798d5ba"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { app, storage };
