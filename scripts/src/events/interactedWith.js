import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";
import { SUBEVENT_DELIMITER } from "src/config";

const IDENTIFIER = 'interactedWith';

eventManager.registerEvent(IDENTIFIER, 'Interacted', () => {
    world.afterEvents.playerInteractWithBlock.subscribe((event) => {
        if (!event.player)
            return;
        eventManager.increment(IDENTIFIER, event.player);
        
        const blockType = event.block.typeId.replace('minecraft:', '');
        if (!eventManager.isRegistered(`${IDENTIFIER}${SUBEVENT_DELIMITER}${blockType}`))
            eventManager.registerEvent(`${IDENTIFIER}${SUBEVENT_DELIMITER}${blockType}`, `Interacted with ${titleCase(blockType)}`, () => {});
        eventManager.increment(`${IDENTIFIER}${SUBEVENT_DELIMITER}${blockType}`, event.player);
    });

    world.afterEvents.playerInteractWithEntity.subscribe((event) => {
        if (!event.player)
            return;
        const entityID = event.target?.typeId.replace('minecraft:', '');
        if (!entityID)
            return;
        eventManager.increment(IDENTIFIER, event.player);

        if (!eventManager.isRegistered(`${IDENTIFIER}${SUBEVENT_DELIMITER}${entityID}`))
            eventManager.registerEvent(`${IDENTIFIER}${SUBEVENT_DELIMITER}${entityID}`, `Interacted with ${titleCase(entityID)}`, () => {});
        eventManager.increment(`${IDENTIFIER}${SUBEVENT_DELIMITER}${entityID}`, event.player);
    });
});
