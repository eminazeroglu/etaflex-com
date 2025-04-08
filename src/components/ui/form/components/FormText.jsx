import { Input } from "antd";
import { useMemo, forwardRef, useCallback } from "react";
import { onlyNumberWrite } from "@/utils/helpersUtil.jsx";

const FORMAT_RULES = {
    '_': { test: (char) => /^[0-9]$/.test(char), transform: (char) => char },
    '@': { test: (char) => /^[a-zA-Z]$/.test(char), transform: (char) => char },
    '#': { test: (char) => /^[0-9a-zA-Z]$/.test(char), transform: (char) => char }
};

const validateAndFormat = (value, format) => {
    if (!format || !value) return '';

    let formatted = '';
    let valueIndex = 0;

    for (let formatIndex = 0; formatIndex < format.length; formatIndex++) {
        const formatChar = format[formatIndex];

        if (FORMAT_RULES[formatChar]) {
            if (valueIndex >= value.length) break;

            const valueChar = value[valueIndex];
            if (FORMAT_RULES[formatChar].test(valueChar)) {
                formatted += valueChar;
                valueIndex++;
            } else {
                break;
            }
        } else {
            if (value[valueIndex] === formatChar) {
                formatted += formatChar;
                valueIndex++;
            } else {
                formatted += formatChar;
            }
        }
    }

    return formatted;
};

const FormInput = forwardRef((props, ref) => {
    const {
        value = '',
        onChange,
        format,
        onPressEnter,
        maxLength,
        isLowerCase = false,
        isPhone = false,
        isCardNumber = false,
        onlyNumber = false,
        valueFloat = false,
        min,
        max,
        placeholder,
        allowClear = false,
        bordered = false,
        type,
        className,
        ...restProps
    } = props;

    const formatCardNumber = useCallback((value) => {
        const cleaned = value.replace(/\D/g, '');
        const chunks = cleaned.match(/.{1,4}/g) || [];
        return chunks.join(' ').substr(0, 19);
    }, []);

    const handleChange = useCallback((e) => {
        let newValue = e.target.value;

        if (format) {
            newValue = validateAndFormat(newValue, format);
        } else if (isCardNumber) {
            newValue = formatCardNumber(newValue);
        } else if (onlyNumber) {
            onlyNumberWrite(newValue, (val) => {
                if (val === '-' && (min === undefined || min < 0)) return val;
                if (val === '') return onChange?.('');

                const numericValue = valueFloat ? parseFloat(val) : parseInt(val);
                if (isNaN(numericValue)) return;

                if (min !== undefined && numericValue < min) val = min.toString();
                if (max !== undefined && numericValue > max) val = max.toString();

                onChange?.(val);
            }, valueFloat);
            return;
        } else if (isPhone) {
            newValue = newValue.replace(/[^0-9+]/g, '');
        }

        onChange?.(newValue);
    }, [format, isCardNumber, onlyNumber, isPhone, min, max, valueFloat, onChange]);

    const handleKeyDown = useCallback((e) => {
        if (!format) return;

        const { selectionStart, selectionEnd, value } = e.target;

        // Seçilmiş mətn varsa tam sil
        if (selectionStart !== selectionEnd) {
            e.preventDefault();
            handleChange({ target: { value: value.slice(0, selectionStart) + value.slice(selectionEnd) } });
            return;
        }

        if (e.key === 'Backspace' && selectionStart > 0) {
            e.preventDefault();

            // Silinəcək simvolun indeksi
            let deleteIndex = selectionStart - 1;

            // Format simvollarını keçmək üçün
            while (deleteIndex >= 0 && !FORMAT_RULES[format[deleteIndex]]) {
                deleteIndex--;
            }

            // Yeni dəyəri yarat
            const newValue = value.slice(0, deleteIndex) + value.slice(selectionStart);
            handleChange({ target: { value: newValue } });

            // Kursorun yerini düzəlt
            setTimeout(() => {
                e.target.setSelectionRange(deleteIndex, deleteIndex);
            }, 0);
        }
    }, [format, handleChange]);

    const placeholderText = useMemo(() => {
        if (placeholder) return placeholder;
        if (isCardNumber) return '0000 0000 0000 0000';
        if (onlyNumber && (min !== undefined || max !== undefined)) {
            const constraints = [];
            if (min !== undefined) constraints.push(`min: ${min}`);
            if (max !== undefined) constraints.push(`max: ${max}`);
            return constraints.join(', ');
        }
        if (format) return format;
        return undefined;
    }, [placeholder, min, max]);

    return (
        <Input
            ref={ref}
            type={type}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            allowClear={allowClear}
            rootClassName="form-item"
            maxLength={maxLength}
            variant={bordered ? 'outlined' : 'filled'}
            className={className}
            {...restProps}
        />
    );
});

export default FormInput;