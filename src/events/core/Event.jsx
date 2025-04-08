export class Event {
    constructor(data) {
        this.data = data;
        this.timestamp = new Date()
    }

    toJSON () {
        return {
            eventName: this.eventName,
            data: this.data,
            timestamp: this.timestamp
        }
    }
}