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

            if (!eventManager.isRegistered(`${IDENTIFIER}_${itemType}`))
                eventManager.registerEvent(`${IDENTIFIER}_${itemType}`, `${titleCase(itemType)} Used`, () => {});
            eventManager.increment(`${IDENTIFIER}_${itemType}`, event.source);
        });
    });
});
