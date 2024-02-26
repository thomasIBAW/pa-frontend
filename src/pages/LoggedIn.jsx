
import {Box} from "@chakra-ui/react";
import Header from "../components/Header.jsx";
import {Route, Routes} from "react-router-dom";
import HomePage from "./HomePage.jsx";
import MePage from "./MePage.jsx";
import AppointmentsPage from "./AppointmentsPage.jsx";
import TodoPage from "./TodoPage.jsx";
import '@fontsource/julius-sans-one';
import Cookies from "universal-cookie";
import Footer from "../components/Footer.jsx";
import Settings from "./Settings.jsx";

function LoggedIn() {
    // const [count, setCount] = useState(0)
    const cookies = new Cookies()

    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/me" element={<MePage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/todos" element={<TodoPage />} />
                <Route path="/settings" element={<Settings />} />
                {/*<Route path="/account" element={<Accountpage/>} >*/}
                {/*    <Route path="settings" element={<Settingspage/>} />*/}
                {/*    <Route path="privacy" element={<Privacypage/>} />*/}
                {/*</Route>*/}
            </Routes>
            <Footer />

        </>
    )
}

export default LoggedIn
