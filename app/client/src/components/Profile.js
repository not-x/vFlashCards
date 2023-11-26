import React from "react";
import ProfileTitleBar from "./ProfileTitleBar";
import ProfileNavPane from "./ProfileNavPane";
import { ProfileMain } from "./ProfileMain";


const Profile = () => {
    return (
        <>
            {/* <h1>Profile</h1> */}
            <ProfileTitleBar></ProfileTitleBar>
            <ProfileNavPane></ProfileNavPane>
            <ProfileMain></ProfileMain>
        </>
    );
}
export default Profile;