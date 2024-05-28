import React, {useEffect, useState} from 'react';
import {
    Alert, AlertDescription, AlertIcon, AlertTitle,
    Box,
    Button,
    Checkbox, Divider, FormControl, FormLabel, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { PlusIcon } from '@heroicons/react/20/solid'
import {globalWrite, globalFetch, globalDelete} from "../hooks/Connectors.jsx";
import moment from "moment";
import Select from "react-select";
import Appointment from "../components/Appointment.jsx";
import {
    format,
    add,
    isFirstDayOfMonth,
    isSameMonth,
    startOfMonth,
    endOfMonth,
    subDays,
    addDays,
    addHours
} from "date-fns";
import Loading from "../components/Loading.jsx";
import {socket} from "../socket.js";
import {useCookies} from "react-cookie";
import {IoMdTrash} from "react-icons/io";
import {toast} from "react-toastify";


function AppointmentsPage() {

    const [cookie] = useCookies()
    const [user , setUser] = useState(cookie.fc_user)



    // Assuming 'now' is the current date
    const now = new Date();

// Start of the current month
    const startOfCurrentMonth = startOfMonth(now);

// End of the current month
    const endOfCurrentMonth = endOfMonth(now);

// Start of the next month
    const startOfNextMonth = startOfMonth(add(now, {months:1}));

// End of the next month
    const endOfNextMonth = endOfMonth(add(now, {months:1}));

// If you need strings in a specific format, for example:
    const startOfCurrentMonthStr = format(startOfCurrentMonth, "yyyy-MM-dd'T'HH:mm");
    const endOfCurrentMonthStr = format(endOfCurrentMonth, "yyyy-MM-dd'T'HH:mm");


    const [editData, setEditData] = useState({
        "subject": "",
        "creator": "user.uuid",
        "dateTimeStart": format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        "dateTimeEnd": format(addHours(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
        "attendees": [],
        "tags": [],
        "note": "",
        "fullDay": false,
        "important": false,
    });

    const handleOpenEditModal = async (d) => {
        await setEditData(d);
        console.log(editData)
        onOpen2();
    };


    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpen2 , onOpen: onOpen2, onClose: onClose2 } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    //const auth = useAuthUser()

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

    const [isLoading, setIsLoading] = useState(false)

    // LastChange is used to trigger a rerender in case another client created or modified an Item
    const [lastChange, setLastChange] = useState(new Date())

    //Socket joins a room named as the current familyId to receive real time updates on items.
    useEffect(() => {
        // Send a request to join a room
        socket.emit('join_room', user.linkedFamily);
        console.log(`Emitted "join Room" to Join the Room ${user.linkedFamily}....`)
    }, []);

    // on a trigger from the server (Socket.io), update lastChange to trigger a rerendering of the page
    socket.on("appointments", (arg) => {
        // console.log("Received Socket update because someone created a new Item ... "); // world
        // console.log(arg)
        // const res = arg.json()

        if (arg.userid === user.userUuid) {
            toast.success(`an Item has been ${arg.type} ...`, {
                toastId: arg.date,
                autoClose: 1500
            })
        }
        else {
            toast.info(`an Item has been ${arg.type} by user "${arg.user}" `, {
                toastId: arg.date
            })
        }
        setLastChange(arg)
    });

    const [ allEventsThisMonth , setAllEventsThisMonth ] = useState([])
    const [ allEventsNextMonth , setAllEventsNextMonth ] = useState([])

    // Defines the data to be used to create a new Appointment
    const [formData, setFormData] = useState({
        "subject": "",
        "creator": user.uuid,
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

            console.log(name, value) //debugging time error

            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    //TODO change backend URI to the correct one
    const devState = import.meta.env.VITE_DEVSTATE
    const backendURI = devState==='PROD' ? '/app' : 'http://localhost:3005';

    const [isError, setIsError] = useState(false)
    const [currentError, setCurrentError] = useState("")

    const createAppointment =  () => {
        console.log(JSON.stringify(user))
        async function writeData() {
            console.log(JSON.stringify(formData))
            const response = await fetch(`${backendURI}/api/calendar/`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "include", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    "family_uuid": user.linkedFamily
                },
                // redirect: "follow", // manual, *follow, error
                // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(formData), // body data type must match "Content-Type" header
            })
            if (response.status !== 200) {
                const errorData = await response.json();
                console.log(response.status);
                console.log(errorData.message);
                toast.error(errorData.message)

                // setCurrentError(errorData.message);
                // setIsError(true)
                throw new Error(errorData.message);
            }
            const res = await response.json();

            setNewAppointment(res)
            onClose()
            console.log(res)
        }
        writeData()
    }

    // Global fetch, Getting all appointments
    useEffect( () => {

        setIsLoading(true)

         globalFetch("calendar",JSON.stringify({
             $or: [
                 { dateTimeStart: { $gte: startOfCurrentMonth, $lte: endOfNextMonth } },
                 { dateTimeEnd: { $gte: startOfCurrentMonth, $lte: endOfNextMonth } }
             ]
         }) ,user.linkedFamily )



            .then(res => {

                //TODO filter by month and assign to state
                const currentMonthEvents = res.filter(event =>
                    event.dateTimeStart <= format(endOfCurrentMonth, "yyyy-MM-dd'T'23:59") &&
                    event.dateTimeEnd >= format(startOfCurrentMonth, "yyyy-MM-dd'T'23:59")
                )

                const nextMonthEvents = res.filter(event =>
                    event.dateTimeStart <= format(endOfNextMonth, "yyyy-MM-dd'T'23:59") &&
                    event.dateTimeEnd >= format(startOfNextMonth, "yyyy-MM-dd'T'23:59")
                )
                setAllEventsThisMonth(currentMonthEvents)
                setAllEventsNextMonth(nextMonthEvents)
                console.log("Current Month Events",res)
                setCurrentCalendar(res)
                setIsLoading(false)
            })



     },[newAppointment, lastChange])

    // Fetch all People in Family
    useEffect( () => {
            globalFetch("people", `{"linkedFamily":"${user.linkedFamily}"}` , user.linkedFamily )
                .then(res => setAllFamilyPeople(res))
        },[]);

    // Fetch all Tags in Family
    useEffect( () => {
        globalFetch("tags", `{"linkedFamily":"${user.linkedFamily}"}` , user.linkedFamily )
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
                        const res = await globalFetch("tags", `{"uuid" : "${tag}"}`, user.linkedFamily);
                        // console.log(res)
                        newTagNames[tag] = {name: res[0].tagName, color: res[0].tagColor}; // Assuming res.tagName is the format of your response
                    }
                }
            }
            console.log(`setting tagName to ${JSON.stringify(newTagNames)}`)
            setTagNames(newTagNames);
        };

        fetchTags();
    }, [currentCalendar, user.linkedFamily]);

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
                        const res = await globalFetch("people", `{"uuid" : "${tag}"}`, user.linkedFamily);
                        // console.log(res)
                        newUsers[tag] = res[0].nickName;
                    }
                }
            }
            console.log(`setting Users to ${JSON.stringify(newUsers)}`)
            setEventUsers(newUsers);
        };

        fetchUsers();
    }, [currentCalendar, user.linkedFamily]);

    // scroll to the current Day
    useEffect(() => {
        setTimeout(() => {scrollTo(format(now, "yyyy-MM-dd"))
            console.log('sent scrolling() with date: ', format(now, "yyyy-MM-dd"))}, 100)

    }, []);



    function scrollTo(data) {
        let date = new Date(data)
        let element = null
        let attempts = 0;

        do {
            const dateString = format(date, 'yyyy-MM-dd');
            element = document.getElementById(dateString);
            date = addDays(date, 1); // Go back one day
            attempts++;
        } while (!element && attempts < 30); // Prevent infinite loop by limiting attempts

        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    const isSameDay = moment(editData.dateTimeStart).isSame(editData.dateTimeEnd, 'day');

    async function deleteItem(uuid){
            console.log("deleting ...", uuid)
            globalDelete("calendar", uuid, "unused")
                .then(() => {onClose2()})
                .catch(e => console.log(e))
    }

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


                {/*CurrentMonth*/}

                {allEventsThisMonth.length != 0 &&
                <h2>
                    {format(now, "MMMM")}
                </h2>
                }

                {allEventsThisMonth.length === 0 &&
                    <h2 style={{ width: '50%', textAlign:'center' }}>
                        There are no appointments to display at the moment. Please add a new appointment.
                    </h2>
                }

                {isLoading && <Loading />}


                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                    {allEventsThisMonth.map((event) => (
                        <Appointment key={event.uuid} id={format(event.dateTimeStart,"yyyy-MM-dd" )} event={event} eventUsers={eventUsers} open={handleOpenEditModal} />
                    ))}
                    <div className="bg-white h-7"></div>
                </div>

                {/*NextMonth*/}

                {allEventsNextMonth.length != 0 &&
                <h2>
                   { !isLoading && format(startOfNextMonth, "MMMM")}
                </h2>
                }
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                    {allEventsNextMonth.map((event) => (
                        <Appointment key={event.uuid} id={format(event.dateTimeStart,"yyyy-MM-dd" )} event={event} eventUsers={eventUsers} open={handleOpenEditModal}  />
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
                <ModalContent w='90%' alignItems='center'>
                    <ModalHeader className='julius'>Add an appointment</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={3}>
                        <FormControl  w='90%'>
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
                    {isError && (<Alert status='error'>
                        <AlertIcon/>
                        <AlertTitle> Warning</AlertTitle>
                        <AlertDescription>{currentError}</AlertDescription>
                    </Alert>)}
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={createAppointment}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/*New Modal for Details and edit*/}
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen2}
                onClose={onClose2}
            >
                <ModalOverlay />
                <ModalContent w='90%' alignItems='center'>
                    <ModalHeader className='julius'>Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={3}>

                        <VStack mb='20px'>
                            {/*eventname*/}
                            <h1>{editData.subject}</h1>

                            <div>
                                <Box>
                                    {/*Date from to */}
                                    <Divider m="10px"/>
                                    { isSameDay ? (
                                            <p align="center">{moment(`${editData.dateTimeStart}`).format('dddd')}  -  {moment(`${editData.dateTimeStart}`).format('DD MMMM YYYY')} </p>
                                        )
                                        : (
                                            <p align="center">{moment(`${editData.dateTimeStart}`).format('DD MMMM YYYY')}  -  {moment(`${editData.dateTimeEnd}`).format('DD.MMMM.YYYY')} </p>
                                        )}
                                    {/*Start and End Time */}
                                    <Divider m="10px"/>
                                    { isSameDay ? (
                                        <p align="center">From {moment(`${editData.dateTimeStart}`).format('HH:mm')} to {moment(`${editData.dateTimeEnd}`).format('HH:mm')} </p>
                                        )
                                        : (
                                            <p>none</p>
                                        )}
                                    {/*notes*/}
                                    { editData.note ? (<>
                                        <Divider m="10px"/>
                                        <h3 align="center">{editData.note}</h3>
                                        </>
                                    ) : null}

                                    {/*Attendees*/}
                                    <Divider m="10px"/>

                                    <h3 className="flex flex-col items-center justify-center" >
                                        <p>Attendees:</p>
                                        <ul className="text-center">
                                        {editData.attendees.map((uuid, index) => (
                                               <li key={index}> {editData.allFamilyPeople[uuid]}</li>
                                        ))}
                                        </ul>
                                    </h3>

                                    <Divider m="10px"/>

                                    <p className="flex flex-col items-center justify-center">Created by : <li>{editData.createdBy}</li>
                                    </p>

                                    <Divider m="10px"/>

                                    {(user.isAdmin || user.isFamilyAdmin) && user.userUuid != editData.createdBy ? <p className="mt-10"> (You are not the creator, be careful editing)</p> : null }



                                    {/*debug*/}
                                    {/*<Divider m="10px"/>*/}
                                    {/*<p>{JSON.stringify(user.userUuid)}</p>*/}
                                    {/*<Divider m="10px"/>*/}

                                    {/*<p>{JSON.stringify(editData.allFamilyPeople)}</p>*/}

                                    {/*<Divider m="10px"/>*/}

                                </Box>
                            </div>
                        </VStack>

                    </ModalBody>
                    <ModalFooter>
                        <Button isDisabled={!(user.isAdmin || user.isFamilyAdmin || user.userUuid === editData.createdBy)}
                            leftIcon={<IoMdTrash />} colorScheme='red' mr={3} onClick={() => deleteItem(editData.uuid)}>
                            Delete
                        </Button>
                        <Button isDisabled colorScheme='blue' mr={3} onClick={onClose2}>
                        Modify
                        </Button>
                        <Button onClick={onClose2}>Cancel</Button>
                        </ModalFooter>
                </ModalContent>
            </Modal>


        </>
    );
}

export default AppointmentsPage;