import React, {useContext} from 'react';
import {Box, SkeletonCircle, SkeletonText} from "@chakra-ui/react";
import Login from "../components/Login.jsx";
import '@fontsource/julius-sans-one';
import Cookies from "universal-cookie";
import People from "../components/People.jsx"
import UserContext from "../hooks/Contect.jsx";
function HomePage() {
    const cookies = new Cookies()
    // const encodedString = cookies.get("currentUser")
    // const decodedString = decodeURIComponent(encodedString)
    // const user= JSON.parse(encodedString)
    const {currentUser, setCurrentUser } = useContext(UserContext);

    console.log(currentUser)
    return (
        <>

            <center>
                <h1>Dashboard</h1>
                <p>Welcome</p>
            </center>

            <People></People>
        </>
    );
}

export default HomePage;