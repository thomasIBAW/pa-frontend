import {useEffect, useState} from 'react';
import '@fontsource/julius-sans-one';
import {globalFetch} from "../hooks/Connectors.jsx";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import AppointmentSmall from "../components/Appointment_small.jsx";
import {format, add, endOfToday, endOfTomorrow} from "date-fns";


function HomePage() {

    const [eventUsers, setEventUsers] = useState([])
    const [ allEventsBoth , setAllEventsBoth ] = useState([])

    const [ allEventsToday , setAllEventsToday ] = useState([])
    const [ allEventsTomorrow , setAllEventsTomorrow ] = useState([])
    const auth = useAuthUser()

    console.log('Homepage received currentUser from context :', auth)

    const now = new Date()

    console.log('date',format(add(now, {days:1}),"yyyy-MM-dd'T'23:59"),format(now,"yyyy-MM-dd'T'00:00"))

    useEffect( () => {
        console.log('Hompage started globalFetch...')
        console.log("Auth calendars family:", auth.linkedFamily)

        globalFetch("calendar",JSON.stringify({
            dateTimeStart: {
                $lte: format(add(now, {days:1}),"yyyy-MM-dd'T'23:59") // Convert the current moment to an ISO string
            },
            dateTimeEnd: {
                $gte: format(now,"yyyy-MM-dd'T'00:00") // Convert the current moment to an ISO string
            }

            }), auth.linkedFamily )
            .then(res => {
                const resToday = res.filter( event => event.dateTimeStart <= format(now, "yyyy-MM-dd'T'23:59")  )
                const resTomorrow = res.filter(event =>
                    event.dateTimeStart <= format(add(now,{days:1}), "yyyy-MM-dd'T'23:59") &&
                    event.dateTimeEnd >= format(add(now, {days:1}) ,"yyyy-MM-dd'T'00:00")
                )
                setAllEventsToday(resToday)
                setAllEventsTomorrow(resTomorrow)
                setAllEventsBoth(res)
                console.log('Homepage response from Fetch : ', JSON.stringify(resToday))
            })

    },[auth])


    useEffect(() => {
        const fetchUsers = async () => {
            let newUsers = {};
            for (let event of allEventsBoth) {
                console.log(event)
                for (let tag of event.attendees) {
                    console.log(tag)
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
    }, [allEventsToday, allEventsTomorrow, auth.linkedFamily]);


    return (
        <>

            <center>
                <section className="pb-3">
                <h1>Hello {auth.username}</h1>
                    <p className="text-gray-500">Welcome to the Family Calendar </p>
                </section>
                <section className="bg-gray-50 pb-3">
                <h1>Today:</h1>
                <p className="text-gray-400">{allEventsToday.length===0 ? "Nothing for today :)" : null }</p>
                { allEventsToday.map(event => <AppointmentSmall key={event.uuid} event={event} eventUsers={eventUsers}/> ) }
                </section>
                <section className="bg-gray-50 pb-3">
                    <h1>Tomorrow:</h1>
                <p className="text-gray-400">{allEventsTomorrow.length===0 ? "Nothing planned for Tomorrow" : null }</p>

                { allEventsTomorrow.map(event => <AppointmentSmall key={event.uuid} event={event} eventUsers={eventUsers}/> ) }
                </section>
            </center>

        </>
    );
}

export default HomePage;