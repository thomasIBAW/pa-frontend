import React from 'react';
import {Box} from "@chakra-ui/react";

function LoginError(props) {
    return (
        <Box as='h1' fontSize='14px' mt='10px' textAlign='center' color="red">
            Incorrect username or Password
        </Box>
    );
}

export default LoginError;