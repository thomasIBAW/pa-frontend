import React, {useContext} from 'react';
import '@fontsource/julius-sans-one';
import Cookies from "universal-cookie";
import UserContext from "../hooks/Contect.jsx";
function HomePage() {
    const cookies = new Cookies()
    // const encodedString = cookies.get("currentUser")
    // const decodedString = decodeURIComponent(encodedString)
    // const user= JSON.parse(encodedString)
    const {currentUser, setCurrentUser } = useContext(UserContext);

    console.log(currentUser)
    return (
        <>

            <center>
                <h1>Dashboard</h1>
                <p>Welcome</p>
            </center>

        </>
    );
}

export default HomePage;