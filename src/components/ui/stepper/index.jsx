import React, {useCallback, useEffect, useMemo} from 'react';
import {Icon} from "@/components/ui/index.jsx";
import classNames from "classnames";

function Stepper({items, onSelect, selectedIndex = 0}) {

    const itemsState = useMemo(() => {
        return items;
    }, [items])

    const [activeTab, setActiveTab] = React.useState(selectedIndex);

    const component = useMemo(() => {
        const findItems = items[activeTab || 0];
        const Component = findItems.component;
        return <Component {...findItems?.data} />;
    }, [activeTab])

    const selectIcon = useCallback((item, index) => {
        if (index === activeTab) {
            return <Icon name="radioCheck" size={24}/>;
        } else if (!item.checked && index !== activeTab) {
            return <Icon name="radioUncheck" size={24}/>;
        } else if (item.checked) {
            return <Icon name="checkmark" size={24}/>
        }
    }, [activeTab])

    const handleClick = useCallback((item, index) => {
        setActiveTab(index);
    }, [])

    useEffect(() => {
        setActiveTab(selectedIndex);
    }, [selectedIndex]);

    return (
        <div>
            <div className="flex gap-x-[4px]">
                {itemsState.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleClick(item, index)}
                        className={classNames(
                            'flex-1 cursor-pointer',
                            {
                                'text-primary': index === activeTab,
                                'text-primary-dark': item.checked,
                                'text-primary-extraLight': index !== activeTab && !item.checked,
                            }
                        )}>
                        <div className="text-[24px]">
                            {item?.icon && item.icon}
                        </div>
                        <div className={classNames(
                            'h-[4px] rounded-[4px] my-[10px] w-full bg-primary-extraLight',
                            {
                                '!bg-primary': index === activeTab,
                                '!bg-primary-extraLight': index !== activeTab && !item.checked,
                                '!bg-primary-dark': item.checked,
                            }
                        )}/>
                        <div className="flex items-center gap-x-[4px]">
                            <span>{selectIcon(item, index)}</span>
                            <span className={index !== activeTab ? 'text-black' : ''}>{item.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-6">
                {component}
            </div>
        </div>
    );
}

export default Stepper;