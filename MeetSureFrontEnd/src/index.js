/*!

=========================================================
* Argon Dashboard Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-chakra
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-chakra/blob/master/LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/* eslint-disable no-unused-vars */

import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

// Layouts
import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js";
import BackstageLayout from "layouts/backstage.js"; // 引入新檔案

// Chakra imports
import { ChakraProvider } from "@chakra-ui/react";
// Custom Chakra theme
import theme from "theme/theme.js";

// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8Khty5PEY9ABAVzkQblQd7RDKoX6oqzk",
  authDomain: "meetsure-ai.firebaseapp.com",
  projectId: "meetsure-ai",
  storageBucket: "meetsure-ai.appspot.com",
  messagingSenderId: "1097122682600",
  appId: "1:1097122682600:web:c675af15466e69855d9b5d",
  measurementId: "G-CYQ3VKMTKM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

export { db }; // Export the Firestore database instance

ReactDOM.render(
  <ChakraProvider theme={theme} resetCss={false} position="relative">
    <HashRouter>
      <Switch>
        <Route path={`/auth`} component={AuthLayout} />
        <Route path={`/admin`} component={AdminLayout} />
        <Route path={`/rtl`} component={RTLLayout} />
        <Route path={`/backstage`} component={BackstageLayout} /> {/* 新路由 */}

        <Redirect from={`/`} to="/admin/dashboard" />
      </Switch>
    </HashRouter>
  </ChakraProvider>,
  document.getElementById("root")
);
