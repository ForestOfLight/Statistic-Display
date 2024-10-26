import { system, world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'timeSinceDeath';

eventManager.registerEvent(IDENTIFIER, 'Minutes Since Death', () => {
    system.runInterval(() => {
        const players = world.getAllPlayers();
        for (const player of players) {
            if (!player)
                continue;
            eventManager.increment(IDENTIFIER, player);
        }
    }, 20 * 60);

    world.afterEvents.entityDie.subscribe((event) => {
        if (!event.deadEntity || event.deadEntity.typeId !== 'minecraft:player')
            return;
        eventManager.setCount(IDENTIFIER, event.deadEntity, 0);
    });
});