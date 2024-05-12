import React, {useContext, useState} from 'react';
import {Box, Center} from "@chakra-ui/react";
import {useCookies} from "react-cookie";
function Footer() {

    const frontEnd = import.meta.env.VITE_FRONTEND
    //const dataBase = import.meta.env.VITE_DATABASE

    const [cookie] = useCookies()
    const [user , setUser] = useState(cookie.fc_user)
    const [backend, setBackend] = useState(cookie.fc_backend_version)
    const bgColor='#e6c997';

    console.log(`FrontEnd Version is : ${frontEnd}`)
    user && console.log(user)

    return (
 //TODO Remove Footer or place to the bottom of the page
    <Center display="flex" bg={bgColor} w='100%' p={1} color='black' alignItems="center" justifyContent="space-evenly" fontFamily='Julius Sans One' fontSize='smaller' className="tbefooter">
        {user  && <Box>{user.username}</Box>}
          <Box>|</Box>
        <Box>{user.linkedFamily.slice(24)}</Box>
        <Box>|</Box>
        <Box>{frontEnd}/{backend} </Box>
    </Center>

    );
}

export default Footer;