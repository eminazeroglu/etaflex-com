import {Event} from "@/events/core/Event.jsx";

export class EventEmitter {
    constructor() {
        this.listeners = {};
        if (EventEmitter.instance) {
            return EventEmitter.instance;
        }
        EventEmitter.instance = this;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new EventEmitter();
        }
        return this.instance;
    }

    // Event Listener Add
    on(eventName, listener) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = []
        }

        if (!this.listeners[eventName].includes(listener)) {
            this.listeners[eventName].push(listener)
        }
    }

    // Event Listener Remove
    off (eventName, listenerToRemove) {
        if (!this.listeners[eventName]) {
            return;
        }
        this.listeners[eventName] = this.listeners[eventName]
            .filter(listener => listener !== listenerToRemove)
    }

    // Event Emit
    emit (eventName, data) {
        if (!this.listeners[eventName]) {
            return;
        }

        const event = new Event(data)
        this.listeners[eventName].forEach(listener => {
            try {
                listener(event)
            }
            catch (error) {
                console.error(`Error in event listener for ${eventName}:`, error);
            }
        })
    }

    // All listener remove
    removeAllListeners (eventName) {
        if (eventName) {
            delete this.listeners[eventName]
        }
        else {
            this.listeners = {}
        }
    }

    // Event listeners count
    listenerCount (eventName) {
        return this.listeners[eventName]?.length || 0
    }

    // Display all active events and listeners for debug
    debug () {
        console.log('Current event listeners',
            Object.keys(this.listeners).map(eventName => ({
                eventName,
                listenerCount: this.listenerCount(eventName)
            }))
        )
    }
}