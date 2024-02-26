
import './App.css'
import '@fontsource/julius-sans-one';
import Cookies from "universal-cookie";
import Login from "./components/Login.jsx";
import LoggedIn from "./pages/LoggedIn.jsx";
import React, { useState} from 'react'
import {Box, SkeletonCircle, SkeletonText} from "@chakra-ui/react";
import Loading from "./components/Loading.jsx";
function App() {

    //Get user Cookie from the browser to check if the user is logged in or not
    const cookies = new Cookies()
    const user = cookies.get("currentUser")
    const [loggedIn, setLoggedIn] = useState(null)

    //added timeout to allow page to load //TODO Remove and use something like onLoaded ...
    setTimeout(() => {
        user ? setLoggedIn(true) : setLoggedIn(false)
        console.log(user, loggedIn)
    }, 100)


  return (
    <>
        {loggedIn == null && <Loading></Loading>}

        {loggedIn != null && (loggedIn ? <LoggedIn user={user}></LoggedIn> : <Login set={setLoggedIn}></Login>)}


    </>
  )
}

export default App
