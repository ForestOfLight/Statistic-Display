import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'totemsPopped';

eventManager.registerEvent(IDENTIFIER, 'Totems Popped', () => {
    world.afterEvents.entityHurt.subscribe((event) => {
        const entity = event.hurtEntity;
        if (!entity || entity.typeId !== 'minecraft:player')
            return;
        if (hasPoppedTotem(event.damage, event.damageSource))
            eventManager.increment(IDENTIFIER, entity);
    })
});

function hasPoppedTotem(damage, damageSource) {
    // When a totem is popped it sends two damage events. One will look like this and the other will be the actual damage taken.
    // This will hopefully be patched by Mojang in the future.
    return damage < 0 && damageSource.cause === 'none';
}