import React, {useContext, useEffect, useState} from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import Cookies from "universal-cookie";

import { Box, useDisclosure, VStack } from "@chakra-ui/react";

import useAuthUser from "react-auth-kit/hooks/useAuthUser";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Family() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [color, setColor] = useState("");
    const [formData, setFormData] = useState({tagName:"", tagColor:color});
    const auth = useAuthUser()
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const [error, setError] = useState(null)
    const [currentFamily, setCurrentFamily] = useState([])



    //Get token from Cookie
    const cookies = new Cookies()
    const apiKey = cookies.get("jwt_auth")

    const decodedUser = auth;
    //console.log(decodedUser.linkedFamily, apiKey)
    //TODO change backend URI to the correct one
    const backendURI = 'http://127.0.0.1:3005';
console.log(color)
    const createTag =  () => {

    setFormData({tagName: FormData.tagName, tagColor:color} )
    async function writeData() {
        const response = await fetch(`${backendURI}/api/family/`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            // mode: "cors", // no-cors, *cors, same-origin
            // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                "api_key": apiKey,
                "family_uuid": auth.linkedFamily
            },
            // redirect: "follow", // manual, *follow, error
            // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(formData), // body data type must match "Content-Type" header
        })
        if (response.status !== 200) {
            // setError("incorrect")
            console.log(response.status)
            return
        }
        const res = await response.json();

        //console.log(res)
    }
    writeData()
}

    // eslint-disable-next-line no-unexpected-multiline
    useEffect( () => {
        //TODO Change to GlobalFetch function
        async function fetchData() {
            const response = await fetch(`${backendURI}/api/family/find`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                // mode: "cors", // no-cors, *cors, same-origin
                // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    "api_key": auth.token,
                },
                // redirect: "follow", // manual, *follow, error
                // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({}), // body data type must match "Content-Type" header
            })
            if (response.status !== 200) {
                // setError("incorrect")
                console.log(response.status)
                return
            }
            const res = await response.json();

            setCurrentFamily(res)
            //console.log(res)
        }

        fetchData()
    },[])

//TODO Add Details to the Families / Modification
    return (
<>
        <VStack mb='20px'>

            <h1>Families (adminonly)
                {/*<button*/}
                {/*    type="button" onClick={onOpen}*/}
                {/*    className="ml-3 rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"*/}
                {/*>*/}
                {/*    <PlusIcon className="h-5 w-5" aria-hidden="true" />*/}
                {/*</button>*/}
            </h1>

            <div>
                <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    {currentFamily.map((project) => (
                        <li key={project.uuid} className="col-span-1 flex rounded-md shadow-sm">
                            <Box bgColor={project.familyColor}
                                className={classNames(
                                    'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
                                )}
                            >
                                {/*{project.tagName}*/}
                            </Box>
                            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                                <div className="flex-1 truncate px-4 py-2 text-sm">
                                    {/*<a href={project.href} className="font-medium text-gray-900 hover:text-gray-600">*/}
                                    {/*    {project.tagName}*/}
                                    {/*</a>*/}
                                    <p className="text-gray-500">{project.familyName}</p>
                                </div>
                                <div className="flex-shrink-0 pr-2">
                                    <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <span className="sr-only">Open options</span>
                                        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </VStack>

    {/*<Modal*/}
    {/*    initialFocusRef={initialRef}*/}
    {/*    finalFocusRef={finalRef}*/}
    {/*    isOpen={isOpen}*/}
    {/*    onClose={onClose}*/}
    {/*>*/}
    {/*    <ModalOverlay />*/}
    {/*    <ModalContent w='300px' alignItems='center'>*/}
    {/*        <ModalHeader className='julius'>Add a new Tag</ModalHeader>*/}
    {/*        <ModalCloseButton />*/}
    {/*        <ModalBody pb={3}>*/}
    {/*            <FormControl w='200px'>*/}
    {/*                <FormLabel as='h1' fontSize='14'>Tag Name</FormLabel>*/}
    {/*                <Input type='text' variant='filled' size='lg' name="tagName" value={formData.tagName} onChange={handleInputChange}/>*/}
    {/*                <FormLabel as='h1' mt='15px' fontSize='14'>Color</FormLabel>*/}
    {/*                <HexColorPicker color={color} onChange={setColor} />*/}
    {/*                /!*<Button  onClick={} colorScheme='gray' mt='30px' variant='solid' size='lg' w='250px'>Log in</Button>*!/*/}
    {/*            </FormControl>*/}

    {/*        </ModalBody>*/}

    {/*        <ModalFooter>*/}
    {/*            <Button colorScheme='blue' mr={3} onClick={createTag}>*/}
    {/*                Save*/}
    {/*            </Button>*/}
    {/*            <Button onClick={onClose}>Cancel</Button>*/}
    {/*        </ModalFooter>*/}
    {/*    </ModalContent>*/}
    {/*</Modal>*/}
</>
    );
}

export default Family;