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
        if (!eventManager.isRegistered(`${IDENTIFIER}_${blockType}`))
            eventManager.registerEvent(`${IDENTIFIER}_${blockType}`, `Interacted with ${titleCase(blockType)}`, () => {});
        eventManager.increment(`${IDENTIFIER}_${blockType}`, event.player);
    });

    world.afterEvents.playerInteractWithEntity.subscribe((event) => {
        if (!event.player)
            return;
        const entityID = event.target?.typeId.replace('minecraft:', '');
        if (!entityID)
            return;
        eventManager.increment(IDENTIFIER, event.player);

        if (!eventManager.isRegistered(`${IDENTIFIER}_${entityID}`))
            eventManager.registerEvent(`${IDENTIFIER}_${entityID}`, `Interacted with ${titleCase(entityID)}`, () => {});
        eventManager.increment(`${IDENTIFIER}_${entityID}`, event.player);
    });
});
