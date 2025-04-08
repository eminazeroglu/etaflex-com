import React from 'react';
import { ErrorFallback } from './ErrorFallback';
import { useErrorHandler } from '@/hooks/error/useErrorHandler';
import {useNavigate, useRouteError} from "react-router";

export function RouterErrorElement() {
    const error = useRouteError();
    const navigate = useNavigate();
    const { resetError } = useErrorHandler();

    const handleReset = () => {
        resetError();
        navigate(-1);
    };

    return <ErrorFallback error={error} resetError={handleReset} />;
}