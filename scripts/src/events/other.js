import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'other';

eventManager.registerEvent(IDENTIFIER, 'Other', () => {
    // World Initialized
    world.afterEvents.worldInitialize.subscribe((event) => {
        eventManager.increment(IDENTIFIER, { name: 'World Initialized' });
    });
})
