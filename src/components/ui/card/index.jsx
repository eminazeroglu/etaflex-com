import React from 'react';
import { Card as AntCard } from 'antd';
import './index.css'
import classNames from "classnames";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";

function Card({ children, bodyStyle, bodyClass, bodyNotPadding = false, overflowDisabled = false, titleRender, footerRender, footerPosition = 'right', collapse = false, open = false, bordered = true, className, rightRender, title }) {

    const [isOpen, setIsOpen] = React.useState(open);

    return (
        <AntCard
            className={classNames(
                'card',
                {
                    'card-border': bordered,
                    '!overflow-visible': overflowDisabled,
                },
                className || ''
            )}
            styles={{ body: {...bodyStyle, padding: ((collapse && !isOpen) || bodyNotPadding) && '0px', border: (collapse && !isOpen) && 'none'}}}
            type="inner"
            title={title ? (
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={classNames(
                        'flex items-center',
                        {
                            'cursor-pointer justify-between': collapse || titleRender
                        }
                    )}>
                    <span className="font-agrandir-regular">{title}</span>
                    <div className="flex items-center gap-[16px]">
                        {titleRender && titleRender}
                        {collapse && (
                            <span className="text-[16px]">
                                {isOpen && <SlArrowUp />}
                                {!isOpen && <SlArrowDown />}
                            </span>
                        )}
                    </div>
                </div>
            ) : ''}
            extra={rightRender}
        >
            {collapse && (
                <div className={classNames(
                    {
                        'hidden': !isOpen
                    }
                )}>
                    {children}
                </div>
            )}
            {!collapse && (
                <div className={bodyClass || ''}>
                    {children}
                </div>
            )}

            {footerRender && (
                <div className={classNames(
                    'card-foot',
                    {
                        'justify-start': footerPosition === 'left',
                        'justify-center': footerPosition === 'center',
                        'justify-end': footerPosition === 'right',
                    }
                )}>
                    {footerRender}
                </div>
            )}
        </AntCard>
    );
}

export default Card;