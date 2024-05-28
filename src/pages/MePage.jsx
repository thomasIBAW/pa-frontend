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
    const [familyDetails, setFamilyDetails] = useState({familyName:''})

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

    useEffect(() => {
        if (user.linkedFamily) {
            const getFamDetails = async () => {
                try {
                    const res = await globalFetch("family", `{ "uuid" : "${user.linkedFamily}" }`, "");
                    if (res && res.length > 0) {
                        setFamilyDetails(res[0]);
                    } else {
                        console.log("No family details found.");
                    }
                } catch (error) {
                    console.error("Error fetching family details:", error);
                }
            };
            getFamDetails();
        }
    }, [user]);

    // const auth = useAuthUser()

    return (
        <center>
        <h1>This is me</h1>
            <h2></h2>
            <Box h="10px"></Box>
                <section >
                    <p className="text-xl"><abbr title="Currently Logged In User">Username</abbr> : <span className="font-bold">{user.username}</span></p>
                    {/*<p>linked Person : {user.linkedPerson}</p>*/}
                    <Box h="10px"></Box>

                    <p>(User Uuid : {user.userUuid})</p>
                    <Box h="10px"></Box>
                    <p className="text-xl">Linked Family:<span className="font-bold"> {familyDetails.familyName }</span></p>
                    <Box h="10px"></Box>

                    <p>(Family Uuid : {user.linkedFamily})</p>
                    <Box h="10px"></Box>
                    <p>Server Admin : {user.isAdmin ? (<span className="font-bold text-green-600">Yes</span>): (<span className="font-bold text-red-700">No</span>)}</p>
                    <p>Family Admin : {user.isFamilyAdmin ? (<span className="font-bold text-green-600">Yes</span>): (<span className="font-bold text-red-700">No</span>)}</p>
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