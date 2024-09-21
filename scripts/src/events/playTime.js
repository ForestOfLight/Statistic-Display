import { system, world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'playTime';

eventManager.registerEvent(IDENTIFIER, 'Minutes Played', () => {
    system.runInterval(() => {
        for (const player of world.getAllPlayers()) {
            if (!player)
                continue;
            eventManager.increment(IDENTIFIER, player);
        }
    }, 20 * 60);
});