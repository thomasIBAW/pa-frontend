
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
import {useCookies} from "react-cookie";
import DebugPage from "./DebugPage.jsx";


function LoggedIn() {
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    // const navigate = useNavigate()
    // const signout = useSignOut()


    const [cookie] = useCookies()
    const [user , setUser] = useState(cookie.fc_user)
    // const handlerLogin = () => {
    //
    //     setIsLoggedIn(true)
    //     console.log("loggedIn handler for Login...")
    //     navigate("/")
    //
    // }
    //
    // const handlerLogout = () => {
    //     setIsLoggedIn(false)
    //     //console.log("loggedIn handler for Logout...")
    //     //signout()
    //
    //     //TODO call logout on serverside or delete all cookies
    //
    //
    // }




    return (
        <>
            <Header />
            <Routes>

                    <Route path="/home" element={<HomePage />} />
                    <Route path="/me" element={<MePage />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    <Route path="/todos" element={<TodoPage />} />
                    <Route path="/debug" element={<DebugPage />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/calendar" element={<CalendarPage />} />

                </Routes>

            {user ? <Footer/> : <Navigate to="/login" /> }

        </>
    )
}

export default LoggedIn
