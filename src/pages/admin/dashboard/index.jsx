import React from 'react';
import {ContextProvider} from "./context.jsx";
import Page from "./page.jsx";

function DashboardProvider(props) {
    return (
        <ContextProvider>
            <Page/>
        </ContextProvider>
    );
}

export default DashboardProvider;