import React, {useState} from 'react';
import { Box, FormControl, FormLabel, VStack , Input, Button, Link} from '@chakra-ui/react'
import '@fontsource/julius-sans-one';
import Cookies from "universal-cookie";
import {jwtDecode} from "jwt-decode"

//TODO change backend URI to the correct one
const backendURI = 'http://127.0.0.1:3005/login'

const tempCred= {
    "username": "thomas",
    "password": "941519"
}

const cookies = new Cookies()


function Login({set}) {

    const [api_key, setApi] = useState("")
    const [user, setUser] = useState(null)

    async function login() {

        const response= await fetch( backendURI , {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            // mode: "cors", // no-cors, *cors, same-origin
            // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(tempCred), // body data type must match "Content-Type" header
        });

        const res = await response.json();
        const decoded = await jwtDecode(res.token)

        setUser(decoded)
        setApi(res.token)
        set(true) //Set loggedIn State in App.jsx to true

        cookies.set("jwt_auth", res.token, {
            expires: new Date(decoded.exp * 1000)
        })
        cookies.set("currentUser", decoded.username , {
            expires: new Date(decoded.exp * 1000)
        })

    }
    async function logout() {
        setUser(null)
        setApi("")
        cookies.remove("jwt_auth")
        cookies.remove("currentUser")
        set(false)
    }

    return (

<>
        <VStack spacing='24px'>
            <Box as='h1' lineHeight='1' w='340px' h='131px' fontSize='40px' textAlign='center' mt='48px'>Welcome to the Family Calendar</Box>

            <Box>
                <FormControl w='250px'>
                    <FormLabel as='h1' fontSize='14'>Username</FormLabel>
                    <Input type='text' variant='filled' size='lg' />
                    <FormLabel as='h1' mt='15px' fontSize='14'>Password</FormLabel>
                    <Input type='password' variant='filled' size='lg' />
                    <Button  onClick={login} colorScheme='gray' mt='30px' variant='solid' size='lg' w='250px'>Log in</Button>
                </FormControl>
                <Box as='h1' fontSize='14px' mt='10px' textAlign='center'>
                    Forgot your Password?
                </Box>
            </Box>
            <Box as='h1' fontSize='14px' mt='10px' textAlign='center'>
                New to Family Calendar? <Link>Register here</Link>
            </Box>
        </VStack>




</>
    );
}

export default Login;