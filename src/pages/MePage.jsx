// import React, {useContext} from 'react';
// import UserContext from "../hooks/Context.jsx";
// import Cookies from "universal-cookie";
// import {jwtDecode} from "jwt-decode";
import moment from "moment";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

function MePage() {
    // const {currentUser} = useContext(UserContext)
    //
    // const cookies = new Cookies()
    // const apiKey = cookies.get("jwt_auth")
    // const decodedUser = jwtDecode(apiKey)
    const auth = useAuthUser()
    return (
        <center>
        <h1>This is me</h1>

            <p><abbr title="Currently Logged In User">Username</abbr> : {auth.username}</p>
            <p>linked Person : {auth.linkedPerson}</p>
            <p>Linked Family : {auth.linkedFamily}</p>
            <p>Server Admin : {auth.isAdmin ? "Yes": "NO"}</p>
            <p>Family Admin : {auth.isFamilyAdmin ? "Yes": "NO"}</p>
            <p>User Uuid : {auth.uuid}</p>
            <p>Registered : {auth.created}</p>
            <p>Token created : {moment("1970-01-20 ").add(auth.iat * 1000).format('DD.MM.YYYY')} </p>
            <p>Valid until : {moment("1970-01-20 ").add(auth.exp * 1000).format('DD.MM.YYYY')} </p>
            <p></p>
            <h1>Cookie</h1>
            <p>{JSON.stringify(auth)}</p>

        </center>

    );
}

export default MePage;