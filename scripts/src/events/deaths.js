import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'deaths'

eventManager.registerEvent(IDENTIFIER, 'Deaths', () => {
    world.afterEvents.entityDie.subscribe((event) => {
        if (event.deadEntity && event.deadEntity.typeId === 'minecraft:player') {
            eventManager.increment(IDENTIFIER, event.deadEntity);
        }
    });
});