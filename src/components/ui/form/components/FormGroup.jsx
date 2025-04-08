import React from 'react';
import classNames from "classnames";
import {useAppStore} from "@/hooks/store/useStore.jsx";
import {Tooltip} from "@/components/ui/index.jsx";
import {FiInfo} from "react-icons/fi";
import {FormCheckbox} from "@/components/ui/form/index.jsx";

const FormGroup = ({
                       label,
                       labelRight,
                       labelLeft,
                       labelPadding = false,
                       onLabelCheck,
                       checked,
                       noBorder = false,
                       labelClass,
                       className,
                       action = false,
                       actionIcon = '',
                       actionClass = '',
                       onAction = () => {
                       },
                       prefix,
                       prefixClass,
                       disabled,
                       tooltip,
                       suffix,
                       suffixClass,
                       error,
                       errorMessage,
                       required,
                       children,
                       elementClass,
                       elementStyle,
                       vertical = false
                   }) => {

    const {errors} = useAppStore();

    const getAddonClass = () => {
        if (prefix && suffix) return 'form-group--addon';
        if (prefix) return 'form-group--addon-prefix';
        if (suffix) return 'form-group--addon-suffix';
        return '';
    };

    const formGroupClass = classNames(
        'form-group',
        className,
        {
            'form-group--no-border': noBorder,
            'form-group--error': errors[error],
            'form-group--disabled': disabled,
            'form-group--vertical': vertical,
        },
        getAddonClass()
    );

    const renderLabel = () => {

        if (!label) return null;

        const labelBox = (
            <span className={classNames(labelClass, {'flex justify-between flex-1': labelRight})}>
                {labelLeft}
                <span className="flex space-x-1">
                    {required && <span className="text-red-500">*</span>}
                    <span dangerouslySetInnerHTML={{__html: label}} />
                    {tooltip && (
                        <Tooltip
                            title={<span dangerouslySetInnerHTML={{__html: tooltip}}/>}
                            className="flex items-start translate-y-1 text-muted"
                        >
                            <FiInfo/>
                        </Tooltip>
                    )}
                </span>
                {
                    labelRight
                }
            </span>
        )

        if (onLabelCheck && typeof onLabelCheck === 'function') {
            return (
                <FormCheckbox
                    label={labelBox}
                    checked={checked}
                    onChange={e => onLabelCheck(e)}
                />
            )
        }

        return (
            <div className={classNames(
                'form-label',
                labelClass,
                {
                    'flex justify-between': labelRight,
                })}>
                {labelBox}
            </div>
        );
    };

    return (
        <div className={formGroupClass}>
            {renderLabel()}
            <div className={classNames(
                {
                    'pt-[24px]': labelPadding
                }
            )}>
                <div className={classNames('form-element', elementClass)} style={elementStyle}>
                    {suffix && <div className={classNames('form-suffix', suffixClass)}>{suffix}</div>}
                    {children}
                    {prefix && <div className={classNames('form-prefix', prefixClass)}>{prefix}</div>}
                    {action && (
                        <div className="form-prefix p-0">
                            <button
                                onClick={onAction}
                                className={classNames('w-10 h-10 inline-flex items-center justify-center', actionClass)}
                                type="button"
                            >
                                {actionIcon}
                            </button>
                        </div>
                    )}
                </div>
                {(errors[error] || errorMessage) && <div className="form-error">{errorMessage || errors[error]}</div>}
            </div>
        </div>
    );
};

export default FormGroup;