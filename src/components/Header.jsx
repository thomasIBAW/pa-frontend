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
        <Center bg='darkcyan' w='100%' p={1} color='white'>
        <Breadcrumb separator='|'>
            <BreadcrumbItem><Box m={5}>
                <BreadcrumbLink as={Link} to='/'>Home</BreadcrumbLink>
            </Box>
            </BreadcrumbItem>
            <BreadcrumbItem><Box m={5}>
                <BreadcrumbLink as={Link} to='/appointments'>Appointments</BreadcrumbLink>
            </Box></BreadcrumbItem>

            <BreadcrumbItem isCurrentPage><Box m={5}>
                <BreadcrumbLink as={Link} to='/todos'>ToDos</BreadcrumbLink>
            </Box></BreadcrumbItem>
        </Breadcrumb>
        </Center>
    );
}

export default Header;