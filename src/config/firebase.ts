import admin from "firebase-admin";

const firebaseConfig: string | undefined = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!firebaseConfig) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT missing");
}

const serviceAccount = JSON.parse(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
