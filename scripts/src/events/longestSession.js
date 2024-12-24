import { system, world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'longestSession';

eventManager.registerEvent(IDENTIFIER, 'Longest Session (Min)', () => {
    const playerSessionMap = new Map();

    system.runInterval(() => {
        const players = world.getAllPlayers();
        for (const player of players) {
            if (!player)
                continue;
            const currentSession = (playerSessionMap.get(player.id) || 1);
            playerSessionMap.set(player.id, currentSession + 1);

            const longestSession = eventManager.getCount(IDENTIFIER, player);
            if (currentSession < longestSession)
                continue;
            eventManager.setCount(IDENTIFIER, player, currentSession);
        }
    }, 20 * 60);

    world.beforeEvents.playerLeave.subscribe((event) => {
        if (!event.player) return;
        playerSessionMap.delete(event.player.id);
    });
});