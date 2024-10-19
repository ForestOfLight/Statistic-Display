import { world } from "@minecraft/server";
import Display from "src/classes/Display";

const EVENT_ID_PREFIX = 'stat-';

class Event {
    eventID;
    displayName;
    #dpIdentifier;

    constructor(eventID, displayName, setupCallback) {
        this.eventID = eventID;
        this.displayName = displayName;
        this.#dpIdentifier = EVENT_ID_PREFIX + eventID;
        
        if (!world.getDynamicPropertyIds().includes(this.#dpIdentifier)) {
            this.#initializeDynamicProperty();
        }
        setupCallback();
    }

    #initializeDynamicProperty() {
        world.setDynamicProperty(this.#dpIdentifier, JSON.stringify({
            displayName: this.displayName,
            participants: []
        }));
    }

    getData() {
        return JSON.parse(world.getDynamicProperty(this.#dpIdentifier));
    }

    hasParticipant(player) {
        const data = this.getData();
        const participantNames = data.participants.map(participant => participant.name)
        return participantNames.includes(player.name);
    }

    reset() {
        this.#initializeDynamicProperty();
        Display.update(this);
    }

    increment(player) {
        const data = this.getData();
        if (!this.hasParticipant(player)) {
            data.participants.push({
                name: player.name,
                score: 0
            });
        }
        const participant = data.participants.find(participant => participant.name === player.name);
        participant.score++;
        world.setDynamicProperty(this.#dpIdentifier, JSON.stringify(data));
        Display.update(this);
    }

    getTotal() {
        const data = this.getData();
        let total = 0;
        for (const participant of data.participants) {
            total += participant.score;
        }
        return total;
    }

    getCount(player) {
        const data = this.getData();
        const participant = data.participants.find(participant => participant.name === player.name);
        if (participant === undefined)
            return 0;
        return participant.score;
    }

    setCount(player, count) {
        const data = this.getData();
        if (!this.hasParticipant(player)) {
            data.participants.push({
                name: player.name,
                score: 0
            });
        }
        const participant = data.participants.find(participant => participant.name === player.name);
        participant.score = count;
        world.setDynamicProperty(this.#dpIdentifier, JSON.stringify(data));
        Display.update(this);
    }
}

export { Event, EVENT_ID_PREFIX };