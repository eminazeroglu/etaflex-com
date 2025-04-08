import React, {useState} from 'react';
import {translate} from '@/utils/localeUtil.jsx';
import classNames from 'classnames';
import {useAppStore} from "@/hooks/store/useStore.jsx";
import {Alert} from "@/components/ui/index.jsx";

const FormTab = (
    {
        tabs = [],
        translateKey,
        layout = 'grid',
        gap = 1,
        className,
        renderField
    }
) => {
    const {errors} = useAppStore();

    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="space-y-4">
            {/* Tab Headers */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={classNames(
                            'px-4 py-2 text-sm font-medium transition-colors',
                            'focus:outline-none',
                            {
                                'text-primary border-b-2 border-primary -mb-[2px]': activeTab === index,
                                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200': activeTab !== index
                            }
                        )}
                    >
                        {translate(`${translateKey}.${tab.label}`)}
                    </button>
                ))}
            </div>

            {Object.keys(errors).length > 0 && (
                <Alert type={'red'} icon={true}>
                    {translate('notification.errorControl')}
                </Alert>
            )}

            {/* Tab Content */}
            <div
                className={classNames(
                    'form-tab-content',
                    {
                        'form-grid': layout === 'grid',
                        'form-flex': layout === 'flex'
                    },
                    className
                )}
                style={{gap: `${gap}rem`}}
            >
                {tabs[activeTab]?.fields.map(field => renderField(field))}
            </div>
        </div>
    );
};

export default FormTab;