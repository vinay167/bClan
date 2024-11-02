// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Add event listener for the form submission
const forgotForm = document.getElementById("forgotForm");
forgotForm.addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent the default form submission behavior
    const email = document.getElementById("email").value;  // Get the email from the input field

    // Send the password reset email
    sendPasswordResetEmail(auth, email)
        .then(() => {
            // Notify the user that the email has been sent
            document.getElementById("message").textContent = "Password reset email sent! Please check your inbox.";
            document.getElementById("email").value = "";  // Clear the email input
        })
        .catch((error) => {
            // Handle errors here
            const errorMessage = error.message;
            document.getElementById("message").textContent = errorMessage;  // Display the error message to the user
        });
});
