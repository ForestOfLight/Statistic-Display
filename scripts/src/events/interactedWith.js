import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";

const IDENTIFIER = 'interactedWith';

eventManager.registerEvent(IDENTIFIER, 'Interacted', () => {
    world.afterEvents.playerInteractWithBlock.subscribe((event) => {
        if (!event.player)
            return;
        eventManager.increment(IDENTIFIER, event.player);
        
        const blockType = event.block.typeId.replace('minecraft:', '');
        if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${blockType}`))
            eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${blockType}`, `Interacted with ${titleCase(blockType)}`, () => {});
        eventManager.increment(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${blockType}`, event.player);
    });

    world.afterEvents.playerInteractWithEntity.subscribe((event) => {
        if (!event.player)
            return;
        const entityID = event.target?.typeId.replace('minecraft:', '');
        if (!entityID)
            return;
        eventManager.increment(IDENTIFIER, event.player);

        if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${entityID}`))
            eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${entityID}`, `Interacted with ${titleCase(entityID)}`, () => {});
        eventManager.increment(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${entityID}`, event.player);
    });
});
