
import './App.css'
import {Box} from "@chakra-ui/react";
import Header from "./components/Header.jsx";
import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MePage from "./pages/MePage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import TodoPage from "./pages/TodoPage.jsx";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
        <Header />
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/me" element={<MePage/>} />
                <Route path="/appointments" element={<AppointmentsPage/>} />
                <Route path="/todos" element={<TodoPage/>} />
                {/*<Route path="/about" element={<Aboutpage/>} />*/}
                {/*<Route path="/account" element={<Accountpage/>} >*/}
                {/*    <Route path="settings" element={<Settingspage/>} />*/}
                {/*    <Route path="privacy" element={<Privacypage/>} />*/}
                {/*</Route>*/}
            </Routes>


    </>
  )
}

export default App
