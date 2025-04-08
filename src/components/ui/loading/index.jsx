import React, {useMemo} from 'react';
import {Spin} from 'antd';
import {LoadingOutlined} from "@ant-design/icons";
import classNames from "classnames";
import PropTypes from 'prop-types';

export const LoadingIcon = ({fontSize = 24, className = "text-primary theme-text"}) => (
    <LoadingOutlined
        className={className}
        style={{fontSize}}
        spin
    />
);

const Loading = (
    {
        className,
        mainClass,
        loading = false,
        blur = true,
        fontSize = 40,
        message,
        children,
        fullScreen = false,
        spinClassName = 'text-primary theme-text',
    }
) => {
    // Overlay classes memorization
    const overlayClasses = useMemo(() =>
            classNames(
                'inset-0 flex dark-bg-main bg-white items-center justify-center z-[2001]',
                className,
                {
                    'bg-opacity-50 backdrop-filter backdrop-blur-sm': blur,
                    'fixed': fullScreen,
                    'hidden': !loading
                }
            ),
        [className, blur, fullScreen, loading]
    );

    // Main container classes memorization
    const containerClasses = useMemo(() =>
            classNames(
                'relative',
                mainClass,
                {
                    'min-h-screen': fullScreen,
                    'h-full': !fullScreen
                }
            ),
        [mainClass, fullScreen]
    );

    // Content classes memorization
    const contentClasses = useMemo(() =>
            classNames({
                'hidden': loading
            }),
        [loading]
    );

    return (
        <div className={containerClasses}>
            {/* Content */}
            <div className={contentClasses}>
                {children}
            </div>

            {/* Loading Overlay */}
            <div className={overlayClasses}>
                <div className="flex items-center justify-center h-full flex-col gap-3">
                    <Spin indicator={
                        <LoadingIcon
                            fontSize={fontSize}
                            className={spinClassName}
                        />
                    }/>
                    {message && (
                        <div className="text-sm text-gray-600 theme-text">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

Loading.propTypes = {
    className: PropTypes.string,
    mainClass: PropTypes.string,
    loading: PropTypes.bool,
    blur: PropTypes.bool,
    fontSize: PropTypes.number,
    message: PropTypes.node,
    children: PropTypes.node,
    fullScreen: PropTypes.bool,
    spinClassName: PropTypes.string
};

LoadingIcon.propTypes = {
    fontSize: PropTypes.number,
    className: PropTypes.string
};

export default Loading;