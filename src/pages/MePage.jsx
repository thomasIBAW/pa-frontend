// import React, {useContext} from 'react';
// import UserContext from "../hooks/Context.jsx";
// import Cookies from "universal-cookie";
// import {jwtDecode} from "jwt-decode";
import moment from "moment";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {useCookies} from "react-cookie";
import {useState} from "react";

function MePage() {
    // const {currentUser} = useContext(UserContext)
    //
    // const cookies = new Cookies()
    // const apiKey = cookies.get("jwt_auth")
    // const decodedUser = jwtDecode(apiKey)
    const [cookie] = useCookies()
    const [user , setUser] = useState(cookie.fc_user)

    // const auth = useAuthUser()

    return (
        <center>
        <h1>This is me</h1>
            <h2>From the Cookie:</h2>
            <p><abbr title="Currently Logged In User">Username</abbr> : {user.username}</p>
            <p>linked Person : {user.linkedPerson}</p>
            <p>Linked Family : {user.linkedFamily}</p>
            <p>Server Admin : {user.isAdmin ? "Yes": "NO"}</p>
            <p>Family Admin : {user.isFamilyAdmin ? "Yes": "NO"}</p>
            <p>User Uuid : {user.uuid}</p>
            <p>Registered : {user.created}</p>

            <p></p>
            <h1>Cookie</h1>
            <p>{JSON.stringify(user)}</p>

        </center>

    );
}

export default MePage;