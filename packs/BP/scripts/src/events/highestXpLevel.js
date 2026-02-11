import { system, world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'highestXpLevel';

eventManager.registerEvent(IDENTIFIER, 'Highest Xp Level', () => {
    system.runInterval(() => {
        const players = world.getAllPlayers();
        for (const player of players) {
            if (!player)
                continue;
            let highestXpLevel = eventManager.getCount(IDENTIFIER, player);
            if (player.level < highestXpLevel)
                continue;
            highestXpLevel = player.level;
            eventManager.setCount(IDENTIFIER, player, highestXpLevel);
        }
    }, 20 * 10);
});