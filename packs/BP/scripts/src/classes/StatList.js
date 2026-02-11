export class StatList {
    constructor(eventList) {
        this.eventList = eventList;
        this.baseEvents = [];
        this.subEvents = {};
    }

    getBaseEventIDs() {
        this.populateBaseEvents();
        return this.baseEvents;
    }

    getSubEventIDs(baseEvent) {
        this.populateSubEvents();
        return (this.subEvents[baseEvent] || []).slice().sort();
    }

    getMatchingSubEventIDs(searchTerm) {
        this.populateSubEvents();
        const matchingSubEvents = [];
        for (const baseEvent of this.baseEvents) {
            for (const subEvent of this.getSubEventIDs(baseEvent) || []) {
                if (subEvent.includes(searchTerm)) {
                    matchingSubEvents.push(`${baseEvent}:${subEvent}`);
                }
            }
        }
        return matchingSubEvents;
    }

    populateBaseEvents() {
        if (this.baseEvents.length > 0)
            return;
        const heirarchySeparator = ':';
        for (const eventID of this.eventList) {
            if (!eventID.includes(heirarchySeparator)) {
                this.baseEvents.push(eventID);
            }
        }
    }

    populateSubEvents() {
        if (Object.keys(this.subEvents).length > 0)
            return;
        const heirarchySeparator = ':';
        this.populateBaseEvents();
        for (const baseEvent of this.baseEvents) {
            this.subEvents[baseEvent] = [];
            for (const eventID of this.eventList) {
                if (eventID.includes(baseEvent + heirarchySeparator) && eventID !== baseEvent)
                    this.subEvents[baseEvent].push(eventID.replace(baseEvent + heirarchySeparator, ''));
            }
        }
    }
}