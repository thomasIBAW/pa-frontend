import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";
import AuthProvider from 'react-auth-kit';
import createStore from "react-auth-kit/createStore";
import LoggedIn from "./pages/LoggedIn.jsx";

const store = createStore({
    authName:'_auth',
    authType:'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: false,
});


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
      <ChakraProvider>
          <AuthProvider store={store}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
          </AuthProvider>
      </ChakraProvider>
  // {/*</React.StrictMode>,*/}
)
