
import './App.css'
import '@fontsource/julius-sans-one';
import Cookies from "universal-cookie";
import Login from "./components/Login.jsx";
import LoggedIn from "./pages/LoggedIn.jsx";
import React, { useState} from 'react'
import {Box, SkeletonCircle, SkeletonText} from "@chakra-ui/react";
import UserContext from "./hooks/Context.jsx";
import Loading from "./components/Loading.jsx";
function App() {

    //Get user Cookie from the browser to check if the user is logged in or not
    const cookies = new Cookies()
    const user = cookies.get("currentUser")
    const [loggedIn, setLoggedIn] = useState(null)
    const [currentUser, setCurrentUser] = useState({})
    //added timeout to allow page to load //TODO Remove and use something like onLoaded ...
    setTimeout(() => {
        user ? setLoggedIn(true) : setLoggedIn(false)
       // console.log(user, loggedIn)
    }, 100)

    // console.log(user, loggedIn, currentUser)
  return (
    <>
<UserContext.Provider value={{currentUser, setCurrentUser}}>
        {loggedIn == null && <Loading></Loading>}
        {loggedIn != null && (loggedIn ? <LoggedIn></LoggedIn> : <Login set={setLoggedIn} ></Login>)}
</UserContext.Provider>

    </>
  )
}

export default App
