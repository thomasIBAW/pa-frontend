import {useContext, useEffect, useState} from 'react';
import '@fontsource/julius-sans-one';
import UserContext from "../hooks/Context.jsx";
import {globalFetch} from "../hooks/Connectors.jsx";
import moment from "moment/moment.js";


function HomePage() {

    const {today, setToday } = useState([])

    const {currentUser } = useContext(UserContext);
    console.log('Homepage received currentUser from context :', currentUser)
    //
    // const currentUser = user


    useEffect( () => {
        console.log('Hompage started globalFetch...')
        globalFetch("calendar",JSON.stringify({
            dateTimeEnd: {
                $gte: moment().toISOString() // Convert the current moment to an ISO string
            }}) , currentUser.linkedFamily )
            .then(res => {
                console.log('Homepage response from Fetch :', JSON.stringify(res) );
                setToday(res)
            })
    },[currentUser])


    return (
        <>

            <center>
                <h1>Hello {currentUser.username}</h1>
                <p>Welcome to the Family Calendar </p>
                <h1>appointments today:{today}</h1>
            </center>

        </>
    );
}

export default HomePage;