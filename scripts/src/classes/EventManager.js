import { world, ObjectiveSortOrder, DisplaySlotId } from '@minecraft/server';
import Event from 'src/classes/Event';

const DISPLAY_SLOT = DisplaySlotId.Sidebar;

class EventManager {
    events = {};

    registerEvent(eventID, displayName, setupCallback) {
        this.events[eventID] = new Event(eventID, displayName, setupCallback);

        const eventList = this.getEventIDs();
        if (!eventList.includes(eventID)) {
            eventList.push(eventID);
            world.setDynamicProperty('eventList', JSON.stringify(eventList));
        }
    }

    getEvent(eventID) {
        if (!this.validateEventID(eventID))
            throw new Error(`[Stats] Could not get event. Event '${eventID}' not found.`);
        return this.events[eventID];
    }

    getEventIDs() {
        let eventList;
        try {
            eventList = JSON.parse(world.getDynamicProperty('eventList'));
        } catch {}
        if (eventList === undefined)
            eventList = [];
        return eventList;
    }

    exists(eventID) {
        return this.getEventIDs().includes(eventID);
    }

    isRegistered(eventID) {
        return this.events[eventID] !== undefined;
    }
    
    clearDisplay() {
        const success = world.scoreboard.clearObjectiveAtDisplaySlot(DISPLAY_SLOT);
        if (!success)
            return false;
        return true;
    }
    
    setDisplay(eventID) {
        if (!this.validateEventID(eventID))
            return false;
        const scoreboardObjectiveDisplayOptions = { 
            objective: this.getEvent(eventID).scoreboardObjective,
            sortOrder: ObjectiveSortOrder.Descending
        };
        world.scoreboard.setObjectiveAtDisplaySlot(DISPLAY_SLOT, scoreboardObjectiveDisplayOptions);
        return true;
    }
    
    increment(eventID, player) {
        if (!this.exists(eventID))
            throw new Error(`[Stats] Could not increment. Event '${eventID}' not found.`);
        this.getEvent(eventID).increment(player);
    }

    incrementTotal(eventID) {
        if (!this.exists(eventID))
            throw new Error(`[Stats] Could not increment total. Event '${eventID}' not found.`);
        this.getEvent(eventID).incrementTotal();
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
            const displayName = world.scoreboard.getObjective(eventID)?.displayName;
            if (!displayName)
                return false;
            this.registerEvent(eventID, displayName, () => {});
            return true;
        } else {
            return false;
        }
    }
}

const eventManager = new EventManager();

export default eventManager;