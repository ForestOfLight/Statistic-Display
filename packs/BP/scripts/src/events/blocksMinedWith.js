import { system, world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";

const IDENTIFIER = 'blocksMinedWith';

eventManager.registerEvent(IDENTIFIER, 'Blocks Mined With', () => {
    world.afterEvents.playerBreakBlock.subscribe((event) => {
        if (!event.player) 
            return;
        const brokenWithItemType = event.itemStackBeforeBreak?.typeId.replace('minecraft:', '') || 'hand';
        system.run(() => {        
            eventManager.increment(IDENTIFIER, event.player);
                
            if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${brokenWithItemType}`))
                eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${brokenWithItemType}`, `Blocks Mined With ${titleCase(brokenWithItemType)}`, () => {});
            eventManager.increment(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${brokenWithItemType}`, event.player);
        });
    });
});
