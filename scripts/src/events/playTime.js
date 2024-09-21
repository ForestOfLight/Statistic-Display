import { system, world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'playTime';

eventManager.registerEvent(IDENTIFIER, 'Minutes Played', () => {
    system.runInterval(() => {
        const players = world.getAllPlayers();
        for (const player of players) {
            if (!player)
                continue;
            eventManager.increment(IDENTIFIER, player);
        }
        if (players.length > 0 && players.every((player) => player !== undefined))
            eventManager.incrementTotal(IDENTIFIER);
    }, 20 * 60);
});