import { world, system } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'other';

eventManager.registerEvent(IDENTIFIER, 'Other', () => {
    // Each of these is a single item in the scoreboard
    worldInitializations();
    mostPlayersOnline();
    longestInactivity();
})

function worldInitializations() {
    world.afterEvents.worldInitialize.subscribe((event) => {
        eventManager.increment(IDENTIFIER, { name: 'World Initialized' });
    });
}

function mostPlayersOnline() {
    world.afterEvents.playerJoin.subscribe((event) => {
        const playerCount = world.getAllPlayers().length;
        const highestPlayersOnline = eventManager.getCount(IDENTIFIER, 'Most Players On');
        if (highestPlayersOnline < playerCount)
            eventManager.setCount(IDENTIFIER, { name: 'Most Players On' }, playerCount);
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
            eventManager.setCount(IDENTIFIER, 'Inactivity', currentInactivity);
    }, 20*60);
}
