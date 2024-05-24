import React, {useEffect, useState} from 'react';
import {Box, Center} from "@chakra-ui/react";
import {useCookies} from "react-cookie";
import {Link} from "react-router-dom";
import {globalFetch} from "../hooks/Connectors.jsx";
function Footer() {

    const frontEnd = import.meta.env.VITE_FRONTEND
    //const dataBase = import.meta.env.VITE_DATABASE
    const [familyDetails, setFamilyDetails] = useState({})
    const [cookie] = useCookies()
    const [user , setUser] = useState(cookie.fc_user)
    const [backend, setBackend] = useState({version : "-"})
    const bgColor='#e6c997';

    console.log(`FrontEnd Version is : ${frontEnd}`)
    user && console.log(user)

    useEffect( () => {
        cookie.fc_backend_version ? setBackend(cookie.fc_backend_version) : null
    }, [])

    // Get Family Details
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

    return (
 //TODO Remove Footer or place to the bottom of the page
    <Center display="flex" bg={bgColor} w='100%' p="1" color='black' alignItems="center" justifyContent="space-evenly" fontFamily='Julius Sans One' fontSize='smaller' className="tbefooter">
        {user  && <Box>{user.username}</Box>}
          <Box>|</Box>
        <Box>Family: {familyDetails.familyName}</Box>
        <Box>|</Box>
        <Box as={Link} to="https://docs.famcal.ch/dev_backend/Setup/05_versions" target="_blank">
            {frontEnd}/{backend.version}
        </Box>
    </Center>

    );
}

export default Footer;