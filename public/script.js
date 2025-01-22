import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, httpsCallable } from "firebase/functions"; // Add this

const firebaseConfig = {
    apiKey: "AIzaSyAcnvEEbhcEXIBek74PVWj0GwsXRacM0UU",
    authDomain: "renewit-b89e7.firebaseapp.com",
    projectId: "renewit-b89e7",
    storageBucket: "renewit-b89e7.firebasestorage.app",
    messagingSenderId: "492465454894",
    appId: "1:492465454894:web:522e769e162113354dc4bf",
    measurementId: "G-B7BQCWNXYQ"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const functions = getFunctions(app); // Initialize Functions

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const contactData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            inquiryType: document.getElementById('inquiryType').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // Use modular function call
        const submitContactForm = httpsCallable(functions, 'submitContactForm');
        await submitContactForm(contactData);
        
        alert('Message sent successfully!');
        document.getElementById('contactForm').reset();
        
        // Track conversion
        analytics.logEvent('contact_form_submitted');
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
        // If using Sentry
        if (typeof Sentry !== 'undefined') {
            Sentry.captureException(error);
        }
    }
});

