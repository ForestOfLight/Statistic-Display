import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";

const IDENTIFIER = 'damageTaken';

eventManager.registerEvent(IDENTIFIER, 'Damage Taken', () => {
    world.afterEvents.entityHurt.subscribe((event) => {
        if (!event.hurtEntity || event.hurtEntity.typeId !== 'minecraft:player')
            return;
        eventManager.addCount(IDENTIFIER, event.hurtEntity, event.damage);
        
        const damageCause = event.damageSource.cause;
        if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${damageCause}`))
            eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${damageCause}`, `${titleCase(damageCause)} Damage Taken`, () => {});
        eventManager.addCount(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${damageCause}`, event.hurtEntity, event.damage);
    });
});