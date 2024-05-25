// import React, {useContext} from 'react';
// import UserContext from "../hooks/Context.jsx";
// import Cookies from "universal-cookie";
// import {jwtDecode} from "jwt-decode";
import moment from "moment";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import {Box, Center} from "@chakra-ui/react";

const devState = import.meta.env.VITE_DEVSTATE
const backendURI = devState==='PROD' ? '/app' : 'http://localhost:3005';
function MePage() {
    // const {currentUser} = useContext(UserContext)
    //
    // const cookies = new Cookies()
    // const apiKey = cookies.get("jwt_auth")
    // const decodedUser = jwtDecode(apiKey)
    const [cookie] = useCookies()
    const [user , setUser] = useState({})
    const [cookieUser , setCookieUser] = useState(cookie.fc_user)

    useEffect( () => {
        async function getMe(){
            const response = await fetch(`${backendURI}/me`, {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "include", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (response.status !== 200) {
                // setError("incorrect")
                console.log(response.status)
                return
            }
            const res = await response.json();
            setUser(res)
        }
        getMe()
    }, [])


    // const auth = useAuthUser()

    return (
        <center>
        <h1>This is me</h1>
            <h2>Checked using jwt:</h2>
            <Box h="10px"></Box>

            <p><abbr title="Currently Logged In User">Username</abbr> : {user.username}</p>
            {/*<p>linked Person : {user.linkedPerson}</p>*/}
            <p>Linked Family : {user.linkedFamily}</p>
            <p>Server Admin : {user.isAdmin ? "Yes": "NO"}</p>
            <p>Family Admin : {user.isFamilyAdmin ? "Yes": "NO"}</p>
            <p>User Uuid : {user.userUuid}</p>
            <p>Registered : {user.created}</p>

            <Box h="20px"></Box>
            <h2>Checked using the fc_user Cookie:</h2>
            <Box h="10px"></Box>
            <p>{JSON.stringify(cookieUser)}</p>

        </center>

    );
}

export default MePage;