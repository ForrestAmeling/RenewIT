const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.submitContactForm = functions.https.onCall(async (data, context) => {
    // Basic validation
    if (!data.name || !data.email || !data.message) {
        throw new functions.https.HttpsError(
            'invalid-argument', 
            'Missing required fields'
        );
    }

    // Save to Firestore
    const contactRef = await db.collection('contacts').add({
        ...data,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ipAddress: context.rawRequest.ip
    });

    return { success: true, id: contactRef.id };
});