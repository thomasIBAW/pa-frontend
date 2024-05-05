
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

function App() {

    const auth = useAuthUser()
    const [loggedIn, setLoggedIn] = useState(false)

    const cookies = new Cookies()
    const apiKey = cookies.get("_auth")

    if (apiKey) {
        const decodedUser = jwtDecode(apiKey)
        console.log(decodedUser)
    } else console.log("nokey")

    return (
    <>


        <Routes>
            <Route path="/login" element={ auth ? <Navigate to="/" />: <Login />} />
            <Route path="/registration" element={ auth ? <Navigate to="/" />: <Registration />} />
            <Route path="*" element={ auth ? <LoggedIn />: <Navigate to="/login" /> } />
        </Routes>

        {/*{auth == null && <Login />}*/}
        {/*{auth != null && <LoggedIn />}*/}

    </>
  )
}

export default App
