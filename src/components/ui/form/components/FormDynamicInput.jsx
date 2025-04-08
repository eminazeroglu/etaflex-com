import React, {useState, useEffect} from 'react';
import {BiTrash} from 'react-icons/bi';
import classNames from 'classnames';
import {translate} from "@/utils/localeUtil.jsx";

const FormDynamicInput = (
    {
        value = [],
        onChange,
        placeholder = translate('enum.typeSomething'),
        className,
        inputType = 'text',
        rows = 4
    }
) => {
    const [inputs, setInputs] = useState(['']);

    // Value dəyişdikdə inputları yeniləyirik
    useEffect(() => {
        // Value array və içində data varsa
        if (Array.isArray(value) && value.length > 0) {
            setInputs([...value, '']); // mövcud dəyərləri və bir boş input əlavə edirik
        } else if (!Array.isArray(value)) {
            // Value hələ gəlməyibsə və ya array deyilsə
            setInputs(['']); // bir boş input göstəririk
        }
    }, [value]); // yalnız value dəyişdikdə effect işləyir

    const handleInputChange = (index, newValue) => {
        const newInputs = [...inputs];
        newInputs[index] = newValue;

        // Sonuncu input dolubsa, yeni boş input əlavə edirik
        if (newValue.trim() !== '' && index === newInputs.length - 1) {
            newInputs.push('');
        }

        // Əgər ortadakı inputlar boşdursa və sonrakı inputlar da boşdursa,
        // sonrakı inputları silirik
        if (index < newInputs.length - 1 && newValue === '') {
            const restInputsEmpty = newInputs.slice(index + 1).every(input => !input.trim());
            if (restInputsEmpty) {
                newInputs.splice(index + 1);
            }
        }

        setInputs(newInputs);
        // Yalnız dolu inputları göndəririk
        onChange?.(newInputs.filter(Boolean));
    };

    const handleDelete = (index) => {
        if (index === 0) return;

        const newInputs = inputs.filter((_, i) => i !== index);
        setInputs(newInputs);
        onChange?.(newInputs.filter(Boolean));
    };

    return (
        <div className={classNames('form-dynamic space-y-2 w-full', className)}>
            {inputs.map((input, index) => (
                <div
                    key={index}
                    className="flex items-center w-full gap-2"
                >
                    {inputType === 'textarea' ? (
                        <textarea
                            rows={rows}
                            value={input}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder={index === 0 ? placeholder : `${placeholder}`}
                            className={classNames(
                                'form-dynamic-input form-element !h-auto px-3 py-2 flex-1',
                                'outline-none transition-colors duration-200'
                            )}
                        ></textarea>
                    ) : (
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder={index === 0 ? placeholder : `${placeholder}`}
                            className={classNames(
                                'form-dynamic-input form-element px-3 flex-1',
                                'outline-none transition-colors duration-200'
                            )}
                        />
                    )}

                    {index !== 0 && (
                        <button
                            type="button"
                            onClick={() => handleDelete(index)}
                            className={classNames(
                                'p-2 rounded-[4px] outline-none transition-colors duration-200',
                                'text-gray-400 hover:bg-red-50 hover:text-red-500'
                            )}
                        >
                            <BiTrash size={20}/>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FormDynamicInput;