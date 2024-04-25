import React from 'react';

export function ConnectionState({ isConnected }) {
    return <p>State: { 'Sockets connection is ' + isConnected }</p>;
}