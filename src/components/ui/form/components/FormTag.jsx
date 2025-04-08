import React, { useState, useRef } from 'react';
import { Input } from 'antd';
import { FiX } from 'react-icons/fi';
import classNames from 'classnames';

const FormTag = ({
                     value = [],
                     onChange,
                     placeholder,
                     bordered = false,
                     disabled = false,
                     maxLength,
                     allowClear = true,
                     className,
                     ...props
                 }) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    // Mövcud dəyərləri array-ə çeviririk
    const tags = Array.isArray(value) ? value : value ? [value] : [];

    // Enter və ya vergül basıldıqda yeni tag əlavə edirik
    const handleKeyDown = (e) => {
        if (disabled) return;

        const key = e.key;
        const trimmedInput = inputValue.trim();

        if ((key === 'Enter' || key === ',') && trimmedInput.length && !tags.includes(trimmedInput)) {
            e.preventDefault();

            // Maksimum uzunluq yoxlaması
            if (maxLength && trimmedInput.length > maxLength) return;

            const newTags = [...tags, trimmedInput];
            onChange(newTags);
            setInputValue('');
        } else if (key === 'Backspace' && !inputValue.length && tags.length > 0) {
            // Backspace ilə son tagi silmək
            const newTags = tags.slice(0, -1);
            onChange(newTags);
        }
    };

    // Tag silmək
    const removeTag = (tagToRemove) => {
        if (disabled) return;
        const newTags = tags.filter(tag => tag !== tagToRemove);
        onChange(newTags);
    };

    // Bütün tagları silmək
    const handleClear = () => {
        if (disabled) return;
        onChange([]);
        setInputValue('');
        inputRef.current?.focus();
    };

    return (
        <div className={classNames(
            'form-item form-tag relative w-full flex flex-wrap items-center gap-2 min-h-[40px] px-3 py-1.5',
            {
                'border-gray-300 dark:border-gray-700': !bordered,
                'opacity-60 cursor-not-allowed': disabled
            },
            className
        )}>
            {/* Taglar */}
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className={classNames(
                        'inline-flex items-center gap-1 px-2 py-1 text-sm',
                        'bg-gray-100 dark:bg-gray-700 rounded'
                    )}
                >
                    {tag}
                    {!disabled && (
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="p-0.5 hover:text-red-500 transition-colors"
                        >
                            <FiX className="w-3 h-3" />
                        </button>
                    )}
                </span>
            ))}

            {/* Input */}
            <Input
                ref={inputRef}
                type="text"
                className="!border-none !shadow-none !p-0 !h-auto w-full flex-1 min-w-[60px]"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={!tags.length ? placeholder : ''}
                disabled={disabled}
                {...props}
            />

            {/* Clear button */}
            {allowClear && tags.length > 0 && !disabled && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="p-1 hover:text-red-500 transition-colors"
                >
                    <FiX className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default FormTag;