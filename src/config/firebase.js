import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, serverTimestamp } from "firebase/firestore";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const logOut = () => {
    signOut(auth).then(() => {
        console.log("user signed out");
    }).catch((error) => {
        console.log("error signing user out");
    });
}

const db = getFirestore(app);

const doesUserExist = async (username) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error checking user:", error);
        return false;
    }
}

export const addUserData = async (uid, username, email) => {
    try {
        const exist = await doesUserExist(username);
        if (exist) {
            return;
        }
        const docRef = await addDoc(collection(db, "users"), {
            uid: uid,
            username: username,
            email: email,
            twitterAccountConnected: false,
            authorisedUsers: [],
            timeOfCreation: serverTimestamp()
        });
        console.log("Document written with id: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const addUserToAuthorisedUsers = async (uid, newUser) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const authorisedUser = {description: newUser.data.description, id: newUser.data.id, name: newUser.data.name, profile_image_url: newUser.data.profile_image_url, username: newUser.data.username}
            const updatedAuthorisedUsers = [...userData.authorisedUsers, authorisedUser];
            await updateDoc(userDoc.ref, {
                authorisedUsers: updatedAuthorisedUsers
            });
            console.log("Authorised user added successfully");
        } else {
            console.log("User document not found");
        }
    } catch (error) {
        console.error("Error adding user to authorised user", error);
        return error;
    }
}

export const getUserDetailsByUid = async (uid) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return userDoc.data();
        } else {
            console.log("User does not exist.");
            return null;
        }
    } catch (error) {
        console.error("Error getting user details:", error);
        return null;
    }
}