import React, {useEffect, useState} from 'react';
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
import { PlusIcon } from '@heroicons/react/20/solid'
import {globalWrite, globalFetch} from "../hooks/Connectors.jsx";
import moment from "moment";
import Select from "react-select";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import Appointment from "../components/Appointment.jsx";
import { format , add } from "date-fns";


function AppointmentsPage() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const auth = useAuthUser()

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

    // Defines the data to be used to create a new Appointment
    const [formData, setFormData] = useState({
        "subject": "",
        "creator": auth.uuid,
        "dateTimeStart": new Date(),
        "dateTimeEnd": new Date(),
        "attendees": [],
        "tags": [],
        "note": "",
        "fullDay": false,
        "important": false,
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
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // Get currentUser from Context
    //const {currentUser} = useContext(UserContext)
    // const currentUser = user



    // Get token from Cookie
    const cookies = new Cookies()
    const apiKey = cookies.get("_auth")
    // const decodedUser = auth;

    //TODO change backend URI to the correct one
    const backendURI = 'http://127.0.0.1:3005';

    const createAppointment =  () => {
        console.log(JSON.stringify(auth))
        async function writeData() {
            const response = await fetch(`${backendURI}/api/calendar/`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
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
                        }}) ,auth.linkedFamily )
            .then(res => setCurrentCalendar(res))
     },[newAppointment])

    useEffect( () => {
            globalFetch("people", `{"linkedFamily":"${auth.linkedFamily}"}` , auth.linkedFamily )
                .then(res => setAllFamilyPeople(res))
        },[]);

    useEffect( () => {
        globalFetch("tags", `{"linkedFamily":"${auth.linkedFamily}"}` , auth.linkedFamily )
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
                        const res = await globalFetch("tags", `{"uuid" : "${tag}"}`, auth.linkedFamily);
                        // console.log(res)
                        newTagNames[tag] = {name: res[0].tagName, color: res[0].tagColor}; // Assuming res.tagName is the format of your response
                    }
                }
            }
            console.log(`setting tagName to ${JSON.stringify(newTagNames)}`)
            setTagNames(newTagNames);
        };

        fetchTags();
    }, [currentCalendar, auth.linkedFamily]);

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
                        const res = await globalFetch("people", `{"uuid" : "${tag}"}`, auth.linkedFamily);
                        // console.log(res)
                        newUsers[tag] = res[0].nickName;
                    }
                }
            }
            console.log(`setting Users to ${JSON.stringify(newUsers)}`)
            setEventUsers(newUsers);
        };

        fetchUsers();
    }, [currentCalendar, auth.linkedFamily]);

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

                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                    {currentCalendar.map((event) => (
                        <Appointment event={event} eventUsers={eventUsers} />
                    ))}
                    <div className="bg-white h-7"></div>
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