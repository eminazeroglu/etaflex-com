import React, {useCallback, useState} from 'react';
import classNames from 'classnames';
import {translate} from '@/utils/localeUtil.jsx';
import {Tooltip} from "antd";

const ClipboardIcon = ({className}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={classNames("w-3.5 h-3.5", className)}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
    >
        <path
            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
);

function Clipboard({className, clamp = false, copyButtonClass, copyClass, copyText, children}) {
    const [copyMsg, setCopyMsg] = useState(translate('components.clipboard.copy'));

    const handleCopy = useCallback(() => {
        const textToCopy = copyText || children;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopyMsg(translate('components.clipboard.copied'));
            setTimeout(() => {
                setCopyMsg(translate('components.clipboard.copy'));
            }, 3000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }, [copyText, children]);

    return (
        <div className={classNames('flex items-center', className)}>
            {children && (
                <Tooltip title={children}>
                <span className={classNames(
                    'mr-2',
                    {
                        'line-clamp-1': clamp
                    }
                )}>{children}</span>
                </Tooltip>
            )}
            <Tooltip title={copyMsg}>
                <button
                    type="button"
                    className={classNames(
                        'p-1 rounded-md hover:bg-gray-200 transition-colors duration-200',
                        copyButtonClass || ''
                    )}
                    onClick={handleCopy}
                    aria-label={translate('components.clipboard.copyToClipboard')}
                >
                    <ClipboardIcon className={copyClass}/>
                </button>
            </Tooltip>
        </div>
    );
}

export default Clipboard;