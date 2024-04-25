import React, {useContext, useState} from 'react';
import {Box, Center} from "@chakra-ui/react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
function Footer() {

    const frontEnd = import.meta.env.VITE_FRONTEND
    const backEnd = import.meta.env.VITE_BACKEND
    const dataBase = import.meta.env.VITE_DATABASE


    const bgColor='#e6c997';
    const auth = useAuthUser()

    console.log(`FrontEnd Version is : ${frontEnd}`)
    return (
 //TODO Remove Footer or place to the bottom of the page
    <Center display="flex" bg={bgColor} w='100%' p={1} color='black' alignItems="center" justifyContent="space-evenly" fontFamily='Julius Sans One' fontSize='smaller' className="tbefooter">
        {auth.username  && <Box>{auth.username}</Box>}
          <Box>|</Box>
        <Box>{auth.linkedFamily.slice(24)}</Box>
        <Box>|</Box>
        <Box>{frontEnd}/ </Box>
    </Center>

    );
}

export default Footer;