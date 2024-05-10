import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";
import AuthProvider from 'react-auth-kit';
import createStore from "react-auth-kit/createStore";
import {CookiesProvider} from "react-cookie";

const store = createStore({
    authName:'_auth',
    authType:'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: true,
});


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
      <ChakraProvider>
          <CookiesProvider>
              <AuthProvider store={store}>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
              </AuthProvider>
          </CookiesProvider>
      </ChakraProvider>
  // {/*</React.StrictMode>,*/}
)
