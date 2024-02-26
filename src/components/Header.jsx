import React from 'react';
import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator, Center,
} from '@chakra-ui/react'
import {Link} from "react-router-dom";
import '@fontsource/julius-sans-one';



import Cookies from "universal-cookie";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Header() {
    const bgColor='#e6c997';
    const cookies = new Cookies()
    const user = cookies.get("currentUser")

    return (
        <>
        <Box display="flex"  flexWrap="wrap" alignItems="center" justifyContent="space-between" fontFamily='Julius Sans One'>
        <Center bg={bgColor} w='100%' p={2} color='black'>
        <Breadcrumb separator='|'>
            <BreadcrumbItem>
                <Box m={2}>
                    <BreadcrumbLink as={Link} to='/'>Home</BreadcrumbLink>
                </Box>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Box m={2}>
                    <BreadcrumbLink as={Link} to='/appointments'>Appointments</BreadcrumbLink>
                </Box>
            </BreadcrumbItem>
            <BreadcrumbItem>
                 <Box m={2}>
                    <BreadcrumbLink as={Link} to='/todos'>ToDos</BreadcrumbLink>
                 </Box>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Box m={2}>
                    <BreadcrumbLink as={Link} to='/me'><i className="fa-solid fa-gears"></i></BreadcrumbLink>
                </Box>
            </BreadcrumbItem>
        </Breadcrumb>

        </Center>

        </Box>
    <Center display="flex" bg={bgColor} w='100%' p={1} color='black' alignItems="center" justifyContent="space-evenly" fontFamily='Julius Sans One' fontSize='smaller'>
        <Box>User : {user}</Box>
        <Box>|</Box>
        <Box>Family : {user}</Box>
    </Center>

        </>
    )
}

export default Header;