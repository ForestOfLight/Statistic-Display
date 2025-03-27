import { world, system } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'other';

eventManager.registerEvent(IDENTIFIER, 'Other', () => {
    // Each of these is a single line in the display.
    worldInitializations();
    mostPlayersOnline();
    longestInactivity();
    tntExploded();
})

function worldInitializations() {
    world.afterEvents.worldLoad.subscribe((event) => {
        eventManager.increment(IDENTIFIER, { name: 'World Initialized' });
    });
}

function mostPlayersOnline() {
    world.afterEvents.playerJoin.subscribe((event) => {
        const onlinePlayerCount = world.getAllPlayers().length;
        const highestPlayersOnline = eventManager.getCount(IDENTIFIER, 'Most Players On');
        if (onlinePlayerCount > highestPlayersOnline)
            eventManager.setCount(IDENTIFIER, { name: 'Most Players On' }, onlinePlayerCount);
    });
}

function longestInactivity() {
    let currentInactivity = 0;
    system.runInterval(() => {
        const playerCount = world.getAllPlayers().length;
        if (playerCount === 0)
            currentInactivity++;
        const longestInactivity = eventManager.getCount(IDENTIFIER, 'Longest Inactivity');
        if (currentInactivity > longestInactivity)
            eventManager.setCount(IDENTIFIER, { name: 'Inactivity' }, currentInactivity);
    }, 20*60);
}

function tntExploded() {
    world.afterEvents.explosion.subscribe((event) => {
        if (event.source?.typeId !== 'minecraft:tnt')
            return;
        eventManager.increment(IDENTIFIER, { name: 'TNT Exploded' });
    });
}
