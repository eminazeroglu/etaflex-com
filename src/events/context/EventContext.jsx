import React, { createContext, useContext, useCallback } from 'react';
import { EventEmitter } from '../core/EventEmitter';

const EventContext = createContext(null);
const eventEmitter = EventEmitter.getInstance();

export function EventProvider({ children }) {

    const emit = useCallback((eventName, data) => {
        eventEmitter.emit(eventName, data);
    }, []);

    const on = useCallback((eventName, listener) => {
        eventEmitter.on(eventName, listener);
    }, []);

    const off = useCallback((eventName, listener) => {
        eventEmitter.off(eventName, listener);
    }, []);

    const value = {
        emit,
        on,
        off,
        eventEmitter
    };

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
}

export function useEvents() {
    const context = useContext(EventContext);

    if (!context) {
        throw new Error('useEvents must be used within an EventProvider');
    }

    return context;
}

export function useEventListener(eventName, callback) {
    const { on, off } = useEvents();

    React.useEffect(() => {
        on(eventName, callback);
        return () => off(eventName, callback);
    }, [eventName, callback, on, off]);
}

export function useEventEmitter() {
    const { emit } = useEvents();

    return {
        emit: useCallback((eventName, data) => {
            emit(eventName, data);
        }, [emit])
    };
}

export const emitEvent = (eventName, data) => {
    eventEmitter.emit(eventName, data);
};