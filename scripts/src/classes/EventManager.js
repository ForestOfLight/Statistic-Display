import { world } from '@minecraft/server';
import { Event, EVENT_ID_PREFIX } from 'src/classes/Event';
import BulkDP from 'src/classes/BulkDP';

class EventManager {
    events = {};
    EVENT_LIST_ID = 'statEventList';
    SUBEVENT_DELIMITER = ':';
    worldLoaded = false;
    eventsToRegister = [];
    eventIDs = [];

    registerEvent(eventID, displayName, setupCallback) {
        if (this.worldLoaded) {
            this.events[eventID] = new Event(eventID, displayName, setupCallback);
            const eventList = this.getEventIDs();
            if (!eventList.includes(eventID)) {
                eventList.push(eventID);
                BulkDP.save(this.EVENT_LIST_ID, eventList);
            }
        } else {
            this.eventsToRegister.push({ eventID, displayName, setupCallback });
        }
    }
    
    getEventIDs() {
        if (this.eventIDs.length !== Object.keys(this.events).length)
            this.eventIDs = BulkDP.load(this.EVENT_LIST_ID);
        return this.eventIDs;
    }

    getEvent(eventID) {
        if (!this.validateEventID(eventID))
            throw new Error(`[Stats] Could not get event. Event '${eventID}' not found.`);
        return this.events[eventID];
    }

    exists(eventID) {
        return this.getEventIDs().includes(eventID);
    }

    isRegistered(eventID) {
        return this.events[eventID] !== undefined;
    }
    
    increment(eventID, player) {
        if (!this.exists(eventID))
            throw new Error(`[Stats] Could not increment. Event '${eventID}' not found.`);
        this.getEvent(eventID).updateCount(player, 1);
    }

    setCount(eventID, player, count) {
        if (!this.validateEventID(eventID))
            throw new Error(`[Stats] Could not set count. Event '${eventID}' not found.`);
        this.getEvent(eventID).updateCount(player, count, "set");
    }

    addCount(eventID, player, count) {
        if (!this.validateEventID(eventID))
            throw new Error(`[Stats] Could not add count. Event '${eventID}' not found.`);
        this.getEvent(eventID).updateCount(player, count);
    }

    getCount(eventID, player) {
        if (!this.isRegistered(eventID))
            throw new Error(`[Stats] Could not get count. Event '${eventID}' not found.`);
        return this.getEvent(eventID).getCount(player);
    }

    reset(eventID) {
        if (!this.validateEventID(eventID))
            console.warn(`[Stats] Could not reset. Event '${eventID}' not found.`);
        this.getEvent(eventID).reset();
    }

    resetAll() {
        for (const eventID of this.getEventIDs()) {
            this.getEvent(eventID).reset();
        }
    }

    validateEventID(eventID) {
        if (this.isRegistered(eventID)) {
            return true;
        } else if (this.exists(eventID)) {
            const displayName = JSON.parse(world.getDynamicProperty(EVENT_ID_PREFIX + eventID)).displayName;
            if (!displayName)
                return false;
            this.registerEvent(eventID, displayName, () => {});
            return true;
        } else {
            return false;
        }
    }

    findEventByDisplayName(displayName) {
        for (const eventID of this.getEventIDs()) {
            try {
                const event = this.getEvent(eventID);
                if (event.displayName === displayName)
                    return event;
            } catch (error) {
                console.warn(error);
            }
        }
        return undefined;
    }

    registerQueuedEvents() {
        for (const event of this.eventsToRegister)
            this.registerEvent(event.eventID, event.displayName, event.setupCallback);
        this.eventsToRegister = [];
    }
}

const eventManager = new EventManager();
world.afterEvents.worldLoad.subscribe(() => {
    eventManager.worldLoaded = true;
    eventManager.registerQueuedEvents();
});

export default eventManager;