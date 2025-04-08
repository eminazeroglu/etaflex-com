import React from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

function Scrollbar({children, className, ...props}) {
    return (
        <PerfectScrollbar {...props} className={className}>
            {children}
        </PerfectScrollbar>
    );
}

export default Scrollbar;