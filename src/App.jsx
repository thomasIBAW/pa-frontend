
import './App.css'
import '@fontsource/julius-sans-one';
import Login from "./components/Login.jsx";
import LoggedIn from "./pages/LoggedIn.jsx";

import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {useEffect, useState} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Registration from "./pages/Registration.jsx";
import Cookies from "universal-cookie";
import {jwtDecode} from "jwt-decode";
import { useCookies } from 'react-cookie'
import '@fontsource-variable/lexend';
// import "@fontsource/lexend"; // Defaults to weight 400
// import "@fontsource/lexend/400.css"; // Specify weight
// import "@fontsource/lexend/400-italic.css"; // Specify weight and style

function App() {

    // cookies using react-cookie - reworking
    const [cookie] = useCookies(['fc_user'])
    const [isAuth, setIsAuth] = useState(false)

    //const auth = useAuthUser()

    // const cookies = new Cookies()
    // const apiKey = cookies.get("_auth")

    // if (apiKey) {
    //     const decodedUser = jwtDecode(apiKey)
    //     console.log(decodedUser)
    // } else console.log("nokey")

    useEffect(() =>
        {
            if(cookie.fc_user) {
                console.log("token cookie is available", cookie)
                setIsAuth(true)
            } else {console.log("no cookie")
            setIsAuth(false)
            }

}, [cookie]);

    return (
    <>
        <Routes>
            <Route path="/login" element={ isAuth ? <Navigate to="/home" />: <Login />} />
            <Route path="/registration" element={ isAuth ? <Navigate to="/home" />: <Registration />} />
            <Route path="*" element={ isAuth ? <LoggedIn />: <Navigate to="/login" /> } />
        </Routes>

        {/*{auth == null && <Login />}*/}
        {/*{auth != null && <LoggedIn />}*/}


    </>
  )
}

export default App
