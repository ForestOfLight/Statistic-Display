import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'joins';

eventManager.registerEvent(IDENTIFIER, 'Times Joined', () => {
    world.afterEvents.playerJoin.subscribe((event) => {
        if (!event.playerName)
            return;
        eventManager.increment(IDENTIFIER, { name: event.playerName });
    });
});