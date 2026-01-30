import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";

const IDENTIFIER = 'changedDimension';

eventManager.registerEvent(IDENTIFIER, 'Changed Dimensions', () => {
    world.afterEvents.playerDimensionChange.subscribe((event) => {
        if (!event.player) 
            return;
        eventManager.increment(IDENTIFIER, event.player);
        
        const dimensionStr = event.toDimension.id.replace('minecraft:', '').replace('the_', '');
        if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${dimensionStr}`))
            eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${dimensionStr}`, `Changed Dimension to ${titleCase(dimensionStr)}`, () => {});
        eventManager.increment(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${dimensionStr}`, event.player);
    });
});
