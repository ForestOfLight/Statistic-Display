import { system, world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";

const IDENTIFIER = 'toolsBroken';

eventManager.registerEvent(IDENTIFIER, 'Tools Broken', () => {
    world.beforeEvents.playerBreakBlock.subscribe((event) => {
        if (!event.player) 
            return;
        const toolType = event.itemStack?.typeId.replace('minecraft:', '');
        const durabilityComponent = event.itemStack?.getComponent('durability');
        if (!durabilityComponent || durabilityComponent.maxDurability - durabilityComponent.damage > 0)
            return;
        system.run(() => {
            eventManager.increment(IDENTIFIER, event.player);
            if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${toolType}`))
                eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${toolType}`, `${titleCase(toolType)} Broken`, () => {});
            eventManager.increment(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${toolType}`, event.player);
        });
    });
});
