import Tags from "../components/Tags.jsx";
import People from "../components/People.jsx";
import Family from "../components/Family.jsx";
import {useState} from "react";
import {useCookies} from "react-cookie";

function Settings() {


    const [cookie] = useCookies()
    const [user , setUser] = useState(cookie.fc_user)



    return (
        <>
            <Tags></Tags>
            <People></People>
            {user.isFamilyAdmin && <Family></Family>}
        </>
    );
}

export default Settings;