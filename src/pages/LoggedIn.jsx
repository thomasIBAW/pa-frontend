
import {Box} from "@chakra-ui/react";
import Header from "../components/Header.jsx";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import HomePage from "./HomePage.jsx";
import MePage from "./MePage.jsx";
import AppointmentsPage from "./AppointmentsPage.jsx";
import TodoPage from "./TodoPage.jsx";
import '@fontsource/julius-sans-one';
import Footer from "../components/Footer.jsx";
import Settings from "./Settings.jsx";
import {useContext, useEffect, useState} from "react";
import UserContext from "../hooks/Context.jsx";
import {jwtDecode} from "jwt-decode";
import CalendarPage from "./CalendarPage.jsx";
import {globalFetch} from "../hooks/Connectors.jsx";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import Login from "../components/Login.jsx";
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useSignOut from "react-auth-kit/hooks/useSignOut";


function LoggedIn() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()
    const signout = useSignOut()
    const handlerLogin = () => {

        setIsLoggedIn(true)
        console.log("loggedIn handler for Login...")
        navigate("/")

    }

    const handlerLogout = () => {
        setIsLoggedIn(false)
        console.log("loggedIn handler for Logout...")
        signout()

        //TODO call logout on serverside or delete all cookies


    }


    // TODO Add a check to confirm the user in the backend
    //Get Current user from the jwt token
    // const cookies = new Cookies()
    // const apiKey = cookies.get("jwt_auth")
    // const decodedUser = jwtDecode(apiKey)
    // console.log(decodedUser)
    // const {currentUser, setCurrentUser} = useContext(UserContext)
    // useEffect( () => {
    //     // TODO Old part to be removed later
    //     // async function fetchData() {
    //     //     const response = await fetch(`${backendURI}/api/users/find`, {
    //     //         method: "POST", // *GET, POST, PUT, DELETE, etc.
    //     //         // mode: "cors", // no-cors, *cors, same-origin
    //     //         // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //     //         // credentials: "same-origin", // include, *same-origin, omit
    //     //         headers: {
    //     //             "Content-Type": "application/json",
    //     //             "api_key": apiKey
    //     //         },
    //     //         // redirect: "follow", // manual, *follow, error
    //     //         // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //     //         body: JSON.stringify({uuid:decodedUser.userUuid}), // body data type must match "Content-Type" header
    //     //     })
    //     //     if (response.status !== 200) {
    //     //         // setError("incorrect")
    //     //         console.log(response.status)
    //     //         return
    //     //     }
    //     //     const res = await response.json();
    //
    //     console.log("LoggedIn Fetches for : users", "filter",`${auth.userUuid}`, auth.linkedFamily )
    //     const filter = {
    //         uuid:auth.userUuid
    //     }
    //     // setCurrentUser(auth)
    //
    //     globalFetch("users", JSON.stringify(filter),auth.linkedFamily )
    //         .then(res => {
    //             res[0].password = null;
    //             setCurrentUser(res[0])
    //             console.log("currentUser has been set to: ", res[0])
    //         })
    //         .catch(e => console.log(e))
    //
    //
    // },[])


    return (
        <>
            <Header onLogout={handlerLogout}/>
            <Routes>
                <Route element={<AuthOutlet fallbackPath='/login' />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/me" element={<MePage />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    <Route path="/todos" element={<TodoPage />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                </Route>
                </Routes>
            <Footer />

        </>
    )
}

export default LoggedIn
