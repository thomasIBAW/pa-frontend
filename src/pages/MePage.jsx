// import React, {useContext} from 'react';
// import UserContext from "../hooks/Context.jsx";
// import Cookies from "universal-cookie";
// import {jwtDecode} from "jwt-decode";
import moment from "moment";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import {Box, Center} from "@chakra-ui/react";
import {globalFetch} from "../hooks/Connectors.jsx";

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
    const [familyDetails, setFamilyDetails] = useState({})

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

    useEffect( () => {
        const getFamDetails = async () => {

            console.log(
                "fetch for Family Details"
            )
            const res = await globalFetch("family", `{ "uuid" : "${user.linkedFamily}" }`, "");
            console.log("setting Details to : ", res[0])
            setFamilyDetails(res[0])
        }
        getFamDetails()

    }, [])

    // const auth = useAuthUser()

    return (
        <center>
        <h1>This is me</h1>
            <h2></h2>
            <Box h="10px"></Box>
                <section >
                    <p className="text-xl"><abbr title="Currently Logged In User">Username</abbr> : <p className="font-bold">{user.username}</p></p>
                    {/*<p>linked Person : {user.linkedPerson}</p>*/}
                    <p>(User Uuid : {user.userUuid})</p>
                    <Box h="10px"></Box>
                    <p className="text-xl">Linked Family: <p className="font-bold">{familyDetails.familyName}</p></p>
                    <p>(Family Uuid : {user.linkedFamily})</p>
                    <Box h="10px"></Box>
                    <p>Server Admin : {user.isAdmin ? (<p className="font-bold text-green-600">Yes</p>): (<p className="font-bold text-red-700">No</p>)}</p>
                    <p>Family Admin : {user.isFamilyAdmin ? (<p className="font-bold text-green-600">Yes</p>): (<p className="font-bold text-red-700">No</p>)}</p>
                    <Box h="10px"></Box>
                    <p>Registered : {user.created}</p>
                </section>
            <Box h="20px"></Box>
            {/*<h2>Checked using the fc_user Cookie:</h2>*/}
            {/*<Box h="10px"></Box>*/}
            {/*<p>{JSON.stringify(cookieUser)}</p>*/}

        </center>

    );
}

export default MePage;