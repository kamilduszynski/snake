// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCorIYe1Fpp3_B6vwfoJyx-SG6pOglRSKw",
    authDomain: "snake-620c5.firebaseapp.com",
    databaseURL:
        "https://snake-620c5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "snake-620c5",
    storageBucket: "snake-620c5.firebasestorage.app",
    messagingSenderId: "540489494180",
    appId: "1:540489494180:web:480fe9e53180b422fa4031",
    measurementId: "G-M7B0M051DV",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
