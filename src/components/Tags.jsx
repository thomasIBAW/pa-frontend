import React, {useState} from 'react';
import Cookies from "universal-cookie";
function Tags(props) {
    const [apiKey , setApiKey]     = useState("")
    const [user, setUser] = useState({})

    const cookies = new Cookies()
    
    const apiCookie = cookies.get("jwt_auth")

    return (

        <center>
            <h1>Tags</h1>
            <p></p>
        </center>
    );
}                                   

export default Tags;