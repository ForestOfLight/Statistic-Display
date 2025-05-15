import { Player, world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'totemsPopped';

eventManager.registerEvent(IDENTIFIER, 'Totems Popped', () => {
    world.afterEvents.entityHurt.subscribe((event) => {
        const entity = event.entity;
        if (!entity || !(entity instanceof Player))
            return;
        if (hasPoppedTotem(event.damage, event.damageSource))
            eventManager.increment(IDENTIFIER, entity);
    })
});

function hasPoppedTotem(damage, damageSource) {
    return damage < 0 && damageSource.cause === 'none';
}