import React, {useEffect, useMemo} from 'react';
import {Button as AntdButton, Tooltip} from "antd";
import classNames from 'classnames';

const IconElement = React.memo(({icon, hasChildren, iconClass}) => {
    if (!icon) return null;

    return (
        <span
            className={classNames(
                {'relative text-base icon': hasChildren},
                iconClass
            )}
        >
      {icon}
    </span>
    );
});

const Button = (
    {
        property = 'primary',
        icon,
        iconClass,
        iconSuffix = false,
        children,
        roundedFull = false,
        disabled = false,
        loading = false,
        type = 'button',
        className,
        tooltip,
        tooltipPlacement = 'top',
        onClick,
        block,
        size,
        ...props
    }
) => {
    const handleClick = (e) => {
        if (onClick && type !== 'submit') {
            onClick(e);
        }
    };

    const buttonClasses = useMemo(() =>
        classNames(
            'btn',
            `btn--${property}`,
            `${size ? 'btn--' + size : ''}`,
            className,
            {
                'btn--block': block,
                'pointer-events-none opacity-80': disabled || loading,
                'btn--rounded-full': roundedFull,
            }
        ), [property, className, block, disabled, loading, size]
    );

    const buttonContent = useMemo(() => {
        if (loading && !children) return null;
        return (
            <span className="btn--content">
                {!iconSuffix && (
                    <>
                        {(icon && !loading) && (
                            <IconElement
                                icon={icon}
                                iconClass={iconClass}
                                hasChildren={!!children}
                            />
                        )}
                    </>
                )}
                    {children && children}
                    {iconSuffix && (
                        <>
                            {(icon && !loading) && (
                                <IconElement
                                    icon={icon}
                                    iconClass={classNames(
                                        iconClass,
                                        'icon-suffix'
                                    )}
                                    hasChildren={!!children}
                                />
                            )}
                        </>
                    )}
            </span>
        )
    }, [icon, iconClass, loading, children]);

    const button = (
        <AntdButton
            {...props}
            htmlType={type}
            className={buttonClasses}
            onClick={handleClick}
            loading={loading}
            disabled={disabled || loading}
        >
            {buttonContent}
        </AntdButton>
    );

    if (tooltip) {
        return (
            <Tooltip placement={tooltipPlacement} title={tooltip}>
                {button}
            </Tooltip>
        );
    }

    return button;
};

export default React.memo(Button);