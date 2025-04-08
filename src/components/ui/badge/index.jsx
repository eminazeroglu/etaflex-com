import './index.css'
import React from 'react';

function Index({children, className, ...props}) {
    return (
        <span {...props} className={`py-1 px-2 status rounded font-semibold text-xs whitespace-nowrap ${className || ''}`}>
            {children}
        </span>
    );
}

export default Index;