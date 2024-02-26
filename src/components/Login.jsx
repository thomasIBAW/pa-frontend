import React, {useState} from 'react';
import {Box, Button} from "@chakra-ui/react";
import Cookies from "universal-cookie";
import {jwtDecode} from "jwt-decode"

//TODO change backend URI to the correct one
const backendURI = 'http://127.0.0.1:3005/login'

const tempCred= {
    "username": "thomas",
    "password": "941519"
}

const cookies = new Cookies()


function Login(props) {
    const [api_key, setApi] = useState("")
    const [user, setUser] = useState(null)

    async function login() {

        const response= await fetch( backendURI , {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            // mode: "cors", // no-cors, *cors, same-origin
            // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(tempCred), // body data type must match "Content-Type" header
        });

        const res = await response.json();
        const decoded = await jwtDecode(res.token)

        setUser(decoded)
        setApi(res.token)

        cookies.set("jwt_auth", res.token, {
            expires: new Date(decoded.exp * 1000)
        })
        cookies.set("currentUser", decoded.username , {
            expires: new Date(decoded.exp * 1000)
        })

    }
    async function logout() {
        setUser(null)
        setApi("")
        cookies.remove("jwt_auth")
        cookies.remove("currentUser")
    }

    return (
        <div>
            {user ? <Button onClick={logout}>Logout</Button> : <Button onClick={login}>Login</Button>}
            {/*{api_key && <Box> Api Key : {api_key}</Box>}*/}
            {user && <Box>User : {user.username}</Box>}
        </div>
    );
}

export default Login;