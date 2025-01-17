import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";

const IDENTIFIER = 'blocksPlaced';

eventManager.registerEvent(IDENTIFIER, 'Blocks Placed', () => {
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
        if (!event.player)
            return;
        eventManager.increment(IDENTIFIER, event.player);
        
        const blockType = event.block.typeId.replace('minecraft:', '');
        if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${blockType}`))
            eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${blockType}`, `${titleCase(blockType)} Placed`, () => {});
        eventManager.increment(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${blockType}`, event.player);
    });
});
