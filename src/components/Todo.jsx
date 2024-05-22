import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Image,
    Flex,
    Avatar,
    Box,
    Heading,
    Text,
    IconButton,
    Button
} from '@chakra-ui/react'
import {BsThreeDotsVertical} from "react-icons/bs";
import {BiChat, BiLike, BiShare} from "react-icons/bi";
import moment from "moment/moment.js";
import React from "react";
import {IoSettingsOutline} from "react-icons/io5";

function Todo({event, eventUsers, open}) {

    const isToday = moment(`${event.deadline}`).format('yyyy-MM-ddThh:mm') === moment().format('yyyy-MM-ddThh:mm')
    const allData = {...event, allFamilyPeople:eventUsers}
    //console.log(allData)

    return (
        <>
            <Card maxW="lg" border="1px solid lightgray" onClick={() => open(allData)} >
                <CardHeader>
                    <Flex spacing='4'>
                        <Flex flex='1' gap='6' alignItems='center' flexWrap='wrap'>
                            {/*DateBox, TimeBox*/}
                            {/*<Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />*/}

                            {isToday ?
                                <Box fontSize="lg" fontWeight="Bold" border="2px solid #e6c997" borderRadius="10px" padding="10px" width="60px" textAlign="center">

                                    <Text fontSize="sm" >{moment(`${event.deadline}`).format('ddd')}</Text>
                                    <p className=" text-sm text-center font-extrabold text-gray-900">{moment(`${event.deadline}`).format('DD.')}</p>
                                </Box> :
                                <Box fontSize="lg" fontWeight="Bold" border="1px solid lightgray" borderRadius="10px" padding="10px" width="60px" textAlign="center">
                                    <Text fontSize="sm" >{moment(`${event.deadline}`).format('ddd')}</Text>
                                    <p className=" text-sm text-center font-extrabold text-gray-900">{moment(`${event.deadline}`).format('DD.')}</p>
                                </Box>
                            }

                            {/*Time Information*/}

                            {/*<Box width="50px" textAlign="center">*/}
                            {/*    <p>Time</p>*/}
                            {/*    <p className="text-sm text-gray-900">{moment(`${event.dateTimeStart}`).format('HH:mm')}</p>*/}
                            {/*    <p>-</p>*/}
                            {/*    <p className=" text-sm text-gray-500">{moment(`${event.dateTimeEnd}`).format('HH:mm')}</p>*/}
                            {/*</Box>*/}
                            {/*Title and Details*/}
                            <Box w="300px" flex="1" className="julius truncate">
                                {/*{event.subject.length >= 11 && <Box className="animate" textAlign="left" fontSize="x-large" >{event.subject}</Box>}*/}
                                {/*{event.subject.length < 11 && <Box className="" textAlign="left" fontSize="x-large" >{event.subject}</Box>}*/}
                                <Box className="" textAlign="left" fontSize="x-large" >{event.subject}</Box>

                                <div className="w-16 flex-none ">
                                    {event.attendees.map((tag, index) => (
                                        // Move the declaration of tagInfo outside of the return statement.
                                        <Box key={index} className="inline-flex rounded-md bg-gray-50 px-1.5 py-0 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                            {eventUsers[tag]}
                                        </Box>

                                    ))}
                                </div>


                            </Box>
                            <IconButton
                                variant='ghost'
                                colorScheme='gray'
                                aria-label='See task menu'
                                icon={<IoSettingsOutline />}
                                onClick={() => open(allData)}
                            />

                        </Flex>

                    </Flex>
                </CardHeader>

                {event.note && <CardBody padding="5px">
                    <Box className="julius" textAlign="center">{event.note}</Box>
                </CardBody>}


            </Card>
        </>
    );
}

export default Todo;