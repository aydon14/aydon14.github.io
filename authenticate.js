// --- Profanity checker imports ---
import { BAD_WORDS, isProfane } from './badwords.js';

// --- Splash Screen Code ---
const splash = document.getElementById('splash');
const splashLogo = document.getElementById('splash-logo');
const authContainer = document.getElementById('auth-container');

function startSplash() {
    if (!splash) return;
    splash.classList.add('ready');
    const delayMs = 2000;
    setTimeout(() => {
        splash.classList.add('done');
        splash.addEventListener('transitionend', () => {
            authContainer?.classList.add('visible');
            splash.remove();
        }, { once: true });
    }, delayMs);
}

if (splashLogo) {
    if (splashLogo.complete) {
        requestAnimationFrame(startSplash);
    } else {
        splashLogo.addEventListener('load', () => requestAnimationFrame(startSplash), { once: true });
    }
    setTimeout(() => {
        if (splash && !splash.classList.contains('ready')) startSplash();
    }, 200);
}

// --- Firebase Authentication and Firestore Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const signupButton = document.querySelector('.signup');
    const loginButton = document.querySelector('.login');

    function showAuthError(error) {
        const code = error?.code;
        let msg = 'Something went wrong. Please try again.';
        switch (code) {
            case 'auth/email-already-in-use':
                msg = 'That username is already taken.';
                break;
            case 'auth/invalid-email':
                msg = 'Please enter a valid username.';
                break;
            case 'auth/weak-password':
                msg = 'Password must be at least 6 characters.';
                break;
            case 'auth/user-not-found':
                msg = 'No account found for that username.';
                break;
            case 'auth/wrong-password':
            case 'auth/invalid-login-credentials':
                msg = 'Incorrect password.';
                break;
            case 'auth/too-many-requests':
                msg = 'Too many attempts. Please wait and try again.';
                break;
            case 'auth/network-request-failed':
                msg = 'Network error. Check your connection.';
                break;
            case 'auth/operation-not-allowed':
                msg = 'Email/password sign-in is not enabled.';
                break;
            default:
                break;
        }
        alert(msg);
    }

    // Sign Up Function
    signupButton.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || password.length < 6) {
        alert('Please enter a username and a password of at least 6 characters.');
        return;
    }

    if (isProfane(username)) {
        alert('Usernames may NOT contain profanity.');
        return;
    }

    const email = `${username}@actfc.com`;
    let createdUser = null;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            createdUser = userCredential.user;

            return createdUser.updateProfile({ displayName: username })
                .then(() => {
                    return db.collection("users")
                        .doc(createdUser.uid)
                        .set({ created: Date.now() }, { merge: true });
                });
        })
        .then(() => {
            return db.collection("users")
                .doc(createdUser.uid)
                .collection("public")
                .doc("info")
                .set({ username: username, challenge: 1 }, { merge: true });
        })
        .then(() => {
            return db.collection("users")
                .doc(createdUser.uid)
                .collection("private")
                .doc("info")
                .set({ challenge: 1, flag: "P3g1NN1Ng" }, { merge: true });
        })
        .then(() => {
            return db.collection("publicUsers")
                .doc(createdUser.uid)
                .set({
                    challenge: 0,
                    completedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    username: username
                }, { merge: true });
        })
        .then(() => {
            window.location.href = 'start.html';
        })
        .catch(error => {
            showAuthError(error);
        });
    });

    // Log In Function
    loginButton.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
            alert('Please enter your username and password.');
            return;
        }

        const email = `${username}@actfc.com`;

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                window.location.href = 'actfc.html';
            })
            .catch(error => {
                showAuthError(error);
            });
    });
});