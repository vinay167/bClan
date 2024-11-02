// Firebase configuration and initialization
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
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();


document.getElementById("loginForm").addEventListener("submit", loginUser);

function loginUser(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("message").textContent = "Login successful!";
            // Redirect to main.html after successful login
            window.location.href = "main.html";
        })
        .catch(error => {
            document.getElementById("message").textContent = "Error: " + error.message;
        });
}

// Toggle password visibility
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

