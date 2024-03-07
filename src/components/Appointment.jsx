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

function Appointment({event, eventUsers}) {

    const isToday = moment(`${event.dateTimeStart}`).format('DD.MM.YYYY') <= moment().format('DD.MM.YYYY') && moment(`${event.dateTimeEnd}`).format('DD.MM.YYYY') >= moment().format('DD.MM.YYYY')

    return (
        <>
            <Card key={event.uuid} maxW="lg" >
                <CardHeader>
                    <Flex spacing='4'>
                        <Flex flex='1' gap='6' alignItems='center' flexWrap='wrap'>
                            {/*DateBox, TimeBox*/}
                            {/*<Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />*/}
                            {isToday ?
                                <Box fontSize="lg" fontWeight="Bold" border="2px solid #e6c997" borderRadius="10px" padding="10px" width="60px" textAlign="center">
                                    <Text fontSize="sm" >{moment(`${event.dateTimeStart}`).format('ddd')}</Text>
                                    <p className=" text-sm text-center font-extrabold text-gray-900">{moment(`${event.dateTimeStart}`).format('DD.')}</p>
                                    {moment(`${event.dateTimeStart}`).format('DD.MM.') != moment(`${event.dateTimeEnd}`).format('DD.MM.') ?
                                        <p className=" text-sm text-center font-extrabold text-gray-900">{moment(`${event.dateTimeEnd}`).format(' - DD.')}</p> : null }
                                </Box> :
                                <Box fontSize="lg" fontWeight="Bold" border="1px solid lightgray" borderRadius="10px" padding="10px" width="60px" textAlign="center">
                                    <Text fontSize="sm" >{moment(`${event.dateTimeStart}`).format('ddd')}</Text>
                                    <p className=" text-sm text-center font-extrabold text-gray-900">{moment(`${event.dateTimeStart}`).format('DD.')}</p>
                                    {moment(`${event.dateTimeStart}`).format('DD.MM.') != moment(`${event.dateTimeEnd}`).format('DD.MM.') ?
                                        <p className=" text-sm text-center font-extrabold text-gray-900">{moment(`${event.dateTimeEnd}`).format(' - DD.')}</p> : null }
                                </Box>
                            }

                            <Box width="50px" textAlign="center">
                                <p>Time</p>
                                <p className="text-sm text-gray-900">{moment(`${event.dateTimeStart}`).format('HH:mm')}</p>
                                <p>-</p>
                                <p className=" text-sm text-gray-500">{moment(`${event.dateTimeEnd}`).format('HH:mm')}</p>

                            </Box>
                            {/*Title and Details*/}
                            <Box flex="1" className="julius">
                                <Box textAlign="center" fontSize="x-large" >{event.subject}</Box>
                                <div className="w-16 flex-none ">
                                    {event.attendees.map((tag, index) => (
                                        // Move the declaration of tagInfo outside of the return statement.
                                        <Box key={index} className="inline-flex rounded-md bg-gray-50 px-1.5 py-0 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                            {eventUsers[tag]}
                                        </Box>

                                    ))}
                                </div>


                            </Box>
                            {/*<IconButton*/}
                            {/*    variant='ghost'*/}
                            {/*    colorScheme='gray'*/}
                            {/*    aria-label='See menu'*/}
                            {/*    icon={<BsThreeDotsVertical />}*/}
                            {/*/>*/}

                        </Flex>

                    </Flex>
                </CardHeader>
                {event.note && <CardBody padding="5px">
                    <Box className="julius" textAlign="center">{event.note}</Box>
                </CardBody>}
                {/*<Image*/}
                {/*    objectFit='cover'*/}
                {/*    src='https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'*/}
                {/*    alt='Chakra UI'*/}
                {/*/>*/}

                {/*<CardFooter*/}
                {/*    justify='space-between'*/}
                {/*    flexWrap='wrap'*/}
                {/*    sx={{*/}
                {/*        '& > button': {*/}
                {/*            minW: '136px',*/}
                {/*        },*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Button flex='1' variant='ghost' leftIcon={<BiLike />}>*/}
                {/*        Like*/}
                {/*    </Button>*/}
                {/*    <Button flex='1' variant='ghost' leftIcon={<BiChat />}>*/}
                {/*        Comment*/}
                {/*    </Button>*/}
                {/*    <Button flex='1' variant='ghost' leftIcon={<BiShare />}>*/}
                {/*        Share*/}
                {/*    </Button>*/}
                {/*</CardFooter>*/}

            </Card>
        </>
    );
}

export default Appointment;