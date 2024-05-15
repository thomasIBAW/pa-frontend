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
                       <Button isDisabled bgColor="gold" mt="10px">
                           Create Invitation Code
                       </Button>
                   </Box>
                    {/*<p> {JSON.stringify(familyMembers)}</p>*/}



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