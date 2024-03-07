import React, {useContext} from 'react';
import {Box, Center} from "@chakra-ui/react";
import Cookies from "universal-cookie";
import UserContext from "../hooks/Context.jsx";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
function Footer(props) {
    const bgColor='#e6c997';
    const cookies = new Cookies()
    const auth = useAuthUser()
    // const {currentUser} = useContext(UserContext)

    return (
 //TODO Remove Footer or place to the bottom of the page
    <Center display="flex" bg={bgColor} w='100%' p={1} color='black' alignItems="center" justifyContent="space-evenly" fontFamily='Julius Sans One' fontSize='smaller' className="tbefooter">
           <Box>User : {auth.username}</Box>
          <Box>|</Box>
        <Box>Family : {auth.linkedFamily}</Box>
    </Center>

    );
}

export default Footer;