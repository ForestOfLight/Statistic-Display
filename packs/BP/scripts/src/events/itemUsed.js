import { system, world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";

const IDENTIFIER = 'itemsUsed';

eventManager.registerEvent(IDENTIFIER, 'Items Used', () => {
    world.beforeEvents.itemUse.subscribe((event) => {
        if (!event.source) 
            return;
        const itemType = event.itemStack.typeId.replace('minecraft:', '');
        system.run(() => {
            eventManager.increment(IDENTIFIER, event.source);

            if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`))
                eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`, `${titleCase(itemType)} Used`, () => {});
            eventManager.increment(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`, event.source);
        });
    });
});
