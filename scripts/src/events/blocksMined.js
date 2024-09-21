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
            eventManager.incrementTotal(IDENTIFIER);

            if (!eventManager.isRegistered(`${IDENTIFIER}_${blockType}`))
                eventManager.registerEvent(`${IDENTIFIER}_${blockType}`, `${titleCase(blockType)} Mined`, () => {});
            eventManager.increment(`${IDENTIFIER}_${blockType}`, event.player);
            eventManager.incrementTotal(`${IDENTIFIER}_${blockType}`);
        });
    });
});
