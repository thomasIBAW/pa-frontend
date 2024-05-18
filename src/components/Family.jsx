import React, { useEffect, useState} from 'react';
import {EllipsisVerticalIcon, PlusIcon} from '@heroicons/react/20/solid'

import {
    Box, Button, FormControl, FormLabel, Input,
    Modal,
    ModalBody,
    ModalCloseButton, ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    VStack
} from "@chakra-ui/react";

import {useCookies} from "react-cookie";
import {HexColorPicker} from "react-colorful";
import {globalFetch} from "../hooks/Connectors.jsx";
import FamilyDetails from "./FamilyDetails.jsx";
import {IoPersonCircleOutline, IoPersonOutline, IoSettingsOutline} from "react-icons/io5";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Family() {

    const [cookie] = useCookies()
    const [user , setUser] = useState(cookie.fc_user)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [color, setColor] = useState("");
    const [formData, setFormData] = useState({tagName:"", tagColor:color});
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };



    const [editData, setEditData] = useState({})
    const handleOpenEditModal = async (d) => {
        await setEditData(d)

        onOpen();
    };

    const [error, setError] = useState(null)
    const [currentFamily, setCurrentFamily] = useState([])

    const decodedUser = user;
    //console.log(decodedUser.linkedFamily, apiKey)
    // TODO remove if not used
    const devState = import.meta.env.VITE_DEVSTATE
    const backendURI = devState==='PROD' ? '/app' : 'http://localhost:3005';



    //     //TODO if needed add create Family function

    useEffect( () => {
        async function fetchData() {
            const response = await globalFetch("family", "{}", "")
            setCurrentFamily(response)
        }

        fetchData()
    },[editData])

//TODO Add Details to the Families / Modification

    return (
<>
        <VStack mb='20px'>

            <h1>Family
            </h1>

            <div>
                <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    {currentFamily.map((project) => (
                        <li key={project.uuid} className="col-span-1 flex rounded-md shadow-sm">
                            <Box bgColor="gray"
                                className={classNames(
                                    'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white '
                                )}
                            >
                               {/*Add icon of users in family info*/}
                               <IoPersonOutline />{project.familyMember.length}
                            </Box>
                            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                                <div className="flex-1 truncate px-4 py-2 text-sm">
                                    {/*<a href={project.href} className="font-medium text-gray-900 hover:text-gray-600">*/}
                                    {/*    {project.tagName}*/}
                                    {/*</a>*/}
                                    <p className="text-gray-500">{project.familyName}</p>
                                </div>
                                <div className="flex-shrink-0 pr-2">
                                    <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <span className="sr-only">Open options</span>
                                        <IoSettingsOutline className="h-5 w-5" aria-hidden="true" onClick={() => handleOpenEditModal(project)} />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </VStack>

    <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
    >
        <ModalOverlay />
        <ModalContent>
        <FamilyDetails fam={editData} />
        </ModalContent>
        </Modal>


</>
    );
}

export default Family;