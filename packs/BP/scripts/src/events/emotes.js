import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'emotes';

eventManager.registerEvent(IDENTIFIER, 'Emotes Performed', () => {
    world.afterEvents.playerEmote.subscribe((event) => {
        if (!event.player)
            return;
        eventManager.increment(IDENTIFIER, event.player);
    });
});