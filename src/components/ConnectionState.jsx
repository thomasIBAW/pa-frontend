import {useEffect, useState} from 'react';
import {socket} from "../socket.js";

export function ConnectionState({ isConnected }) {

    const [lastChange, setLastChange] = useState(new Date())

    useEffect(() => {
        console.log("This means the EffectHook has been called due to new Event", lastChange)
    }, [lastChange]);

    socket.on("appointments", (arg) => {
        console.log(arg); // world
        setLastChange(arg)
    });

    const URL = import.meta.env.MODE === 'production' ? 'api.backend.famcal.ch/socket.io' : 'http://localhost:3005';

    return (
<>
        <p>State: { 'Sockets connection is ' + isConnected }</p>
        <p> Last change : {JSON.stringify(lastChange)}</p>
    <p>{import.meta.env.MODE} - Socket target {URL}</p>
</>
    )
}