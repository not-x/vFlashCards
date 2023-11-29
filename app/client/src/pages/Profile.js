import React from "react";
import ProfileTitleBar from "../components/ProfileTitleBar";
import ProfileNavPane from "../components/ProfileNavPane";
import { ProfileMain } from "../components/ProfileMain";


const Profile = () => {
    return (
        <>
            <h1>Profile</h1>
            <ProfileTitleBar></ProfileTitleBar>
            <ProfileNavPane></ProfileNavPane>
            <ProfileMain></ProfileMain>
        </>
    );
}
export default Profile;