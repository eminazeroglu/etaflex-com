import React, {forwardRef, useRef} from 'react';
import {GoInfo} from "react-icons/go";
import {Tooltip} from "@/components/ui/index.jsx";

const TooltipInfo = forwardRef(({title, placement = 'top', iconClass}, ref) => {
    const internalRef = useRef(null);
    const combinedRef = (node) => {
        internalRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    };

    return (
        <Tooltip
            title={title}
            className="text-base shrink-0"
            placement={placement}
        >
              <span ref={combinedRef}>
                <GoInfo className={`inline text-muted ${iconClass || ''}`}/>
              </span>
        </Tooltip>
    );
});

TooltipInfo.displayName = 'TooltipInfo';

export default TooltipInfo;