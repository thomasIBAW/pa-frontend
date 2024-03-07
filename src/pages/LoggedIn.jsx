
import {Box} from "@chakra-ui/react";
import Header from "../components/Header.jsx";
import {Route, Routes} from "react-router-dom";
import HomePage from "./HomePage.jsx";
import MePage from "./MePage.jsx";
import AppointmentsPage from "./AppointmentsPage.jsx";
import TodoPage from "./TodoPage.jsx";
import '@fontsource/julius-sans-one';
import Cookies from "universal-cookie";
import Footer from "../components/Footer.jsx";
import Settings from "./Settings.jsx";
import {useContext, useEffect} from "react";
import UserContext from "../hooks/Context.jsx";
import {jwtDecode} from "jwt-decode";
import CalendarPage from "./CalendarPage.jsx";
import {globalFetch} from "../hooks/Connectors.jsx";

function LoggedIn() {

    //Get Current user from the jwt token
    const cookies = new Cookies()
    const apiKey = cookies.get("jwt_auth")
    const decodedUser = jwtDecode(apiKey)
    // console.log(decodedUser)

    const {currentUser, setCurrentUser} = useContext(UserContext)

    useEffect( () => {
        // TODO Old part to be removed later
        // async function fetchData() {
        //     const response = await fetch(`${backendURI}/api/users/find`, {
        //         method: "POST", // *GET, POST, PUT, DELETE, etc.
        //         // mode: "cors", // no-cors, *cors, same-origin
        //         // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        //         // credentials: "same-origin", // include, *same-origin, omit
        //         headers: {
        //             "Content-Type": "application/json",
        //             "api_key": apiKey
        //         },
        //         // redirect: "follow", // manual, *follow, error
        //         // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //         body: JSON.stringify({uuid:decodedUser.userUuid}), // body data type must match "Content-Type" header
        //     })
        //     if (response.status !== 200) {
        //         // setError("incorrect")
        //         console.log(response.status)
        //         return
        //     }
        //     const res = await response.json();

        console.log("LoggedIn Fetchtes for : users", "filter",`${decodedUser.userUuid}`, decodedUser.linkedFamily )
        const filter = {
            uuid:decodedUser.userUuid
        }
        setCurrentUser(decodedUser)

        globalFetch("users", JSON.stringify(filter),decodedUser.linkedFamily )
            .then(res => {
                res[0].password = null;
                setCurrentUser(res[0])
                console.log("currentUser has been set to: ", res[0])
            })
            .catch(e => console.log(e))


    },[])




    // //TODO change backend URI to the correct one
    // const backendURI = 'http://127.0.0.1:3005/api/users/find';
    // let myUser = {};
    // (async function() {
    //     const response = await fetch(backendURI, {
    //         method: "POST", // *GET, POST, PUT, DELETE, etc.
    //         // mode: "cors", // no-cors, *cors, same-origin
    //         // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //         credentials: "same-origin", // include, *same-origin, omit
    //         headers: {
    //             "Content-Type": "application/json",
    //             "api_key": apiKey
    //         },
    //         redirect: "follow", // manual, *follow, error
    //         referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //         body: JSON.stringify({"uuid": decodedUser.userUuid}), // body data type must match "Content-Type" header
    //     });
    //
    //     if (response.status !== 200) {
    //         setError("incorrect")
    //         console.log(response.status)
    //         return
    //     }
    //     const res = await response.json();
    //     console.log(res[0])
    //     myUser = res[0]
    //     // setCurrentUser(res[0])
    // }) ();

    //
    // (async function() {
    //     const response= await fetch( backendURI , {
    //         method: "POST", // *GET, POST, PUT, DELETE, etc.
    //         // mode: "cors", // no-cors, *cors, same-origin
    //         // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //         credentials: "same-origin", // include, *same-origin, omit
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         redirect: "follow", // manual, *follow, error
    //         referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //         body: JSON.stringify(formData), // body data type must match "Content-Type" header
    //     });
    //
    //     if (response.status !== 200) {
    //         setError("incorrect")
    //         console.log(response.status)
    //         return
    //     }
    //     const res = await response.json();
    //     const decoded = await jwtDecode(res.token)
    //
    //     // setUser(decoded)
    //     // setApi(res.token)
    //     set(true) //Set loggedIn State in App.jsx to true
    //
    //     setCurrentUser(JSON.stringify(decoded))
    //     setError(null)
    //     setFormData({username:"", password:""});
    // })()

    return (
        <>
            <Header />
            <Routes>
                <Route path="/home" element={<HomePage user={currentUser}/>} />
                <Route path="/me" element={<MePage user={currentUser}/>} />
                <Route path="/appointments" element={<AppointmentsPage user={currentUser}/>} />
                <Route path="/todos" element={<TodoPage user={currentUser}/>} />
                <Route path="/settings" element={<Settings user={currentUser}/>} />
                <Route path="/calendar" element={<CalendarPage user={currentUser}/>} />
            </Routes>
            <Footer />

        </>
    )
}

export default LoggedIn
