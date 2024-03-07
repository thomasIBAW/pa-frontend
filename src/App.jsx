
import './App.css'
import '@fontsource/julius-sans-one';
import Cookies from "universal-cookie";
import Login from "./components/Login.jsx";
import LoggedIn from "./pages/LoggedIn.jsx";
import React, {useEffect, useState} from 'react'
import {Box, SkeletonCircle, SkeletonText} from "@chakra-ui/react";
import UserContext from "./hooks/Context.jsx";
import Loading from "./components/Loading.jsx";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import loggedIn from "./pages/LoggedIn.jsx";
function App() {
    const auth = useAuthUser()
    //Get user Cookie from the browser to check if the user is logged in or not
    // const cookies = new Cookies()
    // const user = cookies.get("currentUser")
    // const [loggedIn, setLoggedIn] = useState(null)
    // const [currentUser, setCurrentUser] = useState({})
    // //added timeout to allow page to load //TODO Remove and use something like onLoaded ...
    //
    // useEffect(() => {
    //     user ? setLoggedIn(true) : setLoggedIn(false)
    // }, []);

    // setTimeout(() => {
    //     user ? setLoggedIn(true) : setLoggedIn(false)
    //    // console.log(user, loggedIn)
    // }, 100)

    // console.log(user, loggedIn, currentUser)
  return (
    <>
{/*<UserContext.Provider value={{currentUser, setCurrentUser}}>*/}
        {auth == null && <Login />}
        {auth != null && <LoggedIn />}
{/*</UserContext.Provider>*/}

    </>
  )
}

export default App
