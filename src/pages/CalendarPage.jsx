import {Fragment, useEffect, useState} from 'react'
import {Box, Center} from "@chakra-ui/react";
import {globalFetch} from "../hooks/Connectors.jsx";
import moment from "moment";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import Loading from "../components/Loading.jsx";




export default function CalendarPage() {
    const auth = useAuthUser()
    // eventUsers are the users in the Appointments we show
    const [eventUsers, setEventUsers] = useState({})
    // currentCalendar has all the current Appointments (today+)
    const [currentCalendar, setCurrentCalendar] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect( () => {
        setIsLoading(true)
        globalFetch("calendar",JSON.stringify({
            dateTimeEnd: {
                $gte: moment().toISOString() // Convert the current moment to an ISO string
            }}) ,auth.linkedFamily )
            .then(res => {
                setCurrentCalendar(res)
                setIsLoading(false)
            })
    },[])


    // fetches Users from the events
    useEffect(() => {
        const fetchUsers = async () => {
            let newUsers = {};

            for (let event of currentCalendar) {
                // console.log(event)
                for (let tag of event.attendees) {
                    // console.log(tag)
                    // Assuming globalFetch does not duplicate requests for already fetched tags
                    if (!newUsers[tag]) {
                        const res = await globalFetch("people", `{"uuid" : "${tag}"}`, auth.linkedFamily);
                        // console.log(res)
                        newUsers[tag] = res[0].nickName;
                    }
                }
            }
            console.log(`setting Users to ${JSON.stringify(newUsers)}`)
            setEventUsers(newUsers);
        };

        fetchUsers();
    }, [currentCalendar]);

    const monthDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
    return (
      <>
          <Center>
              <Box className="tbcontainer">
                  { monthDays.map( (day) => (
                      <Box key={day} style={{ gridRowStart: day, gridRowEnd: day+2,  }} className={`item-a`}>
                          {day}
                      </Box>
                  ))
                  }

                  {isLoading && <Loading />}

                  {
                      currentCalendar.map((event) => (
                          <Box key={event.uuid} className={`eventItem`} style={{ gridRowStart: moment(event.dateTimeStart).format("DD") , gridRowEnd: moment(event.dateTimeEnd).format("DD")}} >
                              {event.subject}
                          </Box>
                      ))
                  }

                  <Box className="eventItem" style={{ gridRowStart: 17 }}>
                      Demo appointment uno
                  </Box>


              </Box>
          </Center>
      </>
    )
}
