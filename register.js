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

// Event listener for form submission
document.getElementById('registerForm').addEventListener("submit", registerUser);

// Register user function
function registerUser(e) {
    e.preventDefault();
    
    // Show loading overlay
    document.getElementById("loadingOverlay").style.display = 'flex';

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value; 

    if (!name || !email || !password || !email.endsWith('@gmail.com')) {
        document.getElementById("message").textContent = "All fields are required and email must be a Gmail address!";
        document.getElementById("loadingOverlay").style.display = 'none'; // Hide loading overlay
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid;
            return saveUserData(userId, name, email, password);
        })
        .then(() => {
            document.getElementById("message").textContent = "Registration successful!";
            document.getElementById("registerForm").reset();
            window.location.href = "login.html";
        })
        .catch(error => {
            console.error("Error during registration: ", error);
            document.getElementById("message").textContent = "Error: " + error.message;
        })
        .finally(() => {
            document.getElementById("loadingOverlay").style.display = 'none'; // Hide loading overlay
        });
}

function saveUserData(userId, name, email, password) {
    return db.collection("users").doc(userId).set({
        name: name,
        email: email,
        password: password // Storing the password (not recommended)
    })
    .then(() => {
        console.log("User data saved successfully!");
    })
    .catch(error => {
        console.error("Error saving user data: ", error);
    });
}

// Toggle password visibility
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});
