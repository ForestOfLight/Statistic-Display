import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'other';

eventManager.registerEvent(IDENTIFIER, 'Other', () => {
    // World Initialized
    world.afterEvents.worldInitialize.subscribe((event) => {
        eventManager.increment(IDENTIFIER, { name: 'World Initialized' });
    });

    // Most Players On
    world.afterEvents.playerJoin.subscribe((event) => {
        const playerCount = world.getAllPlayers().length + 1;
        const highestPlayersOnline = eventManager.getCount(IDENTIFIER, 'Most Players On');
        if (highestPlayersOnline < playerCount) {
            eventManager.setCount(IDENTIFIER, { name: 'Most Players On' }, playerCount);
        }
    });
})
