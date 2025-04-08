import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function useQueryParams() {
    const location = useLocation();
    const navigate = useNavigate();

    const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

    const getParam = (key) => query.get(key);

    const setParam = (key, value) => {
        const updatedParams = new URLSearchParams(query.toString());

        if (value) {
            updatedParams.set(key, value);
        } else {
            updatedParams.delete(key);
        }

        navigate({ search: updatedParams.toString() }, { replace: true });
    };

    const removeParam = (key) => {
        const updatedParams = new URLSearchParams(query.toString());
        updatedParams.delete(key);
        navigate({ search: updatedParams.toString() }, { replace: true });
    };

    const clearAllParams = () => {
        navigate({ search: '' }, { replace: true });
    };

    // History-dən parametrləri silmək üçün
    const clearParamsFromHistory = () => {
        const currentPath = '#' + location.pathname;
        window.history.replaceState(null, '', currentPath);
    };

    const queryParams = useMemo(() => {
        let params = {};
        [...query]?.forEach((item) => {
            const [key, value] = item;
            params[key] = value;
        })
        return params;
    }, [query]);

    return {
        queryParams,
        getParam,
        setParam,
        removeParam,
        clearAllParams,
        clearParamsFromHistory
    };
}

export default useQueryParams;