import {
    Box, Divider
} from '@chakra-ui/react'
import {Link} from "react-router-dom";
import '@fontsource/julius-sans-one';
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import useSignOut from "react-auth-kit/hooks/useSignOut";
import Cookies from "universal-cookie";
import UserContext from "../hooks/Context.jsx";
import DateTime from "./DateTime.jsx";
import {IoPersonCircleOutline} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {PropTypes} from "prop-types";
//TODO change backend URI to the correct one
const devState = import.meta.env.VITE_DEVSTATE
const backendURI = devState==='PROD' ? '/app' : 'http://localhost:3005';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Header({onLogout}) {


    const navigate = useNavigate()

    const signout = useSignOut()
    // const cookies = new Cookies()

    // const {currentUser, setCurrentUser} = useContext(UserContext)
    async function logout() {
        try {
            console.log("Starting Logout process....")
            const response = await fetch(`${backendURI}/logout`, {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "include", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                },
                //redirect: "follow", // manual, *follow, error
                //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                //body: {"user":"demo"}, // body data type must match "Content-Type" header
            });

            // console.log("Received Feedback from Logout fetch -> code:", response.status)

            if (response.status !== 200) {
                console.log(response)
                return
            }
            signout()
            console.log("loggedOut")

            setTimeout(()=>{
                console.log("starting navigation to /login ...")
                navigate("/login")
            }, 500)

            // onLogout()
            }
            catch(e) {
            console.log(e)
        }
    }
    //TODO position Header static to the top of the page.
    return (
        <>
        <Box height="64px"></Box>
        <Disclosure as="nav" className="bg-white shadow tbeheader ">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    {/*<img*/}
                                    {/*    className="h-8 w-auto"*/}
                                    {/*    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"*/}
                                    {/*    alt="Your Company"*/}
                                    {/*/>*/}
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                                    <Box as={Link} to="/home" className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900" fontFamily='Julius Sans One'
                                    >
                                        Dashboard
                                    </Box>
                                    <Box as={Link} to="/appointments" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700" fontFamily='Julius Sans One'>
                                        Appointments
                                    </Box>
                                    <Box as={Link} to="/todos"
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700" fontFamily='Julius Sans One'
                                    >
                                        Debug
                                    </Box>
                                    {/*<Box as={Link}*/}
                                    {/*    to="/calendar"*/}
                                    {/*    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700" fontFamily='Julius Sans One'*/}
                                    {/*>*/}
                                    {/*    Calendar*/}
                                    {/*</Box>*/}
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {/*<button*/}
                                {/*    type="button"*/}
                                {/*    className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}
                                {/*>*/}
                                {/*    <span className="absolute -inset-1.5" />*/}
                                {/*    <span className="sr-only">View notifications</span>*/}
                                {/*    <BellIcon className="h-6 w-6" aria-hidden="true" />*/}
                                {/*</button>*/}
                                <DateTime></DateTime>
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                           <h1> <IoPersonCircleOutline /></h1>


                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Box as={Link}
                                                        fontFamily='Julius Sans One'
                                                        to="/me"
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700') }
                                                    >
                                                        Your Profile
                                                    </Box>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Box as={Link}
                                                         fontFamily='Julius Sans One'
                                                         to="/settings"
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Settings
                                                    </Box>
                                                )}
                                            </Menu.Item>
                                            <Divider />
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Box onClick={logout}
                                                          fontFamily='Julius Sans One'

                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Sign out
                                                    </Box>
                                                )}
                                            </Menu.Item>
                                            <Divider />
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Box as={Link}
                                                         fontFamily='Julius Sans One'
                                                         to="https://docs.famcal.ch/category/user-manual"
                                                         target="_blank" rel="noopener noreferrer"
                                                         className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700') }
                                                    >
                                                        User Manual
                                                    </Box>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Box as={Link}
                                                         fontFamily='Julius Sans One'
                                                         to="https://docs.famcal.ch/category/setup"
                                                         target="_blank" rel="noopener noreferrer"
                                                         className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700') }
                                                    >
                                                        Api Docu
                                                    </Box>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 pb-4 pt-2">
                            {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                            <Disclosure.Button
                                as={Link}
                                to="/home"
                                className="julius block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"  fontFamily='Julius Sans One'
                            >
                                Dashboard
                            </Disclosure.Button>
                            <Disclosure.Button
                                as={Link}
                                to="/appointments"
                                className="julius block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700" fontFamily='Julius Sans One'
                            >
                                Appointments
                            </Disclosure.Button>
                            <Disclosure.Button
                                as={Link}
                                to="/todos"
                                className="julius block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700" fontFamily='Julius Sans One'
                            >
                                Debug
                            </Disclosure.Button>
                            {/*<Disclosure.Button*/}
                            {/*    as={Link}*/}
                            {/*    to="/calendar"*/}
                            {/*    className="julius block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"  fontFamily='Julius Sans One'*/}
                            {/*>*/}
                            {/*    Calendar*/}
                            {/*</Disclosure.Button>*/}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>

        </>
    //     <>
    //     <Box display="flex"  flexWrap="wrap" alignItems="center" justifyContent="space-between" fontFamily='Julius Sans One'>
    //     <Center bg={bgColor} w='100%' p={2} color='black'>
    //     <Breadcrumb separator='|'>
    //         <BreadcrumbItem>
    //             <Box m={2}>
    //                 <BreadcrumbLink as={Link} to='/'>Home</BreadcrumbLink>
    //             </Box>
    //         </BreadcrumbItem>
    //         <BreadcrumbItem>
    //             <Box m={2}>
    //                 <BreadcrumbLink as={Link} to='/appointments'>Appointments</BreadcrumbLink>
    //             </Box>
    //         </BreadcrumbItem>
    //         <BreadcrumbItem>
    //              <Box m={2}>
    //                 <BreadcrumbLink as={Link} to='/todos'>ToDos</BreadcrumbLink>
    //              </Box>
    //         </BreadcrumbItem>
    //         <BreadcrumbItem>
    //             <Box m={2}>
    //                 <BreadcrumbLink as={Link} to='/me'><i className="fa-solid fa-gears"></i></BreadcrumbLink>
    //             </Box>
    //         </BreadcrumbItem>
    //     </Breadcrumb>
    //
    //     </Center>
    //
    //     </Box>
    // <Center display="flex" bg={bgColor} w='100%' p={1} color='black' alignItems="center" justifyContent="space-evenly" fontFamily='Julius Sans One' fontSize='smaller'>
    //     <Box>User : {user}</Box>
    //     <Box>|</Box>
    //     <Box>Family : {user}</Box>
    // </Center>
    //
    //     </>
    )
}

export default Header;