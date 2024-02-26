import React from 'react';
import {Box, SkeletonCircle, SkeletonText} from "@chakra-ui/react";
import Login from "../components/Login.jsx";
import '@fontsource/julius-sans-one';
import Cookies from "universal-cookie";


function HomePage() {
    const cookies = new Cookies()
    const user = cookies.get("currentUser")

    return (
        <>

            <center>
                <h1>Dashboard</h1>
                <p>Welcome {user}</p>
            </center>
        </>
    );
}

export default HomePage;