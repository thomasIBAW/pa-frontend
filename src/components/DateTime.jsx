import {useState} from 'react';
import moment from "moment";
import {Box} from "@chakra-ui/react";


function DateTime() {

const [time, setTime] = useState("")

    setInterval(()=> {
        setTime(moment().format('ddd DD.MM.YYYY @ HH:mm'))
    }, 1000 )

    return (
        <Box as="p">{time}</Box>
    );
}

export default DateTime;