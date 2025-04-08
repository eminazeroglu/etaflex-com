import React from 'react';
import {Button, Icon, Image} from "@/components/ui/index.jsx";
import {translate} from "@/utils/localeUtil.jsx";

import defaultImage from '@/assets/img/default-image.png'

function Header(props) {
    return (
        <header className="py-[10px] fixed top-0 left-0 right-0 w-full bg-white border-b border-color z-50">
            <div className="container mx-auto justify-between flex items-center">
                <div>
                    <Image
                        className="h-[40px]"
                        type="contain"
                        src={'/logo.svg'}
                    />
                </div>

                <div className="flex items-center gap-x-6">
                    <Button property="secondary" roundedFull={true} size='lg' className="uppercase font-bold">
                        {translate('button.createOrder')}
                    </Button>

                    <div className="flex gap-x-3">
                        <Image
                            className="size-12"
                            imageFullRounded={true}
                            src={defaultImage}
                        />
                        <button className="flex items-center gap-x-3">
                            <span>Username</span>
                            <span className="text-primary">
                                <Icon name={'logout'}/>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;