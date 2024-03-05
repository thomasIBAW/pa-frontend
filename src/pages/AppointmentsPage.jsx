import React, {useContext, useEffect, useState} from 'react';
import Cookies from "universal-cookie";
import {
    Box, Button,
    Checkbox, FormControl, FormLabel, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, useDisclosure,
    VStack
} from "@chakra-ui/react";
import UserContext from "../hooks/Context.jsx";
import { PlusIcon } from '@heroicons/react/20/solid'
import {globalWrite, globalFetch} from "../hooks/Connectors.jsx";
import moment from "moment";
import Select from "react-select";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function AppointmentsPage() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    // tagNames are the tags in the Appointments we show
    const [tagNames, setTagNames] = useState({})
    // eventUsers are the users in the Appointments we show
    const [eventUsers, setEventUsers] = useState({})
    // currentCalendar has all the current Appointments (today+)
    const [currentCalendar, setCurrentCalendar] = useState([])
    // allFamilyPeople has all people in this Family, used to create new Appoitnments
    const [allFamilyPeople, setAllFamilyPeople] = useState([])
    // allFamilyPeople has all people in this Family, used to create new Appoitnments
    const [allFamilyTags, setAllFamilyTags] = useState([])
const [newAppointment, setNewAppointment] = useState({})
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
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    //Get currentUser from Context
    const {currentUser} = useContext(UserContext)
    // Defines the data to be used to create a new Appointment
    const [formData, setFormData] = useState({
        "subject": "",
        "creator": currentUser.uuid,
        "dateTimeStart": "",
        "dateTimeEnd": "",
        "attendees": [],
        "tags": [],
        "note": "",
        "fullDay": false,
        "important": false,
    });

    //Get token from Cookie
    const cookies = new Cookies()
    const apiKey = cookies.get("jwt_auth")
    const decodedUser = currentUser;

    //TODO change backend URI to the correct one
    const backendURI = 'http://127.0.0.1:3005';

    const createAppointment =  () => {
        async function writeData() {
            const response = await fetch(`${backendURI}/api/calendar/`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                // mode: "cors", // no-cors, *cors, same-origin
                // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    "api_key": apiKey,
                    "family_uuid": currentUser.linkedFamily
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

            setNewAppointment(res)
            onClose()
            console.log(res)
        }
        writeData()
    }

    // eslint-disable-next-line no-unexpected-multiline
    useEffect( () => {
         globalFetch("calendar",JSON.stringify({
                        dateTimeEnd: {
                            $gte: moment().toISOString() // Convert the current moment to an ISO string
                        }}) ,currentUser.linkedFamily )
            .then(res => setCurrentCalendar(res))
     },[newAppointment])

    useEffect( () => {
            globalFetch("people", `{"linkedFamily":"${currentUser.linkedFamily}"}` , currentUser.linkedFamily )
                .then(res => setAllFamilyPeople(res))
        },[]);

    useEffect( () => {
        globalFetch("tags", `{"linkedFamily":"${currentUser.linkedFamily}"}` , currentUser.linkedFamily )
            .then(res => setAllFamilyTags(res))
    },[]);


    // Fetches Tags from the Events
    useEffect(() => {
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

    // fetches Users from the events
    useEffect(() => {
        const fetchUsers = async () => {
            let newUsers = {};

            for (let event of currentCalendar) {
                // console.log(event)
                for (let tag of event.attendees) {
                    // console.log(tag)
                    // Assuming globalFetch does not duplicate requests for already fetched tags
                    if (!newUsers[tag]) {
                        const res = await globalFetch("people", `{"uuid" : "${tag}"}`, currentUser.linkedFamily);
                        // console.log(res)
                        newUsers[tag] = res[0].nickName;
                    }
                }
            }
            console.log(`setting Users to ${JSON.stringify(newUsers)}`)
            setEventUsers(newUsers);
        };

        fetchUsers();
    }, [currentCalendar, currentUser.linkedFamily]);

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

                <div className="grid grid-cols-1 gap-1 lg:grid-cols-2">
                    {currentCalendar.map((event) => (

                        // shows the appointment
                        <div
                            key={event.uuid}
                            className="relative mx-1 flex items-center space-x-0 rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                        >
                            {/*shows the date(day) of the appointment*/}


                            { moment(`${event.dateTimeStart}`).format('DD.MM.YYYY') == moment().format('DD.MM.YYYY') ?
                                <div className="w-14 px-1 flex-none border-yellow-400 border-2 rounded-lg">
                                    {/*<span className="absolute inset-0" aria-hidden="true" />*/}
                                    <div className= "julius text-center">
                                        {moment(`${event.dateTimeStart}`).format('ddd')}
                                    </div>
                                    <p className=" text-sm text-center font-extrabold text-gray-900">{moment(`${event.dateTimeStart}`).format('DD.MM.')}</p>
                                    {moment(`${event.dateTimeStart}`).format('DD.MM.') != moment(`${event.dateTimeEnd}`).format('DD.MM.') ?
                                    <p className=" text-sm text-center font-extrabold text-gray-900">{moment(`${event.dateTimeEnd}`).format('DD.MM.')}</p> : null }
                                </div>
                                :
                                <div className="w-14 px-1 flex-none">
                                    {/*<span className="absolute inset-0" aria-hidden="true" />*/}
                                    <div className= "julius text-center">
                                        {moment(`${event.dateTimeStart}`).format('ddd')}
                                    </div>
                                    <p className=" text-sm text-center font-extrabold text-gray-900">{moment(`${event.dateTimeStart}`).format('DD.MM.')}</p>
                                    {moment(`${event.dateTimeStart}`).format('DD.MM.') != moment(`${event.dateTimeEnd}`).format('DD.MM.') ?
                                        <p className=" text-sm text-center font-extrabold text-gray-900">{moment(`${event.dateTimeEnd}`).format('DD.MM.')}</p> : null }
                                </div>
                            }


                            {/*show time*/}
                            {/*<div className="w-14 flex-none px-1 m-0 text-center">*/}

                            {/*    <span className="absolute inset-0" aria-hidden="true" />*/}
                            {/*    <p className="text-sm text-gray-900">{moment(`${event.dateTimeStart}`).format('HH:mm')}</p>*/}
                            {/*    <p>-</p>*/}
                            {/*    <p className=" text-sm text-gray-500">{moment(`${event.dateTimeEnd}`).format('HH:mm')}</p>*/}

                            {/*</div>*/}


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
                                    <p className="text-lg text-center font-bold text-gray-900">{event.subject}</p>
                                    <p className=" text-center px-3 text-xs text-gray-500">{event.note}</p>
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
                                {event.attendees.map((tag, index) => (
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
                    <ModalHeader className='julius'>Add an appointment</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={3}>
                        <FormControl  w='200px'>
                            <FormLabel as='h1' fontSize='14'>subject *</FormLabel>
                            <Input type='text' variant='filled' size='lg' name="subject" value={formData.subject} onChange={handleInputChange}/>
                            <FormLabel as='h1' mt='15px' fontSize='14'>Note</FormLabel>
                            <Input type='text' variant='filled' size='lg' name="note" value={formData.note} onChange={handleInputChange}/>
                            <FormLabel as='h1' mt='15px' fontSize='14'>Attendees</FormLabel>
                            <Select
                                isMulti
                                name="attendees"
                                options={allFamilyPeople.map(person => ({ value: person.uuid, label: person.firstName }))}
                                onChange={(selectedOption, actionMeta) => handleInputChange(selectedOption, { ...actionMeta, name: 'attendees' })}
                            />
                            <FormLabel as='h1' mt='15px' fontSize='14'>Tags</FormLabel>
                            <Select
                                isMulti
                                name="tags"
                                options={allFamilyTags.map(tag => ({ value: tag.uuid, label: tag.tagName }))}
                                onChange={(selectedOption, actionMeta) => handleInputChange(selectedOption, { ...actionMeta, name: 'tags' })}
                            />
                            <FormLabel as='h1' mt='15px' fontSize='14'>From</FormLabel>
                            <Input type='datetime-local' variant='filled' size='lg' name="dateTimeStart" value={formData.dateTimeStart} onChange={handleInputChange}/>
                            <FormLabel as='h1' mt='15px' fontSize='14'>To</FormLabel>
                            <Input type='datetime-local' variant='filled' size='lg' name="dateTimeEnd" value={formData.dateTimeEnd} onChange={handleInputChange}/>
                            <Checkbox size='lg'  >Important</Checkbox>
                        </FormControl>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={createAppointment}>
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