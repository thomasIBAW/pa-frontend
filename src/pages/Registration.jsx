import React, {useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement, Radio, RadioGroup, Stack,
    VStack
} from "@chakra-ui/react";
import '@fontsource/julius-sans-one';

import {useNavigate} from "react-router-dom";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { Link as RouterLink } from 'react-router-dom';

import Select from "react-select";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {globalWrite} from "../hooks/Connectors.jsx";
import {jwtDecode} from "jwt-decode";

const devState = import.meta.env.VITE_DEVSTATE
const backendURI = devState==='PROD' ? '/app' : 'http://localhost:3005';


function Registration() {

    const signIn = useSignIn()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    // Defines the data to be used to create a new Appointment
    const [formData, setFormData] = useState({
        "username": "",
        "useremail": "",
         "password1": "",
        "password2": "",
        "familyName": "",
        "invitationCode": ""
    });

    // Handles Inputs from the Add Appointment modal
    const handleInputChange = (eventOrSelectedOption, actionMeta) => {
        // Check if the input change is coming from React Select
        if (actionMeta && actionMeta.action) {
            const { name } = actionMeta;
            // For multi-select, we get an array of selected options
            const values = eventOrSelectedOption ? eventOrSelectedOption.map(option => option.value) : [];
            setFormData(prevData => ({
                ...prevData,
                [name]: values, // Store the array of selected values for multi-select
            }));
        } else {
            // Handle standard inputs (e.g., Input component changes)
            const { name, value } = eventOrSelectedOption.target;

            console.log(name, value) //debugging time error

            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // value for Radio buttons
    const [value, setValue] = React.useState('1')

    // show for ShowPassword
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    const signup = async () => {

        setIsLoading(true)

        let familyBody = {familyName : formData.familyName}
        let decoded = ""
        let data = {
                username : formData.username,
                email : formData.useremail || "",
                password : formData.password1, //to be bcrypted
                repeat_password: formData.password2,
                remember : true,
                isFamilyAdmin : true,
          }

        const completeData = {
            user: data,
            family: familyBody
        }
        console.log(`Starting Process for new Family ${familyBody.familyName} and new User ${data.username}`)
        // console.log(familyBody)
        // console.log(data)

        try {

        const response = await fetch(`${backendURI}/signup`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "include", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json"
            },
            // redirect: "follow", // manual, *follow, error
            // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(completeData), // body data type must match "Content-Type" header
        })

        if (response.status !== 200) {
            // setError("incorrect")
            console.log(response.status)
            throw new Error(response.status)
        }

        const createdUser = await response.json()
        console.log('User creation sucesful', createdUser)


        } catch (e) {
            console.error(e)
            return
        }

        setTimeout(()=>{
            console.log("starting navigation to /home ...")
            setIsLoading(false)
            navigate("/home")
        }, 500)

    }



    return (
        <>
            <VStack spacing='24px'>
                <Box as='h1' lineHeight='1' w='340px'  fontSize='40px' textAlign='center' mt='48px'> Register</Box>

                <FormControl w='300px'>
                    <FormLabel as='h1' fontSize='14'>Username</FormLabel>
                    <Input type='text' variant='filled' size='lg' id="username" name="username" value={formData.username} onChange={handleInputChange}/>
                    <FormLabel as='h1' fontSize='14'>E-Mail</FormLabel>
                    <Input type='email' variant='filled' size='lg' id="useremail" name="useremail" value={formData.useremail} onChange={handleInputChange}/>
                    <FormLabel as='h1' mt='15px' fontSize='14'>Password</FormLabel>
                    {/*<Input type='password' variant='filled' size='lg' id="password" name="password" value={formData.password} onChange={handleInputChange} />*/}

                    <InputGroup size='md'>
                        <Input
                            variant='filled' size='lg' id="password1" name="password1" value={formData.password1} onChange={handleInputChange}
                            type={show ? 'text' : 'password'}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClick}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>

                    <Box as='h1' display={(formData.password1.length > 0 && formData.password1.length < 6) ? 'block' : 'none'} fontSize='14px' color="red" >Password too short (min 6)</Box>


                    <FormLabel as='h1' mt='15px' fontSize='14'>Repeat Password</FormLabel>
                    <InputGroup size='md'>
                        <Input
                            variant='filled' size='lg' id="password2" name="password2" value={formData.password2} onChange={handleInputChange}
                            type={show ? 'text' : 'password'}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClick}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    <Box as='h1' display={formData.password2.length > 0 && (formData.password1 !== formData.password2) ? 'block' : 'none'} fontSize='14px' color="red" >Password doesn't match</Box>

                    <FormLabel as='h1' mt='35px' fontSize='14'>Join existing Family?</FormLabel>

                    <RadioGroup className='julius' fontSize='10' onChange={setValue} value={value} mb='25px'>
                        <Stack direction='row'>
                            <Radio value='1' >New</Radio>
                            <Radio isDisabled value='2' >Existing</Radio>
                        </Stack>
                    </RadioGroup>
                    { value==="1" && (
                        <>
                        <FormLabel as='h1' fontSize='14'>Family name</FormLabel>
                        <Input type='text' variant='filled' size='lg' id="familyname" name="familyName" value={formData.familyName}
                    onChange={handleInputChange}/>
                        </>
                )}

                    { value==="2" && (
                        <>
                            <FormLabel as='h1' fontSize='14'>Invitation code</FormLabel>
                            <Input type='text' variant='filled' size='lg' id="invitationCode" name="invitationCode" value={formData.invitationCode}
                                   onChange={handleInputChange}/>
                        </>
                    )}


                    {/*{(formData.password1===formData.password2 && formData.password1.length>=6) && <Button  onClick={signup} colorScheme='gray' mt='30px' variant='solid' size='lg' w='300px'>Register User {value==='1' ? 'and Family' : 'and join'}</Button> }*/}
                        <Button  onClick={signup} isLoading={isLoading}
                                 loadingText='Creating...' isDisabled={(formData.password1 !== formData.password2) || formData.password1.length < 6}
                                 colorScheme='gray' mt='30px' variant='solid' size='lg' w='300px'>Register User {value==='1' ? 'and Family' : 'and join'}</Button>

                </FormControl>

            </VStack>
        </>
    );
}
//


export default Registration;