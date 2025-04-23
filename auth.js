import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    // Toggle Password Visibility
    const togglePassword = document.querySelectorAll('.toggle-password');
    togglePassword.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    // Form Validation
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Sign in with email and password
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Check if email is verified
                if (!user.emailVerified) {
                    alert('Please verify your email before logging in. Check your inbox for the verification link.');
                    await auth.signOut();
                    return;
                }

                console.log('Login successful:', user);
                alert('Login successful! Welcome back!');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Login error:', error);
                alert(error.message);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const age = document.getElementById('age').value;
            const gender = document.getElementById('gender').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validate age
            if (age < 13 || age > 120) {
                alert('Age must be between 13 and 120 years.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            try {
                // Create user with email and password
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Send email verification
                await sendEmailVerification(user);

                // Store additional user data in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    fullName: fullname,
                    email: email,
                    age: parseInt(age),
                    gender: gender,
                    createdAt: new Date().toISOString(),
                    emailVerified: false
                });

                console.log('Signup successful:', user);
                alert('Account created successfully! Please check your email to verify your account before logging in.');
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Signup error:', error);
                alert(error.message);
            }
        });
    }

    // Social Login Handlers
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', async function() {
            if (this.classList.contains('google')) {
                try {
                    const provider = new GoogleAuthProvider();
                    const result = await signInWithPopup(auth, provider);
                    const user = result.user;

                    // Store Google user data in Firestore
                    await setDoc(doc(db, "users", user.uid), {
                        fullName: user.displayName,
                        email: user.email,
                        createdAt: new Date().toISOString(),
                        emailVerified: true, // Google accounts are pre-verified
                        // Note: Age and gender are not available from Google sign-in
                        // You might want to prompt the user to provide this information later
                    }, { merge: true });

                    console.log('Google sign-in successful:', user);
                    alert('Login successful! Welcome back!');
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('Google sign-in error:', error);
                    alert(error.message);
                }
            } else {
                alert('Facebook authentication coming soon!');
            }
        });
    });
});