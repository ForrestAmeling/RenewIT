const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_BUCKET.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const contactData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        inquiryType: document.getElementById('inquiryType').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };

    // Call Firebase Function
    const submitContactForm = firebase.functions().httpsCallable('submitContactForm');
    submitContactForm(contactData)
        .then(result => {
            alert('Message sent successfully!');
            document.getElementById('contactForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error sending message. Please try again.');
        });
});