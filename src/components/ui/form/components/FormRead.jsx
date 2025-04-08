import React, {useMemo} from 'react';
import classNames from "classnames";

function FormRead({children, pre, defaultValue}) {
    const renderText = useMemo(() => {
        if (children) return children;
        else if (defaultValue) return defaultValue;
        else return '';
    }, [children, defaultValue])
    return (
        <div
            className={classNames('form-read', {
                'px-[11px] py-[4px] opacity-50': true,
                'whitespace-pre-line': pre
            })}
        >
            {typeof renderText === 'object' && renderText}
            {typeof renderText !== 'object' && <div dangerouslySetInnerHTML={{__html: renderText}}/>}
        </div>
    );
}

export default FormRead;