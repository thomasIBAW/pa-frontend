import {Box} from "@chakra-ui/react";
import Socket from "./Socket.jsx";


function TodoPage() {

    const mode = import.meta.env.MODE
    const prod = import.meta.env.PROD



    return (
        <center>
        <h1>TodoPage</h1>
            <Socket />
            <Box> Current Mode : {mode}</Box>
            <Box> PROD Value : {prod}</Box>
        </center>
    );
}

export default TodoPage;