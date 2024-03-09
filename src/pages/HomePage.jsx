import {useEffect, useState} from 'react';
import '@fontsource/julius-sans-one';
import {globalFetch} from "../hooks/Connectors.jsx";
import moment from "moment/moment.js";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import Appointment from "../components/Appointment.jsx";
import AppointmentSmall from "../components/Appointment_small.jsx";


function HomePage() {

    const [eventUsers, setEventUsers] = useState([])
    const [ allEventsToday , setAllEventsToday ] = useState([])
    const auth = useAuthUser()

    console.log('Homepage received currentUser from context :', auth)




    useEffect( () => {
        console.log('Hompage started globalFetch...')
        globalFetch("calendar",JSON.stringify({
            dateTimeStart: {
                $lte: moment().format('YYYY-MM-DDT23:59') // Convert the current moment to an ISO string
            },
            dateTimeEnd: {
                $gte: moment().format('YYYY-MM-DDTHH:mm') // Convert the current moment to an ISO string
            }

            }) , auth.linkedFamily )
            .then(res => {
                setAllEventsToday(res)
                console.log('Homepage response from Fetch : ', JSON.stringify(res))
            })

    },[auth])


    useEffect(() => {
        const fetchUsers = async () => {
            let newUsers = {};

            for (let event of allEventsToday) {
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
    }, [allEventsToday, auth.linkedFamily]);


    return (
        <>

            <center>
                <h1>Hello {auth.username}</h1>
                <p>Welcome to the Family Calendar </p>
                <h1>Today:</h1>
                { allEventsToday.map(event => <AppointmentSmall key={event.uuid} event={event} eventUsers={eventUsers}/> ) }
            </center>

        </>
    );
}

export default HomePage;