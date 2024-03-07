import {useContext, useEffect, useState} from 'react';
import '@fontsource/julius-sans-one';
import UserContext from "../hooks/Context.jsx";
import {globalFetch} from "../hooks/Connectors.jsx";
import moment from "moment/moment.js";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';


function HomePage() {

    const {today, setToday} = useState([])
    const auth = useAuthUser()

   // const {currentUser } = useContext(UserContext);
    console.log('Homepage received currentUser from context :', auth)
    //
    // const currentUser = user

    console.log(auth)
    useEffect( () => {
        console.log('Hompage started globalFetch...')
        globalFetch("calendar",JSON.stringify({
            dateTimeEnd: {
                $gte: moment().toISOString() // Convert the current moment to an ISO string
            }}) , auth.linkedFamily )
            .then(res => {
                setToday(res)

                console.log('Homepage response from Fetch : ', JSON.stringify(res))
            })
    },[auth])


    return (
        <>

            <center>
                <h1>Hello {auth.username}</h1>
                <p>Welcome to the Family Calendar </p>
                <h1>appointments today:{today}</h1>
            </center>

        </>
    );
}

export default HomePage;