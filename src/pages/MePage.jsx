import React, {useContext} from 'react';
import UserContext from "../hooks/Context.jsx";
import Cookies from "universal-cookie";
import {jwtDecode} from "jwt-decode";
import moment from "moment";


function MePage() {
    const {currentUser} = useContext(UserContext)

    const cookies = new Cookies()
    const apiKey = cookies.get("jwt_auth")
    const decodedUser = jwtDecode(apiKey)

    return (
        <center>
        <h1>This is me</h1>

            <p>Username : {currentUser.username}</p>
            <p>linked Person : {currentUser.linkedPerson}</p>
            <p>Linked Family : {currentUser.linkedFamily}</p>
            <p>Server Admin : {currentUser.isAdmin ? "Yes": "NO"}</p>
            <p>Family Admin : {currentUser.isFamilyAdmin ? "Yes": "NO"}</p>
            <p>USer Uuid : {currentUser.uuid}</p>
            <p>Registered : {currentUser.created}</p>
            <p>Token created : {moment("1970-01-20 ").add(decodedUser.iat * 1000).format('DD.MM.YYYY')} </p>
            <p>Valid until : {moment("1970-01-20 ").add(decodedUser.exp * 1000).format('DD.MM.YYYY')} </p>
            <p></p>
            <h1>Cookie</h1>
            <p>{JSON.stringify(decodedUser)}</p>

        </center>

    );
}

export default MePage;