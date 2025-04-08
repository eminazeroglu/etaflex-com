import {useState, useCallback, useMemo, useEffect, useRef} from "react";
import * as Yup from 'yup';

const useForm = ({initialValues = {}, validationSchema = null, onSubmit}) => {
    /*
        State dəyişənləri
     */
    // Forma dəyərləri
    const [values, setValues] = useState(initialValues);
    // Validasiya xətaları
    const [errors, setErrors] = useState({});
    // Toxunulmuş sahələr
    const [touched, setTouched] = useState({});
    // Yükləmə vəziyyəti
    const [loading, setLoading] = useState(false);
    const prevInitialValuesRef = useRef(initialValues);

    /*
    * Tək bir sahəni validasiya edir
    * */
    const validateField = useCallback(async (name, value) => {
        if (!validationSchema) return;

        try {
            let schema;
            if (typeof validationSchema === 'function') {
                schema = await validationSchema();
            } else {
                schema = await validationSchema;
            }

            if (!schema || typeof schema.validateAt !== 'function') {
                return;
            }

            await schema.validateAt(name, {[name]: value});
            setErrors(prev => ({...prev, [name]: ''}));
        } catch (error) {
            if (error instanceof Yup.ValidationError && !value) {
                setErrors(prev => ({...prev, [name]: error.message}));
            }
        }
    }, [validationSchema]);

    /*
    * Bir sahənin dəyərini yeniləyir və validasiya edir
    * */
    const setField = useCallback((name, value) => {
        setValues(prev => ({...prev, [name]: value}));
        setTouched(prev => ({...prev, [name]: true}));
        validateField(name, value);
    }, [validateField]);

    /*
    * Bütün formanı yeniləyir və validasiya edir
    * */
    const setForm = useCallback((newValues, val) => {
        setValues(newValues);
        setTouched(Object.keys(newValues).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {}));
        Object.keys(newValues).forEach(key => validateField(key, newValues[key]));
    }, [validateField, initialValues]);

    /*
    * Formu ilkin vəziyyətinə qaytarır
    * */
    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setLoading(false);
    }, [initialValues]);

    /*
    * Bir sahənin toxunulmuş vəziyyətini yeniləyir
    * */
    const setFieldTouched = useCallback((name, isTouched = true) => {
        setTouched(prev => ({...prev, [name]: isTouched}));
    }, [validateField, values]);

    /*
    * Bütün sahələri toxunulmuş kimi qeyd edir
    * */
    const setAllTouched = useCallback(() => {
        const touchedFields = Object.keys(values).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(touchedFields);
        Object.keys(values).forEach(key => validateField(key, values[key]));
    }, [values, validateField]);

    /*
    * Bütün formanı validasiya edir
    * */
    const validate = useCallback(async () => {
        if (!validationSchema) return true;

        try {
            const schema = typeof validationSchema === 'function' ? await validationSchema() : validationSchema;
            await schema.validate(values, {abortEarly: false});
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const newErrors = error.inner.reduce((acc, err) => {
                    if (err.message) {
                        acc[err.path] = err.message;
                    }
                    return acc;
                }, {});

                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
            }
            return false;
        }
    }, [values, validationSchema]);

    /*
    * Formu submit edir
    * */
    const handleSubmit = useCallback(async (event) => {
        if (event) {
            event.preventDefault();
        }
        setAllTouched();
        const isValid = await validate();
        if (isValid) {
            setLoading(true);
            try {
                await onSubmit(values);
            } finally {
                setLoading(false);
            }
        }
    }, [values, validate, setAllTouched, onSubmit]);

    /*
    * Bir sahənin focus-dan çıxdığını (blur olduğunu) işləyir
    * */
    const handleBlur = useCallback((e) => {
        const name = e.target.name;
        if (name) {
            setFieldTouched(name, true);
            validateField(name, values[name]);
        } else {
            console.warn('Add the name attribute')
        }
    }, [setFieldTouched, validateField, values]);

    /*
    * Bir sahə üçün xəta mesajını manual olaraq təyin edir
    * */
    const setFieldError = useCallback((name, errorMessage) => {
        setErrors(prev => ({...prev, [name]: errorMessage}));
        setFieldTouched(name)
    }, []);

    /*
    * Dəyərlər dəyişdikdə avtomatik validasiya aparır
    * */
    useEffect(() => {
        validate();
    }, [validate]);

    useEffect(() => {
        // Əvvəlki dəyərlərlə müqayisə edirik
        if (JSON.stringify(prevInitialValuesRef.current) !== JSON.stringify(initialValues)) {
            setValues(initialValues);
            prevInitialValuesRef.current = initialValues;
        }
    }, [initialValues]);

    /*
    * Formun vəziyyətini memoizasiya edir
    * */
    const formState = useMemo(() => ({
        values,
        errors,
        touched,
        loading,
        isValid: Object.keys(errors).length === 0,
        isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
    }), [values, errors, touched, loading, initialValues]);

    return {
        ...formState,
        setField,
        setForm,
        setFieldTouched,
        setFieldError,
        setAllTouched,
        setLoading,
        resetForm,
        validate,
        handleSubmit,
        handleBlur
    };
};

export default useForm;