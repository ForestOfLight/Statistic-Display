import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";

const IDENTIFIER = 'killedBy';

eventManager.registerEvent(IDENTIFIER, 'Killed By', () => {
    world.afterEvents.entityDie.subscribe((event) => {
        if (event.deadEntity?.typeId !== 'minecraft:player')
            return;
        const entityID = event.damageSource.damagingEntity?.typeId.replace('minecraft:', '');
        if (!entityID)
            return;
        eventManager.increment(IDENTIFIER, event.deadEntity);

        if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${entityID}`))
            eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${entityID}`, `Killed By ${titleCase(entityID)}`, () => {});
        eventManager.increment(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${entityID}`, event.deadEntity);
    });
});
