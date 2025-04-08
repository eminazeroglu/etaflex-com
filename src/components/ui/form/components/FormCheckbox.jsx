import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { BiCheck } from 'react-icons/bi';
import TooltipInfo from "@/components/ui/tooltip-info/index.jsx";

export const CheckboxWrapper = forwardRef((
    {
        children,
        disabled,
        error,
        className,
        ...props
    }, ref) => {
    return (
        <label
            ref={ref}
            className={classNames(
                'relative inline-flex items-center form-item form-checkbox min-h-[24px]',
                {
                    'cursor-pointer': !disabled,
                    'cursor-not-allowed opacity-60': disabled
                },
                className
            )}
            {...props}
        >
            {children}
        </label>
    )
});

CheckboxWrapper.displayName = 'CheckboxWrapper';

const FormCheckbox = forwardRef((
    {
        checked,
        defaultChecked,
        onChange,
        label,
        tooltip,
        tooltipClass,
        name,
        value,
        error,
        disabled = false,
        size = 'sm',
        indeterminate = false,
        className,
        labelClassName,
        wrapperClassName,
        ...props
    }, ref
) => {
    // Size classes
    const sizeClasses = {
        'sm': 'w-4 h-4',
        'md': 'w-5 h-5',
        'lg': 'w-6 h-6'
    };

    // Icon size values
    const iconSizes = {
        'sm': 14,
        'md': 16,
        'lg': 20
    };

    return (
        <CheckboxWrapper
            htmlFor={name}
            disabled={disabled}
            error={error}
            className={wrapperClassName}
        >
            <div className="relative inline-flex items-start">
                {/* Hidden native checkbox */}
                <input
                    ref={ref}
                    type="checkbox"
                    id={name}
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={(e) => disabled ? undefined : onChange(e.target.checked, e.target.value)}
                    disabled={disabled}
                    className={`hidden peer`}
                />

                {/* Custom checkbox */}
                <div
                    className={classNames(
                        'shrink-0 inline-flex items-center justify-center translate-y-[1.5px]',
                        'border rounded-[4px] transition-colors duration-200 peer-checked:bg-primary peer-checked:border-primary',
                        sizeClasses[size],
                        {
                            'border-red-500': error,
                            'bg-gray-100 border-gray-300': disabled,
                        },
                        className
                    )}
                >
                    {/* Check icon */}
                    {(!!checked || !!value) && !indeterminate && (
                        <BiCheck className="text-white" size={iconSizes[size]} />
                    )}

                    {/* Indeterminate icon */}
                    {indeterminate && (
                        <div className={classNames(
                            'bg-white rounded-sm',
                            {
                                'w-2 h-0.5': size === 'sm',
                                'w-2.5 h-0.5': size === 'md',
                                'w-3 h-1': size === 'lg'
                            }
                        )} />
                    )}
                </div>

                {/* Label */}
                {label && (
                    <span className={classNames(
                        'ml-2 select-none flex gap-1',
                        {
                            'text-sm': size === 'sm',
                            'text-base': size === 'md',
                            'text-lg': size === 'lg',
                            'text-gray-500': disabled,
                            'text-red-500': error
                        },
                        labelClassName
                    )}>
                        <span>{label}</span>
                        {tooltip && (
                            <span className={classNames(
                                'relative -top-1',
                                tooltipClass || ''
                            )}>
                                <TooltipInfo
                                    title={tooltip}
                                />
                            </span>
                        )}
                    </span>
                )}
            </div>
        </CheckboxWrapper>
    );
});

FormCheckbox.displayName = 'FormCheckbox';

export default FormCheckbox;