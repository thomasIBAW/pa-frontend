import React from 'react';
import {Button} from "@chakra-ui/react";

//TODO change backend URI to the correct one
const backendURI = 'http://localhost:3005/login'

const tempCred= {
    username: "thomas",
    password: "941519"
}
async function login() {
    const response= await fetch(backendURI, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "no-cors", // no-cors, *cors, same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json"
        },
        // redirect: "follow", // manual, *follow, error
        // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(tempCred), // body data type must match "Content-Type" header
    })
    console.log(response)
    const res =  response.json()
    console.log(res)
    const api_key = res.token
}

function Login(props) {
    return (
        <div>
            Login Form
            <Button onClick={login}>Login</Button>
        </div>
    );
}

export default Login;