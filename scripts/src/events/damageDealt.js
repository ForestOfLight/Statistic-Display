import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'damageDealt';

eventManager.registerEvent(IDENTIFIER, 'Damage Dealt', () => {
    world.afterEvents.entityHurt.subscribe((event) => {
        if (!event.damageSource.damagingEntity || event.damageSource.damagingEntity.typeId !== 'minecraft:player')
            return;
        eventManager.addCount(IDENTIFIER, event.damageSource.damagingEntity, event.damage);
    });
});