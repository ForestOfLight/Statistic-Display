import { world } from "@minecraft/server";

class Event {
    #eventID;
    #displayName;
    scoreboardObjective;

    constructor(eventID, displayName, setupCallback) {
        this.#eventID = eventID;
        this.#displayName = displayName;
        this.scoreboardObjective = world.scoreboard.getObjective(this.#eventID);
        if (!this.scoreboardObjective)
            this.scoreboardObjective = world.scoreboard.addObjective(this.#eventID, this.#displayName);
        setupCallback();
    }

    increment(player) {
        return this.scoreboardObjective.addScore(player.name + ' ', 1);
        // The space is necessary for Minecraft not to attach it to the player object upon relog.
    }

    getCount(player) {
        return this.scoreboardObjective.getScore(player.name);
    }
}

export default Event;