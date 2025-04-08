import React, {useEffect, useRef, useState} from 'react';
import {Input} from "antd";

function FormPhone(
    {
        allowClear,
        value: externalValue,
        type,
        bordered = false,
        defaultValue,
        maxLength,
        showCount,
        onChange,
        onPressEnter,
        ...props
    }
) {

    const [internalValue, setInternalValue] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (externalValue !== undefined) {
            setInternalValue(formatPhoneNumber(externalValue));
        }
    }, [externalValue]);

    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, '');
        const match = numbers.match(/^(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/);

        if (!match) return numbers;

        let formatted = '';
        if (match[1]) formatted += match[1];
        if (match[2]) formatted += (formatted ? ' ' : '') + match[2];
        if (match[3]) formatted += (formatted ? ' ' : '') + match[3];
        if (match[4]) formatted += (formatted ? ' ' : '') + match[4];
        if (match[5]) formatted += (formatted ? ' ' : '') + match[5];

        return formatted;
    };

    const handleChange = (event) => {
        let input = event.target.value;

        // Əgər input boşdursa, "994" prefiksini əlavə etmirik
        if (input === '') {
            setInternalValue('');
            if (onChange) onChange('');
            return;
        }

        // Əgər "994" ilə başlamırsa və boş deyilsə, əlavə edirik
        if (!input.startsWith('994') && input.length > 0) {
            input = '994' + input;
        }

        const formattedNumber = formatPhoneNumber(input);
        setInternalValue(formattedNumber);
        if (onChange) {
            onChange(formattedNumber);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            const selectionStart = inputRef.current.selectionStart;
            const selectionEnd = inputRef.current.selectionEnd;

            // Əgər bütün mətn seçilibsə
            if (selectionStart === 0 && selectionEnd === internalValue.length) {
                event.preventDefault();
                setInternalValue('');
                if (onChange) onChange('');
                return;
            }

            // "994" prefiksini qoruyuruq, amma tam silinməyə icazə veririk
            if (internalValue === '994' || (selectionStart <= 3 && selectionEnd > 3)) {
                event.preventDefault();
                setInternalValue('');
                if (onChange) onChange('');
                return;
            }
        }
    };

    const handlePressEnter = (e) => {
        if (onPressEnter) {
            onPressEnter(e);
        }
    };

    return (
        <Input
            ref={inputRef}
            type={type || "tel"}
            allowClear={allowClear}
            variant={bordered}
            showCount={showCount}
            defaultValue={defaultValue}
            maxLength={maxLength || 16}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="994XX XXX XX XX"
            onPressEnter={handlePressEnter}
            value={internalValue}
            {...props}
        />
    );
}

export default FormPhone;