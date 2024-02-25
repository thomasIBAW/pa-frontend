import React from 'react';
import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator, Center,
} from '@chakra-ui/react'
import {Link} from "react-router-dom";

function Header() {
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
        <Center bg='darkcyan' w='100%' p={1} color='white'>
        <Breadcrumb separator='|'>
            <BreadcrumbItem>
                <Box m={5}>
                    <BreadcrumbLink as={Link} to='/'>Home</BreadcrumbLink>
                </Box>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Box m={5}>
                    <BreadcrumbLink as={Link} to='/appointments'>Appointments</BreadcrumbLink>
                </Box>
            </BreadcrumbItem>
            <BreadcrumbItem>
                 <Box m={5}>
                    <BreadcrumbLink as={Link} to='/todos'>ToDos</BreadcrumbLink>
                 </Box>
            </BreadcrumbItem>
        </Breadcrumb>
        </Center>
            <Center w={'15%'} as={Link} to='/me'>
                <i className="fa-solid fa-gears"></i>
            </Center>
        </Box>
    );
}

export default Header;