import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import {
    FormGroup,
    FormText,
    FormSelect,
    FormTextarea,
    FormNumber,
    FormDatePicker,
    FormCheckbox,
    FormImage,
    FormTag,
    FormRead,
    FormColorPicker,
    FormRangePicker,
    FormPhone,
    FormPassword,
    FormRadioGroup,
    FormRangeSlider,
    FormFileUpload
} from '@/components/ui/form/components';
import { Card, Alert } from '@/components/ui/index.jsx';
import { translate } from '@/utils/localeUtil.jsx';
import classNames from 'classnames';

/**
 * FormObject - Dinamik form yaratmaq üçün kompleks komponent
 *
 * @param {Object} props - Komponent Props
 * @param {Object} props.value - Form dəyərləri
 * @param {Function} props.onChange - Dəyişiklik handler
 * @param {Array} props.fields - Form sahələrinin konfiqurasiyası
 * @param {string} props.translateKey - Tərcümə açarı
 * @param {Object} props.defaultValue - Default dəyərlər
 * @param {number|Array} props.gap - Grid gap
 * @param {string} props.layout - Layout tipi (grid, flex, inline)
 * @param {string} props.className - Əlavə CSS klassları
 * @param {boolean} props.isCard - Card görünüşündə olub-olmaması
 * @param {string} props.cardTitle - Card başlığı
 * @param {Object} props.cardProps - Card əlavə props
 * @param {Function} props.onValidationError - Validation xəta handler
 * @param {boolean} props.disabled - Bütün formu disabled etmək
 */
const FormObject = ({
                        value = {},
                        onChange,
                        fields = [],
                        translateKey,
                        defaultValue,
                        gap = 1,
                        layout = 'grid',
                        className,
                        isCard = false,
                        cardTitle,
                        cardProps = {},
                        onValidationError,
                        disabled = false
                    }) => {
    // Referanslar
    const isFirstRender = useRef(true);
    const prevValueRef = useRef(value);
    const validationTimeoutRef = useRef(null);

    // Xəta state
    const [errors, setErrors] = React.useState({});

    /**
     * Dinamik propları qiymətləndirmək üçün funksiya
     */
    const evaluateProps = useCallback((props = {}, fieldValue, fieldContext = {}) => {
        return Object.entries(props).reduce((acc, [key, propValue]) => {
            if (typeof propValue === 'function') {
                try {
                    // Funksiyanı çağırıb nəticəni mənimsədirik
                    acc[key] = propValue(fieldValue, {
                        formValue: value,
                        field: fieldContext,
                        translate: (key) => translate(`${translateKey}.${key}`)
                    });
                } catch (error) {
                    console.error(`Error evaluating dynamic prop "${key}":`, error);
                    acc[key] = undefined;
                }
            } else {
                acc[key] = propValue;
            }
            return acc;
        }, {});
    }, [value, translateKey]);

    /**
     * Field dəyərinin dəyişməsini handle edirik
     */
    const handleChange = useCallback((name, fieldValue) => {
        // Validation timeout-u təmizləyirik
        if (validationTimeoutRef.current) {
            clearTimeout(validationTimeoutRef.current);
        }

        const newValue = {
            ...value,
            [name]: fieldValue
        };

        onChange(newValue);

        // Validation-ı debounce edirik
        validationTimeoutRef.current = setTimeout(() => {
            validateField(name, fieldValue);
        }, 300);
    }, [value, onChange]);

    /**
     * Tək field-i validate edirik
     */
    const validateField = useCallback((name, fieldValue) => {
        const field = fields.find(f => f.name === name);
        if (!field?.validation) return;

        try {
            const validationResult = field.validation(fieldValue, {
                formValue: value,
                translate: (key) => translate(`${translateKey}.${key}`)
            });

            if (validationResult) {
                setErrors(prev => ({
                    ...prev,
                    [name]: validationResult
                }));

                if (onValidationError) {
                    onValidationError({
                        field: name,
                        error: validationResult
                    });
                }
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        } catch (error) {
            console.error(`Validation error for field "${name}":`, error);
        }
    }, [fields, value, translateKey, onValidationError]);

    /**
     * Komponent tipinə görə uyğun komponenti qaytarır
     */
    const getComponent = useCallback((type) => {
        switch (type) {
            case 'text':
                return FormText;
            case 'textarea':
                return FormTextarea;
            case 'select':
                return FormSelect;
            case 'number':
                return FormNumber;
            case 'datepicker':
                return FormDatePicker;
            case 'rangepicker':
                return FormRangePicker;
            case 'tag':
                return FormTag;
            case 'color':
                return FormColorPicker;
            case 'checkbox':
                return FormCheckbox;
            case 'image':
                return FormImage;
            case 'phone':
                return FormPhone;
            case 'password':
                return FormPassword;
            case 'radio':
                return FormRadioGroup;
            case 'range-slider':
                return FormRangeSlider;
            case 'file':
                return FormFileUpload;
            case 'read':
                return FormRead;
            default:
                return FormText;
        }
    }, []);

    /**
     * Field renderini həyata keçirən funksiya
     */
    const renderField = useCallback((field) => {
        const { type, name, label, props = {}, hidden } = field;

        // Gizli field-ləri render etmirik
        if (hidden) return null;

        // Field-in cari dəyərini alırıq
        const fieldValue = value?.[name] ?? defaultValue?.[name];

        // Custom template üçün kontekst yaradırıq
        const templateContext = {
            value: fieldValue,
            formValue: value,
            onChange: (val) => handleChange(name, val),
            field,
            translateKey,
            disabled,
            error: errors[name]
        };

        // Custom template handling
        if (type === 'custom' && typeof field.template === 'function') {
            const CustomComponent = field.template;
            return (
                <div
                    className={`form-col-${field?.colSpan || 12}`}
                    key={name}
                >
                    <CustomComponent {...templateContext} />
                </div>
            );
        }

        // Komponenti seçirik
        const Component = getComponent(type);

        // Component props
        const componentProps = {
            value: fieldValue,
            onChange: (val) => handleChange(name, val),
            disabled,
            error: errors[name],
            ...evaluateProps(props, fieldValue, field)
        };

        // Checkbox üçün xüsusi props
        if (type === 'checkbox') {
            componentProps.checked = typeof fieldValue === 'boolean'
                ? fieldValue
                : defaultValue?.[name] ?? false;
            componentProps.label = translate(`${translateKey}.${label}`);
        }

        // Grid üçün column class
        const columnClass = `form-col-${field?.colSpan || 12}`;

        return (
            <div
                style={style}
                className={columnClass}
                key={name}
            >
                <FormGroup
                    label={!['checkbox'].includes(type) && translate(`${translateKey}.${label}`)}
                    tooltip={componentProps?.tooltip}
                    error={errors[name]}
                    required={field.required}
                >
                    <Component {...componentProps} />
                </FormGroup>
            </div>
        );
    }, [value, defaultValue, translateKey, disabled, errors, handleChange, evaluateProps, getComponent]);

    /**
     * Layout klassını təyin edirik
     */
    const getContainerClass = useCallback(() => {
        switch (layout) {
            case 'grid':
                return 'form-grid';
            case 'flex':
                return 'form-flex';
            case 'inline':
                return 'form-inline';
            default:
                return '';
        }
    }, [layout]);

    // Gap style-nı hazırlayırıq
    const style = useMemo(() => {
        if (typeof gap === 'object' && gap.length > 0) {
            return {
                columnGap: `${gap[0] || 1}rem`,
                rowGap: `${gap[1] || gap[0] || 1}rem`,
            };
        }
        return { gap: `${gap || 1}rem` };
    }, [gap]);

    // Fieldləri hazırlayırıq
    const items = useMemo(() => {
        return fields.map((field) => ({
            isShow: true,
            ...field
        }));
    }, [fields]);

    // İlk render zamanı default dəyərləri set edirik
    useEffect(() => {
        if (isFirstRender.current && defaultValue && fields) {
            const object = {};
            fields.forEach(item => {
                if (item.type === 'checkbox') {
                    object[item.name] = Boolean(defaultValue?.[item.name]);
                } else {
                    object[item.name] = defaultValue?.[item.name] || undefined;
                }
            });
            onChange(object);
            isFirstRender.current = false;
        }
    }, [defaultValue, fields, onChange]);

    // Dəyər dəyişdikdə validation
    useEffect(() => {
        if (JSON.stringify(prevValueRef.current) !== JSON.stringify(value)) {
            Object.keys(value).forEach(fieldName => {
                if (value[fieldName] !== prevValueRef.current?.[fieldName]) {
                    validateField(fieldName, value[fieldName]);
                }
            });
            prevValueRef.current = value;
        }
    }, [value, validateField]);

    // Form content
    const content = (
        <div
            className={classNames(
                'form-object',
                getContainerClass(),
                className,
                {
                    'form-object--disabled': disabled
                }
            )}
            style={style}
        >
            {items.filter(i => i.isShow).map(field => renderField(field))}

            {/* Validation xətaları */}
            {Object.keys(errors).length > 0 && (
                <div className="form-col-12">
                    <Alert type="error">
                        {translate('form.validation.hasErrors')}
                    </Alert>
                </div>
            )}
        </div>
    );

    // Card wrapper
    if (isCard) {
        return (
            <Card
                title={cardTitle}
                {...cardProps}
                className={classNames(cardProps?.className, {
                    'card--disabled': disabled
                })}
            >
                {content}
            </Card>
        );
    }

    return content;
};

export default React.memo(FormObject);