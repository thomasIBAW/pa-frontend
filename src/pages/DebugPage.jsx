import {Box, Divider} from "@chakra-ui/react";
import Socket from "./Socket.jsx";


function DebugPage() {

    const mode = import.meta.env.MODE
    const prod = import.meta.env.VITE_DEVSTATE



    return (
        <center>
        <h1>DEBUG page (admin only)</h1>
            <Box mb="10px" bgColor="lightcyan"><Socket />
            </Box>

            <Divider />
            <Box mb="10px" bgColor="lightcyan">
                <h2> Details Env Variables:</h2>
                <p> Current Mode : {mode}</p>
                <p> PROD Value : {prod}</p>
            </Box>
        </center>
    );
}

export default DebugPage;