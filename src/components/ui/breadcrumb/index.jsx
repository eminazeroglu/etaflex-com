import React from 'react';
import {Link} from "react-router";
import {getMainPathByRole} from "@/utils/helpersUtil.jsx";
import {translate} from "@/utils/localeUtil.jsx";
import {FiChevronRight} from "react-icons/fi";

function Breadcrumb({items = []}) {
    const className = 'ms-2 text-[14px] text-primary'

    return (
        <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                    <Link to={getMainPathByRole()}
                          className="inline-flex items-center text-[14px] text-mute underline"
                    >
                        {translate('components.breadcrumb.home')}
                    </Link>
                </li>
                {items.map((item, key) => (
                    <li key={key}>
                        <div className="flex items-center">
                            <span className="size-[16px] shrink-0 inline-flex items-center justify-center"><FiChevronRight className="text-mute"/></span>
                            {item.path && (
                                <Link to={item.path}
                                      className={`${className} text-mute underline`}
                                >
                                    {translate(item.name)}
                                </Link>
                            )}
                            <span className={className}>{translate(item.name)}</span>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export default Breadcrumb;