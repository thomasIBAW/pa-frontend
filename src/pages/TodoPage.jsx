import {Box, Divider} from "@chakra-ui/react";
import Socket from "./Socket.jsx";


function TodoPage() {

    const mode = import.meta.env.MODE
    const prod = import.meta.env.VITE_DEVSTATE



    return (
        <center>
        <h1>Temp. DEBUG page</h1>
            <Socket />
            <Divider />
            <h2> Details Env Variables:</h2>
            <p> Current Mode : {mode}</p>
            <p> PROD Value : {prod}</p>
        </center>
    );
}

export default TodoPage;