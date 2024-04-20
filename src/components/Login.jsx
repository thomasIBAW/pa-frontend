import {useEffect, useState} from 'react';
import {Box, FormControl, FormLabel, VStack, Input, Button, Link, Center, useConst} from '@chakra-ui/react'
import '@fontsource/julius-sans-one';
import {jwtDecode} from "jwt-decode"
import LoginError from "./LoginError.jsx";
import {useNavigate} from "react-router-dom";
import useSignIn from "react-auth-kit/hooks/useSignIn";

import {PropTypes} from "prop-types";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

//TODO change backend URI to the correct one
const backendURI = '/app/login'

function Login( ) {

    const navigate= useNavigate()

    // Login.propTypes = {
    //     onLogin: PropTypes.func
    // };

    // const {currentUser, setCurrentUser} = useContext(UserContext)

    const [error, setError] = useState(null)

    // formDAta state contains the credentials entered into the login form
    const [formData, setFormData] = useState({username:"", password:""});
    const signIn = useSignIn()
    // update formData state for every change in the form
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    async function login() {

        //console.log('onLogin prop type:', typeof onLogin);

        try {
            console.log("Starting Login process....")
            const response = await fetch(backendURI, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "include", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                },
                //redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(formData), // body data type must match "Content-Type" header
            });

            console.log("Received Feedback from Login fetch -> code:", response.status)

            if (response.status !== 200) {
                setError("incorrect")
                console.log(response)
                return
            }


            const res = await response.json();
            const decoded = await jwtDecode(res.token)

            console.log("Starting Sign-In Process with Cookie Creation...")

            if( signIn({
                auth: {
                    token: res.token,
                    type: 'Bearer'
                },
                userState: decoded
            })){
                console.log("successfully created....")

                setError(null)
                setFormData({username: "", password: ""});

                setTimeout(()=>{
                    console.log("starting navigation to /home ...")
                    navigate("/home")
                }, 1500)

                // navigate("/"); // <-- redirect
                // onLogin()
            }else {
                console.error("could not create coockies...")
            }

        } catch (e) {
            console.error(e)
        }
    }

    return (

    <>
        <VStack spacing='24px'>
            <Box as='h1' lineHeight='1' w='340px' h='131px' fontSize='40px' textAlign='center' mt='48px'>Welcome to the Family Calendar</Box>

            <Box>
                <FormControl w='250px'>
                    <FormLabel as='h1' fontSize='14'>Username</FormLabel>
                    <Input type='text' variant='filled' size='lg' id="username" name="username" value={formData.username} onChange={handleInputChange}/>
                    <FormLabel as='h1' mt='15px' fontSize='14'>Password</FormLabel>
                    <Input type='password' variant='filled' size='lg' id="password" name="password" value={formData.password} onChange={handleInputChange} />
                    <Button  onClick={login} colorScheme='gray' mt='30px' variant='solid' size='lg' w='250px'>Log in</Button>
                </FormControl>

                {error && <LoginError /> }

                {/*// TODO Create forgot Password Page*/}
                {/*<Box as='h1' fontSize='14px' mt='10px' textAlign='center'>*/}
                {/*    Forgot your Password?*/}
                {/*</Box>*/}

            </Box>

            {/*    //TODO Create Registrations Page*/}
            {/*<Box as='h1' fontSize='14px' mt='10px' textAlign='center'>*/}
            {/*    New to Family Calendar? <Link>Register here</Link>*/}
            {/*</Box>*/}
        </VStack>




</>
    );
}

export default Login;