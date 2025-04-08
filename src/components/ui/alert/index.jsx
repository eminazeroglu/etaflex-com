import React from 'react';
import './index.css'
import classNames from "classnames";
import {FiInfo} from "react-icons/fi";

function Alert({type = 'green', children, className, icon = false}) {
    return (
        <div
            className={classNames(
                'alert',
                'alert__' + type,
                className || ''
            )}
            role="alert"
        >
            {icon && (
                <div className="mt-0.5">
                    <FiInfo/>
                </div>
            )}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}

export default Alert;