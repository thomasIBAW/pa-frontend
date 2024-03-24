
import './App.css'
import '@fontsource/julius-sans-one';
import Login from "./components/Login.jsx";
import LoggedIn from "./pages/LoggedIn.jsx";

import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {useEffect, useState} from "react";
import {Navigate, Route, Routes} from "react-router-dom";

function App() {

    const auth = useAuthUser()
    const [loggedIn, setLoggedIn] = useState(false)



    return (
    <>


        <Routes>

            <Route path="/login" element={ auth ? <Navigate to="/" />: <Login />} />
            <Route path="*" element={ auth ? <LoggedIn />: <Navigate to="/login" /> } />
        </Routes>

        {/*{auth == null && <Login />}*/}
        {/*{auth != null && <LoggedIn />}*/}

    </>
  )
}

export default App
