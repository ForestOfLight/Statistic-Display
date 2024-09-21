import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";

const IDENTIFIER = 'killed';

eventManager.registerEvent(IDENTIFIER, 'Entities Killed', () => {
    world.afterEvents.entityDie.subscribe((event) => {
        if (event.damageSource.damagingEntity?.typeId !== 'minecraft:player')
            return;
        const entityID = event.deadEntity.typeId.replace('minecraft:', '');
        eventManager.increment(IDENTIFIER, event.damageSource.damagingEntity);

        if (!eventManager.isRegistered(`${IDENTIFIER}_${entityID}`))
            eventManager.registerEvent(`${IDENTIFIER}_${entityID}`, `${titleCase(entityID)} Killed`, () => {});
        eventManager.increment(`${IDENTIFIER}_${entityID}`, event.damageSource.damagingEntity);
    });
});
