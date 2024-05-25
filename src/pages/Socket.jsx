import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import { ConnectionState } from '../components/ConnectionState';
import { ConnectionManager } from '../components/ConnectionManager';
import { Events } from "../components/Events";
import {Box} from "@chakra-ui/react";

export default function Socket() {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true)
            // Send a request to join a room
            console.log("sending request to join ...")
            socket.emit('join_room', 'fc_debug');
        }

        function onDisconnect() {
            setIsConnected(false);
        }



        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <div className="App">
            <h2> Information about the Socket.io connection</h2>
            <ConnectionState isConnected={ isConnected } />


            <h2>Connection Manager</h2>
            <ConnectionManager />
        </div>
    );
}