import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";

const IDENTIFIER = 'effectsGained';

eventManager.registerEvent(IDENTIFIER, 'Effects Gained', () => {
    world.afterEvents.effectAdd.subscribe((event) => {
        if (!event.entity || event.entity.typeId !== 'minecraft:player') 
            return;
        eventManager.increment(IDENTIFIER, event.entity);
        
        const effectStr = event.effect.typeId.replace('minecraft:', '');
        if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${effectStr}`))
            eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${effectStr}`, `Gained ${titleCase(effectStr)} Effect`, () => {});
        eventManager.increment(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${effectStr}`, event.entity);
    });
});