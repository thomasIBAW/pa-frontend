import React, {useContext, useState} from 'react';
import {Box, Center} from "@chakra-ui/react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
function Footer() {


    const bgColor='#e6c997';
    const auth = useAuthUser()


    return (
 //TODO Remove Footer or place to the bottom of the page
    <Center display="flex" bg={bgColor} w='100%' p={1} color='black' alignItems="center" justifyContent="space-evenly" fontFamily='Julius Sans One' fontSize='smaller' className="tbefooter">
           <Box>User : {auth.username}</Box>
          <Box>|</Box>
        <Box>{auth.linkedFamily}</Box>
    </Center>

    );
}

export default Footer;