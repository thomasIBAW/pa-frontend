import React, {useContext} from 'react';
import '@fontsource/julius-sans-one';
import UserContext from "../hooks/Context.jsx";
function HomePage() {

    const {currentUser, setCurrentUser } = useContext(UserContext);

    console.log(currentUser)

    return (
        <>

            <center>
                <h1>{currentUser.username}'s Dashboard</h1>
                <p>Welcome to the Family Calendar </p>
                <h1></h1>
            </center>

        </>
    );
}

export default HomePage;