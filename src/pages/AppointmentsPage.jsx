import React, {useContext, useEffect, useState} from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import Cookies from "universal-cookie";
import { HexColorPicker } from "react-colorful";

import {
    Box, Button,
    Center, FormControl, FormLabel, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, useDisclosure,
    VStack
} from "@chakra-ui/react";
import UserContext from "../hooks/Contect.jsx";
import { PlusIcon } from '@heroicons/react/20/solid'
import globalFetch from "../hooks/Connectors.jsx";
import moment from "moment";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}




function AppointmentsPage() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [formData, setFormData] = useState({
        "subject": "",
        "creator": "",
        "dateTimeStart": "",
        "dateTimeEnd": "",
        "attendees": [],
        "tags": [],
        "note": "",
        "fullDay": false,
        "important": true,
    });
    const [tagNames, setTagNames] = useState({})
    const [eventUsers, setEventUsers] = useState({})
    const [error, setError] = useState(null)
    const [currentCalendar, setCurrentCalendar] = useState([])
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    //Get currentUser from Context
    const {currentUser} = useContext(UserContext)

    //Get token from Cookie
    const cookies = new Cookies()
    const apiKey = cookies.get("jwt_auth")

    const decodedUser = currentUser;
    //console.log(decodedUser.linkedFamily, apiKey)

    //TODO change backend URI to the correct one
    const backendURI = 'http://127.0.0.1:3005';

    const createPerson =  () => {

        async function writeData() {
            const response = await fetch(`${backendURI}/api/people/`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                // mode: "cors", // no-cors, *cors, same-origin
                // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    "api_key": apiKey,
                    "family_uuid": decodedUser.linkedFamily
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
            setFormData({
                "firstName":"",
                "lastName":"",
                "nickName":"",
                "dob":"",
                "email":""
            })

            console.log(res)
        }
        writeData()
    }

    // eslint-disable-next-line no-unexpected-multiline
    useEffect( () => {
        async function fetchData() {
            const response = await fetch(`${backendURI}/api/calendar/find`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                // mode: "cors", // no-cors, *cors, same-origin
                // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    "api_key": apiKey,
                    "family_uuid": decodedUser.linkedFamily
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
            setCurrentCalendar(res)
            console.log(res)
        }

        fetchData()
    },[])


    useEffect(() => {
        // Fetches Tags from the Events
        const fetchTags = async () => {
            let newTagNames = {};

            for (let event of currentCalendar) {
                // console.log(event)
                for (let tag of event.tags) {
                    // console.log(tag)
                    // Assuming globalFetch does not duplicate requests for already fetched tags
                    if (!newTagNames[tag]) {
                        const res = await globalFetch("tags", `{"uuid" : "${tag}"}`, decodedUser.linkedFamily);
                        // console.log(res)
                        newTagNames[tag] = {name: res[0].tagName, color: res[0].tagColor}; // Assuming res.tagName is the format of your response
                    }
                }
            }
            console.log(`setting tagName to ${JSON.stringify(newTagNames)}`)
            setTagNames(newTagNames);
        };

        fetchTags();
    }, [currentCalendar, decodedUser.linkedFamily]);

    useEffect(() => {
        // fetches Users from the events
        const fetchUsers = async () => {
            let newUsers = {};

            for (let event of currentCalendar) {
                // console.log(event)
                for (let tag of event.attendees) {
                    // console.log(tag)
                    // Assuming globalFetch does not duplicate requests for already fetched tags
                    if (!newUsers[tag]) {
                        const res = await globalFetch("people", `{"uuid" : "${tag}"}`, decodedUser.linkedFamily);
                        // console.log(res)
                        newUsers[tag] = res[0].nickName;
                    }
                }
            }
            console.log(`setting Users to ${JSON.stringify(newUsers)}`)
            setEventUsers(newUsers);
        };

        fetchUsers();
    }, [currentCalendar, decodedUser.linkedFamily]);

    return (
        <>
            <VStack mb='20px'>

                <h1>Appointments
                    <button
                        type="button" onClick={onOpen}
                        className="ml-3 rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </h1>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {currentCalendar.map((person) => (

                        // shows the appointment
                        <div
                            key={person.uuid}
                            className="relative mx-1 flex items-center space-x-0 rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                        >
                            {/*shows the date(day) of the appointment*/}
                            <div className="w-14 px-1 flex-none">
                                {/*<span className="absolute inset-0" aria-hidden="true" />*/}
                                <p className=" text-2xl text-center font-extrabold text-gray-900">{moment(`${person.dateTimeStart}`, "DD.MM.YYYY - HH:mm").format('DD dd')}</p>
                            </div>

                            {/*show time*/}
                            <div className="w-14 flex-none px-1 m-0 text-center">

                                <span className="absolute inset-0" aria-hidden="true" />
                                <p className="text-sm text-gray-900">{moment(`${person.dateTimeStart}`, "DD.MM.YYYY - HH:mm").format('HH:mm')}</p>
                                <p>-</p>
                                <p className=" text-sm text-gray-500">{moment(`${person.dateTimeEnd}`, "DD.MM.YYYY - HH:mm").format('HH:mm')}</p>

                            </div>
                            {/*show an image if Appointment is important*/}

                            {/*{person.important && (<div>*/}
                            {/*    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"*/}
                            {/*         strokeWidth={0.8} stroke="red" className="w-10 h-10">*/}
                            {/*        <path strokeLinecap="round" strokeLinejoin="round"*/}
                            {/*              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>*/}
                            {/*    </svg>*/}
                            {/*</div>)}*/}

                            {/*show the appointment Info like subject and additional informations*/}
                            <div className="min-w-40 flex-auto ">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    <p className="text-lg text-center font-bold text-gray-900">{person.subject}</p>
                                    <p className=" text-center px-3 text-xs text-gray-500">{person.note}</p>
                                </a>
                            </div>



                            {/*/!*show Tags*!/*/}
                            {/*<div className="min-w-0 flex-1 ">*/}
                            {/*    {person.tags.map((tag, index) => {*/}
                            {/*        // Move the declaration of tagInfo outside of the return statement.*/}
                            {/*        const tagInfo = tagNames[tag];*/}
                            {/*        // Now return the Box component correctly.*/}
                            {/*        return (*/}
                            {/*            <Box key={index} bgColor={tagInfo ? tagInfo.color : 'defaultColor'} className="inline-flex items-center rounded-md bg-gray-50 px-1.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">*/}
                            {/*                /!*{tagInfo ? tagInfo.name : 'Unknown Tag'}*!/*/}
                            {/*            </Box>*/}
                            {/*        );*/}
                            {/*    })}*/}
                            {/*</div>*/}

                            {/*show Attendees*/}
                            <div className="w-16 flex-none">
                                {person.attendees.map((tag, index) => (
                                    // Move the declaration of tagInfo outside of the return statement.

                                        <Box key={index} className="inline-flex rounded-md bg-gray-50 px-1.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                            {eventUsers[tag]}
                                        </Box>

                                ))}
                            </div>
                        </div>
                    ))}
                </div>


            </VStack>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent w='300px' alignItems='center'>
                    <ModalHeader className='julius'>Add a person</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={3}>
                        <FormControl w='200px'>
                            <FormLabel as='h1' fontSize='14'>Firstname *</FormLabel>
                            <Input type='text' variant='filled' size='lg' name="firstName" value={formData.firstName} onChange={handleInputChange}/>
                            <FormLabel as='h1' mt='15px' fontSize='14'>LastName</FormLabel>
                            <Input type='text' variant='filled' size='lg' name="lastName" value={formData.lastName} onChange={handleInputChange}/>
                            <FormLabel as='h1' mt='15px' fontSize='14'>NickName</FormLabel>
                            <Input type='text' variant='filled' size='lg' name="nickName" value={formData.nickName} onChange={handleInputChange}/>
                            <FormLabel as='h1' mt='15px' fontSize='14'>Date of Birth</FormLabel>
                            <Input type='text' variant='filled' size='lg' name="dob" value={formData.dob} onChange={handleInputChange}/>
                            <FormLabel as='h1' mt='15px' fontSize='14'>E-Mail Address</FormLabel>
                            <Input type='email' variant='filled' size='lg' name="email" value={formData.email} onChange={handleInputChange}/>
                        </FormControl>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={createPerson}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AppointmentsPage;