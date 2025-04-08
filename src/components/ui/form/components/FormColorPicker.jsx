import { ColorPicker } from 'antd';
import { useMemo } from 'react';

const FormColorPicker = ({
                             value,
                             name,
                             bordered = false,
                             defaultValue,
                             onChange,
                             showText = true,
                             disabled,
                             format = 'hex',
                             allowClear = true,
                             placeholder = 'Rəng seçin',
                             disabledAlpha = false,
                             presets,
                             ...props
                         }) => {
    // Default color presets
    const defaultPresets = useMemo(() => ([
        {
            label: 'Recommended',
            colors: [
                '#000000',
                '#F5222D',
                '#FA8C16',
                '#FADB14',
                '#52C41A',
                '#1890FF',
                '#722ED1',
                '#EB2F96',
            ],
        },
        {
            label: 'Recent',
            colors: [],
        },
    ]), []);

    // Handle color change
    const handleChange = (color, hex) => {
        if (onChange) {
            // Return the color in the specified format
            const colorValue = format === 'hex' ? hex : color.toRgbString();
            onChange(colorValue);
        }
    };

    return (
        <ColorPicker
            value={value}
            name={name}
            disabled={disabled}
            format={format}
            allowClear={allowClear}
            showText={showText}
            variant={false}
            defaultValue={defaultValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabledAlpha={disabledAlpha}
            presets={presets || defaultPresets}
            rootClassName="form-item form-color"
            {...props}
        />
    );
};

export default FormColorPicker;