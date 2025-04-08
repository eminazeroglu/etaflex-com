import {Dropdown as AntDropdown} from "antd";
import classNames from "classnames";

const Dropdown = (
    {
        open= undefined,
        trigger,
        arrow = false,
        children,
        placement = 'bottomRight',
        type = 'click',
        className,
        onOpenChange = () => {}
    }
) => {
    return (
        <AntDropdown
            open={open}
            placement={placement}
            dropdownRender={() => (
                <div className={classNames(
                    'shadow-theme bg-white border border-color',
                    className || ''
                )}>
                    {children}
                </div>
            )}
            arrow={arrow}
            trigger={type}
            onOpenChange={(e) => onOpenChange?.(e)}
        >
            {trigger}
        </AntDropdown>
    )
};

export default Dropdown;