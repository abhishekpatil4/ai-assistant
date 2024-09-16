import { useEffect, useState, useCallback } from "react";
import SettingsAttribute from "../components/SettingsAttribute";
import { auth, getUserDetailsByUid, addUserToAuthorisedUsers } from "../config/firebase";
import axios from "axios";
import { checkConnectionStatus, linkAccount } from "../utils/composio_utils";
import { useSnackbar } from 'notistack'
import Separator from "../components/Separator";
import AssignTask from "../components/AssignTask";

const Settings = ({ user }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [username, setUsername] = useState("");
    const [twitterAccount, setTwitterAccount] = useState("No connected account");
    const [twitterAccountLoading, setTwitterAccountLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [authorisedUsers, setAuthorisedUsers] = useState([]);
    const [gmailAccount, setGmailAccount] = useState("No connected account");
    const [googleTasksAccount, setGoogleTasksAccount] = useState("No connected account");
    const [googleMeetAccount, setGoogleMeetAccount] = useState("No connected account");
    const [slackAccount, setSlackAccount] = useState("No connected account");

    const fetchUserDetails = async () => {
        try {
            const details = await getUserDetailsByUid(user.uid);
            setUserDetails(details);
            return details;
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        const initializeAuthorisedUsersData = async () => {
            const details = await fetchUserDetails();
            if (details && details.authorisedUsers) {
                setAuthorisedUsers(details.authorisedUsers);
            }
        };
        checkConnectionStatus("GMAIL", setGmailAccount, user.email.split("@")[0]);
        checkConnectionStatus("GOOGLETASKS", setGoogleTasksAccount, user.email.split("@")[0]);
        checkConnectionStatus("GOOGLEMEET", setGoogleMeetAccount, user.email.split("@")[0]);
        checkConnectionStatus("SLACKBOT", setSlackAccount, user.email.split("@")[0]);
        setUsername(user.email.split("@")[0]);
        initializeAuthorisedUsersData();
    }, [user.uid, checkConnectionStatus]);


    const handleLinkSlackbotAccount = () => {
        linkAccount(user.email.split("@")[0], "SLACKBOT");
    }

    const handleLinkGmailAccount = () => {
        linkAccount(user.email.split("@")[0], "GMAIL");
    }

    const handleLinkGoogleMeetAccount = () => {
        linkAccount(user.email.split("@")[0], "GOOGLEMEET");
    }

    const handleLinkGoogleTasksAccount = () => {
        linkAccount(user.email.split("@")[0], "GOOGLETASKS");
    }

    return <div className="flex flex-1 flex-col gap-6 min-h-screen py-8 px-4 mx-auto mt-10 max-w-screen-md text-center lg:py-16 lg:px-12">
        <Separator title="Connect Accounts" />
        <SettingsAttribute type="username" displayName="Composio Account" value={username} linkAction={() => { enqueueSnackbar("Account already connected", { variant: 'success' }) }} loading={false} />
        <SettingsAttribute type="gmail" displayName="Gmail Account" value={gmailAccount} linkAction={handleLinkGmailAccount} loading={false} />
        <SettingsAttribute type="googleTasks" displayName="Google Tasks Account" value={googleTasksAccount} linkAction={handleLinkGoogleTasksAccount} loading={false} />
        <SettingsAttribute type="googleMeet" displayName="Google Meet Account" value={googleMeetAccount} linkAction={handleLinkGoogleMeetAccount} loading={false} />
        <SettingsAttribute type="slack" displayName="Slack Account" value={slackAccount} linkAction={handleLinkSlackbotAccount} loading={false} />
        <br />
        <Separator title="Assign Task" />
        <AssignTask user={user} />
    </div>
};

export default Settings;
