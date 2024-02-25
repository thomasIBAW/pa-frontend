import React from 'react';
import {Box, SkeletonCircle, SkeletonText} from "@chakra-ui/react";
import Login from "../components/Login.jsx";

function HomePage() {
    return (
        <>
        <h1>Homepage</h1>
        <Box padding='6' boxShadow='lg' bg='white'>
            <SkeletonCircle size='10' />
            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
        </Box>
            //TODO Remove Login Component
            <Login></Login>
        </>
    );
}

export default HomePage;