import React from "react";
import ProfileTitleBar from "../components/ProfileTitleBar";
import ProfileNavPane from "../components/ProfileNavPane";
import { ProfileMain } from "../components/ProfileMain";


const Profile = () => {
    return (
        <>
            <ProfileTitleBar></ProfileTitleBar>
            <ProfileNavPane></ProfileNavPane>
            <ProfileMain></ProfileMain>
        </>
    );
}
export default Profile;