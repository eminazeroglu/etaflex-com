import React, {forwardRef} from 'react';
import {Tooltip as AntdTooltip} from 'antd';
import classNames from 'classnames';

const Tooltip = forwardRef((
    {
        children,
        title,
        className,
        placement = 'top',
        color,
        overlayClassName,
        ...props
    }, ref
) => {
    if (!title) return children;

    return (
        <AntdTooltip
            title={title}
            placement={placement}
            color={color}
            className={{
                root: classNames('custom-tooltip', overlayClassName)
            }}
            {...props}
        >
            <span ref={ref} className={classNames('inline-flex', className)}>
                {children}
            </span>
        </AntdTooltip>
    );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;