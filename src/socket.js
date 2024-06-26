import { io } from 'socket.io-client';

import Cookies from 'js-cookie'

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.MODE === "development" ? 'http://localhost:3005' : '/';

let user = {}

if (Cookies.get('fc_user')) {
    user = JSON.parse(Cookies.get('fc_user')) // => 'value'
    console.log(user, user.username)
} else {
    user = {username: "none", userUuid: "none"}
}

export const socket = io(URL, {
    extraHeaders: {
        "user_uuid": user.userUuid ,
        "user_name": user.username

    }
});

