import Cookies from "universal-cookie";
import UserContext from "./Context.jsx";
import {useContext} from "react";
import React from 'react';

//Get token from Cookie
const cookies = new Cookies()
const apiKey = cookies.get("jwt_auth")


//TODO change backend URI to the correct one
const backendURI = 'http://127.0.0.1:3005';


export default async function globalFetch(endpoint, filter, family) {

    console.log(`"globalFetch()" received the following params: endpoint: ${endpoint} / filter ${filter} / family_uuid: ${family}`)
    //console.log(`${backendURI}/api/${endpoint}/find`)
    const response = await fetch(`${backendURI}/api/${endpoint}/find`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            "api_key": apiKey,
            "family_uuid": family
        },
        // redirect: "follow", // manual, *follow, error
        // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: filter, // body data type must match "Content-Type" header
    })
    if (response.status !== 200) {
        // setError("incorrect")
        console.log(response.status)
        return
    }
    const res = await response.json();

    console.log(`Response from "${endpoint}" globalFetch is: `, res)
    return res
    //console.log(res)
}