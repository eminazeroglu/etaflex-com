import React from 'react';
import {translate} from "@/utils/localeUtil.jsx";
import {FiPlus, FiTrash2} from "react-icons/fi";
import {FormGroup, FormText} from "@/components/ui/form/index.jsx";

function FormKeyValue(
    {
        value,
        label,
        error,
        onChange
    }
) {

    const validateUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleKeyChange = (newKey, oldKey) => {
        const newSocialMedia = { ...value };
        delete newSocialMedia[oldKey];

        if (newKey.trim()) {
            newSocialMedia[newKey] = value[oldKey] || '';
        }

        onChange(newSocialMedia);
    };

    const handleValueChange = (inputValue, key) => {
        onChange({
            ...value,
            [key]: inputValue
        });
    };

    const handleAddField = () => {
        onChange({
            ...value,
            '': ''
        });
    };

    const handleRemoveField = (keyToRemove) => {
        const newSocialMedia = { ...value };
        delete newSocialMedia[keyToRemove];
        onChange(newSocialMedia);
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="form-label">{label}</div>
                <button
                    type="button"
                    onClick={handleAddField}
                    className="btn btn-primary btn-sm flex items-center gap-2"
                >
                    <FiPlus className="w-4 h-4" />
                    {translate('button.add')}
                </button>
            </div>
            <div className="p-3 rounded-lg gap-3 border grid grid-cols-1">
                {Object.entries(value).map(([key, fieldValue], index) => (
                    <FormGroup
                        key={index}
                        noBorder={true}
                        error={`${error}.${key}`}
                    >
                        <div className="grid grid-cols-12 gap-2 w-full ">
                            <div className="col-span-4">
                                <FormGroup>
                                    <FormText
                                        value={key}
                                        onChange={(val) => handleKeyChange(val, key)}
                                    />
                                </FormGroup>
                            </div>
                            <div className="flex gap-2 col-span-8">
                                <FormGroup
                                    error={fieldValue && !validateUrl(fieldValue) ? 'invalid_url' : null}
                                >
                                    <FormText
                                        value={fieldValue}
                                        onChange={(val) => handleValueChange(val, key)}
                                    />
                                </FormGroup>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveField(key)}
                                    className="p-2 rounded-[4px] shrink-0 outline-none transition-colors duration-200 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </FormGroup>
                ))}
            </div>
        </div>
    )
}

export default FormKeyValue;