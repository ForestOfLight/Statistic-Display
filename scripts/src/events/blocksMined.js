import { system, world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";

const IDENTIFIER = 'blocksMined';

eventManager.registerEvent(IDENTIFIER, 'Blocks Mined', () => {
    world.beforeEvents.playerBreakBlock.subscribe((event) => {
        if (!event.player) 
            return;
        const blockType = event.block.typeId.replace('minecraft:', '');
        system.run(() => {
            eventManager.increment(IDENTIFIER, event.player);
            
            if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${blockType}`))
                eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${blockType}`, `${titleCase(blockType)} Mined`, () => {});
            eventManager.increment(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${blockType}`, event.player);
        });
    });
});
