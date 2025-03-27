import { system, world, ItemComponentTypes } from "@minecraft/server";
import eventManager from "../classes/EventManager";
import { titleCase } from "../utils";

const IDENTIFIER = 'toolsBroken';

eventManager.registerEvent(IDENTIFIER, 'Tools Broken', () => {
    world.afterEvents.playerBreakBlock.subscribe((event) => {
        const player = event.player;
        const itemStackBeforeBreak = event.itemStackBeforeBreak;
        if (!player || !itemStackBeforeBreak)
            return;
        const toolType = itemStackBeforeBreak?.typeId.replace('minecraft:', '');
        if (!hasBroken(itemStackBeforeBreak, event.itemStackAfterBreak))
            return;
        system.run(() => {
            eventManager.increment(IDENTIFIER, player);
            if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${toolType}`))
                eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${toolType}`, `${titleCase(toolType)} Broken`, () => {});
            eventManager.increment(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${toolType}`, player);
        });
    });
});

function hasBroken(toolBeforeBreak, toolAfterBreak) {
    const durabilityComponent = toolBeforeBreak.getComponent(ItemComponentTypes.Durability);
    if (!durabilityComponent)
        return false;
    const isDurabilityZero = durabilityComponent.maxDurability - durabilityComponent.damage === 0;
    if (isDurabilityZero && !toolAfterBreak)
        return true;
    return false;
}
