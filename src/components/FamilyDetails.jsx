import React, { useEffect, useState} from 'react';

import {
    Box, Button, Divider, VStack
} from "@chakra-ui/react";

import {useCookies} from "react-cookie";
import {HexColorPicker} from "react-colorful";
import {globalFetch} from "../hooks/Connectors.jsx";

const devState = import.meta.env.VITE_DEVSTATE
const backendURI = devState==='PROD' ? '/app' : 'http://localhost:3005';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function FamilyDetails({fam}) {

    const [familyDetails, setFamilyDetails] = useState(fam)
    const [familyAdmins, setFamilyAdmins] = useState ([])
    const [familyMembers, setFamilyMembers] = useState ([])
    const [lastRefresh, setToRefresh] = useState(new Date())

    // console.log(fam)
    function generateRandomCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }
    const createCode = async () => {
        let body = {}
        // generating a random 6 char code
        const newCode = await generateRandomCode(6)
        console.log(newCode)

        body = {
            invitationCode: newCode,
            uuid: fam.uuid
        }

        const response = await fetch(`${backendURI}/api/family/code`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "include", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
            },
            // redirect: "follow", // manual, *follow, error
            // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(body) // body data type must match "Content-Type" header
        });

        if (response.status !== 200) {
            // setError("incorrect")
            console.log(response.status)
            return
        }
        setToRefresh(new Date())

    }


    useEffect( () => {
        const getFamDetails = async () => {

            console.log(
                "fetch for Family Details"
            )
              const res = await globalFetch("family", `{ "uuid" : "${fam.uuid}" }`, "");
                    console.log("setting Details to : ", res[0])



            setFamilyDetails(res[0])
        }
        getFamDetails()

    }, [lastRefresh])



    useEffect( () => {

        const getAdmins = async () => {
            let newAdminNames = {};
               for (let admin of familyDetails.familyAdmin) {
                    console.log(admin)
                    if (!newAdminNames[admin]) {


                        const res = await globalFetch("users", `{"uuid" : "${admin}"}`, "");
                        console.log(res)
                        newAdminNames[admin] = {name: res[0].username, uuid: res[0].uuid, isFamilyAdmin : res[0].isFamilyAdmin};
                    }
                }
               setFamilyAdmins(Object.values(newAdminNames))
        }

        const getUsers = async () => {
            let newMemberNames = {};
            for (let user of familyDetails.familyMember) {
                console.log(user)
                if (!newMemberNames[user]) {
                    const res = await globalFetch("users", `{"uuid" : "${user}"}`, "");
                    console.log(res)
                    newMemberNames[user] = { name: res[0].username, uuid: res[0].uuid, isFamilyAdmin : res[0].isFamilyAdmin};
                }
            }
            setFamilyMembers(Object.values(newMemberNames))
        }

        // const get

        getAdmins()
        getUsers()
    },[familyDetails])

    return (
        <>
            <VStack mb='20px'>

                <h1>{familyDetails.familyName}</h1>

                <div>
                   <Box>
                      {/*<Box fontWeight="bold" color="black" bgColor="orange" textAlign="center" rounded="5px" p="10px">Not ready yet !</Box>*/}
                       <Divider m="10px"/>
                       <p>Family Admins : {familyAdmins.map((e, index) => (
                           <li key={index}>{e.name} (***{e.uuid.slice(24)})</li>
                       ))}</p>
                       <Divider m="10px"/>
                        <p>Family Users : {familyMembers.map((e, index) => (
                           <li key={index}>{e.name} (***{e.uuid.slice(24)})</li>
                       ))}</p>

                       <Divider m="10px"/>
                       <p>Created by : <li>***{familyDetails.createdBy.slice(24)}</li>
                       </p>
                       <Divider m="10px"/>

                       <p>Invitation Codes:</p>

                       {familyDetails.invitationCode && familyDetails.invitationCode.length > 0 ?
                      ( <p>{ familyDetails.invitationCode
                           .filter(e => e.valid)
                           .map((e, index) => (
                           <li key={index}>{e.code} (***{e.createdBy.slice(24)})</li>
                       ))}
                          { familyDetails.invitationCode
                              .filter(e => !e.valid)
                              .map((e, index) => (
                                  <li key={index} style={{ color: 'red', textDecoration: 'line-through' }}>{e.code} (used)</li>
                              ))}
                      </p>) : null
                       }

                       <Button  bgColor="gold" mt="10px" onClick={createCode}>
                           Create Invitation Code
                       </Button>
                   </Box>




                </div>
            </VStack>

            {/*<Modal*/}
            {/*    initialFocusRef={initialRef}*/}
            {/*    finalFocusRef={finalRef}*/}
            {/*    isOpen={isOpen}*/}
            {/*    onClose={onClose}*/}
            {/*>*/}
            {/*    <ModalOverlay />*/}
            {/*    <ModalContent w='300px' alignItems='center'>*/}
            {/*        <ModalHeader className='julius'>Add a new Tag</ModalHeader>*/}
            {/*        <ModalCloseButton />*/}
            {/*        <ModalBody pb={3}>*/}
            {/*            <FormControl w='200px'>*/}
            {/*                <FormLabel as='h1' fontSize='14'>Tag Name</FormLabel>*/}
            {/*                <Input type='text' variant='filled' size='lg' name="tagName" value={formData.tagName} onChange={handleInputChange}/>*/}
            {/*                <FormLabel as='h1' mt='15px' fontSize='14'>Color</FormLabel>*/}
            {/*                <HexColorPicker color={color} onChange={setColor} />*/}
            {/*                /!*<Button  onClick={} colorScheme='gray' mt='30px' variant='solid' size='lg' w='250px'>Log in</Button>*!/*/}
            {/*            </FormControl>*/}

            {/*        </ModalBody>*/}

            {/*        <ModalFooter>*/}
            {/*            <Button colorScheme='blue' mr={3} onClick={() => console.log("none")} >*/}
            {/*                Save*/}
            {/*            </Button>*/}
            {/*            <Button onClick={onClose}>Cancel</Button>*/}
            {/*        </ModalFooter>*/}
            {/*    </ModalContent>*/}
            {/*</Modal>*/}


        </>
    );
}

export default FamilyDetails;