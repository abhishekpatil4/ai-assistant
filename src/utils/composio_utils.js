import { auth } from "../config/firebase";
import axios from "axios";

const linkAccount = async (user, appType) => {
    try {
        const idToken = await auth.currentUser.getIdToken(true);
        const data = {
            username: user,
            appType: appType,
            redirectUrl: window.location.href
        };
        const newEntityURL = import.meta.env.VITE_BACKEND_URL + "/newentity"
        const response = await axios.post(newEntityURL, data, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.authenticated === "yes") {
            alert(response.data.message);
        } else if (response.data.authenticated === "no") {
            window.open(response.data.url, '_blank');
        }
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

const checkConnectionStatus = async (appType, setAccountStatus, entityId) => {
    try {
        const idToken = await auth.currentUser.getIdToken(true);
        const data = {
            username: entityId,
            appType: appType
        };
        const checkconnectionURL = import.meta.env.VITE_BACKEND_URL + "/checkconnection"
        const response = await axios.post(checkconnectionURL, data, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.authenticated === "yes") {
            setAccountStatus("Connected");
        }
    } catch (error) {
        console.error(`Error checking ${appType} connection status:`, error);
    }
}

export { checkConnectionStatus, linkAccount };
