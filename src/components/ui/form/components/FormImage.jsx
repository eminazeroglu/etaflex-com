import React, {useEffect, useRef, useState} from 'react';
import defaultImage from '@/assets/img/default-image.png'
import classNames from "classnames";
import {FiX} from "react-icons/fi";
import {translate} from "@/utils/localeUtil.jsx";
import {getStorage} from "@/utils/localStorageUtil.jsx";
import {replaceAll} from "@/utils/stringUtil.jsx";
import {showAlert} from "@/utils/alertUtil.jsx";

function FormImage(
    {
        size = 5,
        roundedFull = true,
        onChange,
        value,
        base64 = false,
    }
) {

    const accept = getStorage('imageFormat')?.join(',');

    const imgRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(defaultImage);

    const isValidFileType = (file) => {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        return acceptedTypes.includes(file.type) || acceptedTypes.includes('image/*');
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {

            if (!isValidFileType(file)) {
                showAlert({
                    message: translate('notification.warningImageUploadType', {type: replaceAll(accept, 'image/', '')}),
                    showXButton: true,
                    showCloseButton: false,
                    showActionButton: false
                })
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setImgSrc(result);
                if (onChange) {
                    if (base64) {
                        onChange(result);
                    } else {
                        onChange(file);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setImgSrc(defaultImage);
        if (onChange) {
            onChange('');
        }
        if (imgRef.current) {
            imgRef.current.value = '';
        }
    };

    const isImageLoaded = imgSrc !== defaultImage;

    useEffect(() => {
        if (value) {
            setImgSrc(value);
        }
    }, [value]);

    return (
        <figure
            style={{
                width: size + 'rem',
                height: size + 'rem',
            }}
            className={classNames(
                'rounded-lg relative form-image'
            )}
        >
            {isImageLoaded && (
                <button
                    type="button"
                    className="size-6 bg-white dark-bg-light rounded-full shadow inline-flex absolute -top-2 -right-2 items-center justify-center"
                    onClick={handleRemove}
                >
                    <FiX/>
                </button>
            )}
            <label className="cursor-pointer">
                <img
                    className={classNames(
                        'size-full border border-color rounded-lg object-cover',
                        {
                            'rounded-full': roundedFull,
                        }
                    )}
                    src={imgSrc}
                    alt=""
                />
                <input
                    type="file"
                    ref={imgRef}
                    onChange={handleChange}
                    className="hidden"
                    accept={accept}
                />
            </label>
        </figure>
    );
}

export default FormImage;   