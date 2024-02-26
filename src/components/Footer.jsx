import React from 'react';
import {Box, Center} from "@chakra-ui/react";
import Cookies from "universal-cookie";
function Footer(props) {
    const bgColor='#e6c997';
    const cookies = new Cookies()
    const user = cookies.get("currentUser")

    return (
 //TODO Remove Footer or place to the bottom of the page
    <Center display="flex" bg={bgColor} w='100%' p={1} color='black' alignItems="center" justifyContent="space-evenly" fontFamily='Julius Sans One' fontSize='smaller'>
           <Box>User : {user}</Box>
          <Box>|</Box>
        <Box>Family : {user}</Box>
    </Center>

    );
}

export default Footer;