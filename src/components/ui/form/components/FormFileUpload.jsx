import React, { useRef, useState, useEffect } from 'react';
import { FiUpload, FiX, FiFile } from 'react-icons/fi';
import classNames from 'classnames';
import { translate } from '@/utils/localeUtil.jsx';
import { showAlert } from '@/utils/alertUtil.jsx';
import {getStorage} from "@/utils/localStorageUtil.jsx";

const FormFileUpload = ({
                      value,
                      onChange,
                      size = 5,
                      base64 = false,
                      disabled = false,
                      className,
                  }) => {

    const acceptedFormats = getStorage('fileFormat')
    const fileRef = useRef(null);
    const [fileInfo, setFileInfo] = useState(null);

    // Formatları accept atributu üçün hazırlayırıq
    const getAcceptString = (formats) => {
        return formats.map(format => `.${format}`).join(',');
    };

    // Fayl tipinin yoxlanması
    const isValidFileType = (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return acceptedFormats.includes(fileExtension);
    };

    // Fayl seçimi
    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Format yoxlaması
            if (!isValidFileType(file)) {
                showAlert({
                    message: translate('notification.warningFileUploadType', {
                        type: acceptedFormats.map(f => f.toUpperCase()).join(', ')
                    }),
                    showXButton: true,
                    showCloseButton: false,
                    showActionButton: false
                });
                return;
            }

            if (base64) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result;
                    setFileInfo({
                        name: file.name,
                        size: file.size,
                        format: file.name.split('.').pop().toUpperCase()
                    });
                    onChange?.(result);
                };
                reader.readAsDataURL(file);
            } else {
                setFileInfo({
                    name: file.name,
                    size: file.size,
                    format: file.name.split('.').pop().toUpperCase()
                });
                onChange?.(file);
            }
        }
    };

    const handleRemove = () => {
        setFileInfo(null);
        onChange?.('');
        if (fileRef.current) {
            fileRef.current.value = '';
        }
    };

    useEffect(() => {
        if (!value) {
            setFileInfo(null);
        } else if (typeof value === 'string' && value.startsWith('data:')) {
            setFileInfo({
                name: 'Uploaded file',
                format: value.split(';')[0].split('/')[1].toUpperCase()
            });
        } else if (value instanceof File) {
            setFileInfo({
                name: value.name,
                size: value.size,
                format: value.name.split('.').pop().toUpperCase()
            });
        }
    }, [value]);

    return (
        <div
            className={classNames(
                'form-file relative',
                { 'opacity-60 cursor-not-allowed': disabled },
                className
            )}
            style={{
                width: size + 'rem'
            }}
        >
            {fileInfo ? (
                <div className="border border-color rounded-lg p-3">
                    {!disabled && (
                        <button
                            type="button"
                            className="size-6 bg-white dark-bg-light rounded-full shadow
                                     inline-flex absolute -top-2 -right-2
                                     items-center justify-center"
                            onClick={handleRemove}
                        >
                            <FiX/>
                        </button>
                    )}
                    <div className="flex flex-col items-center gap-2">
                        <FiFile className="size-8 text-gray-400"/>
                        <div className="text-center">
                            <span className="text-sm line-clamp-2">
                                {fileInfo.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {fileInfo.format}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <label className="cursor-pointer block">
                    <div className="border border-color rounded-lg p-3
                                  flex flex-col items-center gap-2
                                  hover:border-primary transition-colors">
                        <FiUpload className="size-8 text-gray-400"/>
                        <div className="text-center">
                            <span className="text-sm block">
                                {translate('button.selectFile')}
                            </span>
                            <span className="text-xs text-gray-500">
                                {acceptedFormats.map(f => f.toUpperCase()).join(', ')}
                            </span>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileRef}
                        onChange={handleChange}
                        className="hidden"
                        accept={getAcceptString(acceptedFormats)}
                        disabled={disabled}
                    />
                </label>
            )}
        </div>
    );
};

export default FormFileUpload;