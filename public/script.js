import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-functions.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-check.js";

const firebaseConfig = {
    apiKey: "AIzaSyAcnvEEbhcEXIBek74PVWj0GwsXRacM0UU",
    authDomain: "renewit-b89e7.firebaseapp.com",
    projectId: "renewit-b89e7",
    storageBucket: "renewit-b89e7.firebasestorage.app",
    messagingSenderId: "492465454894",
    appId: "1:492465454894:web:522e769e162113354dc4bf",
    measurementId: "G-B7BQCWNXYQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Initialize App Check
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
    isTokenAutoRefreshEnabled: true
});

// DOM Elements
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

const showMessage = (text, isError = false) => {
    formMessage.textContent = text;
    formMessage.className = isError ? 'error' : 'success';
    formMessage.classList.remove('hidden');
    setTimeout(() => formMessage.classList.add('hidden'), 5000);
};

const setLoading = (isLoading) => {
    submitBtn.disabled = isLoading;
    submitBtn.querySelector('.button-text').textContent = isLoading ? 'Sending...' : 'Send Message';
    submitBtn.querySelector('.loader').classList.toggle('hidden', !isLoading);
};

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        // Get reCAPTCHA token
        const token = await grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', {action: 'contact'});
        
        const contactData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            inquiryType: document.getElementById('inquiryType').value,
            message: document.getElementById('message').value,
            recaptchaToken: token
        };

        const submitContactForm = httpsCallable(functions, 'submitContactForm');
        await submitContactForm(contactData);
        
        contactForm.reset();
        showMessage('Message sent successfully! We\'ll respond within 24 hours.');
    } catch (error) {
        console.error('Submission error:', error);
        showMessage(`Error: ${error.message || 'Failed to send message'}`, true);
    } finally {
        setLoading(false);
        grecaptcha.reset(); // Reset reCAPTCHA
    }
});