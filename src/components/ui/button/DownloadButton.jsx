import React from 'react';
import {Button} from "@/components/ui/index.jsx";
import {translate} from "@/utils/localeUtil.jsx";
import {GoDownload} from "react-icons/go";

function DownloadButton({children, className, property = 'primary', loading, onClick, iconSuffix = false}) {
    return (
        <Button
            loading={loading}
            onClick={() => onClick?.()}
            icon={<GoDownload/>}
            iconSuffix={iconSuffix}
            className={className}
            property={property}
        >
            {children || translate('button.download')}
        </Button>
    );
}

export default DownloadButton;