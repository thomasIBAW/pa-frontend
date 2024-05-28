import {useEffect, useState} from 'react';
import '@fontsource/julius-sans-one';
import {globalFetch} from "../hooks/Connectors.jsx";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import AppointmentSmall from "../components/Appointment_small.jsx";
import {format, add, endOfToday, endOfTomorrow} from "date-fns";
import Loading from "../components/Loading.jsx";
import {socket} from "../socket.js";
import {useCookies} from "react-cookie";
import {toast} from "react-toastify";


function HomePage() {

    const [isLoading, setIsLoading] = useState(false)
    const [eventUsers, setEventUsers] = useState([])
    const [ allEventsBoth , setAllEventsBoth ] = useState([])

    const [ allEventsToday , setAllEventsToday ] = useState([])
    const [ allEventsTomorrow , setAllEventsTomorrow ] = useState([])

    const [cookie] = useCookies()
    const [user , setUser] = useState(cookie.fc_user)

    //const auth = useAuthUser()

    console.log('Homepage received currentUser from context :', user)

    // LastChange is used to trigger a rerender in case another client created or modified an Item
    const [lastChange, setLastChange] = useState(new Date())

    // on a trigger from the server (Socket.io), update lastChange to trigger a rerendering of the page
    socket.on("appointments", (arg) => {
        console.log("Received Socket update because someone created a new Item ... "); // world
        console.log(arg)
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
        setLastChange(arg.date)
    });

    //Socket joins a room named as the current familyId to receive real time updates on items.
    useEffect(() => {
        // Send a request to join a room
        socket.emit('join_room', user.linkedFamily);
    }, []);

    // on a trigger from the server (Socket.io), update lastChange to trigger a rerendering of the page
    // socket.on("appointments", (arg) => {
    //     console.log("Received Socket update because someone created a new Item ... "); // world
    //     // toast.info("New Appoiments has been added...")
    //     setLastChange(arg)
    // });


    const now = new Date()

    console.log('date',format(add(now, {days:1}),"yyyy-MM-dd'T'23:59"),format(now,"yyyy-MM-dd'T'00:00"))

    useEffect( () => {
        console.log('Hompage started globalFetch...')
        console.log("Auth calendars family:", user.linkedFamily)
        setIsLoading(true)
        globalFetch("calendar",JSON.stringify({
            dateTimeStart: {
                $lte: format(add(now, {days:1}),"yyyy-MM-dd'T'23:59") // Convert the current moment to an ISO string
            },
            dateTimeEnd: {
                $gte: format(now,"yyyy-MM-dd'T'00:00") // Convert the current moment to an ISO string
            }

            }), "" )
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
                setIsLoading(false)
            })

    },[user, lastChange])


    useEffect(() => {
        const fetchUsers = async () => {
            let newUsers = {};
            for (let event of allEventsBoth) {
                console.log(event)
                for (let tag of event.attendees) {
                    console.log(tag)
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
    }, [allEventsToday, allEventsTomorrow, user.linkedFamily]);


    return (
        <>

            <center>
                <section className="pb-3">
                <h1>Hello {user.username}</h1>
                    <p className="text-gray-500">Welcome to the Family Calendar </p>
                </section>
                <section className="bg-gray-50 pb-3">
                <h1>Today:</h1>
                    {isLoading && <Loading />}
                <p className="text-gray-400">{allEventsToday.length===0 && !isLoading ? "Nothing for today :)" : null }</p>
                { allEventsToday.map(event => <AppointmentSmall key={event.uuid} event={event} eventUsers={eventUsers}/> ) }
                </section>
                <section className="bg-gray-50 pb-3">
                    <h1>Tomorrow:</h1>
                    {isLoading && <Loading />}
                <p className="text-gray-400">{allEventsTomorrow.length===0 && !isLoading ? "Nothing planned for Tomorrow" : null }</p>

                { allEventsTomorrow.map(event => <AppointmentSmall key={event.uuid} event={event} eventUsers={eventUsers}/> ) }
                </section>
            </center>

        </>
    );
}

export default HomePage;