import { world, EntityHealCause } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'totemsPopped';

eventManager.registerEvent(IDENTIFIER, 'Totems Popped', () => {
    world.afterEvents.entityHeal.subscribe((event) => {
        const entity = event.healedEntity;
        if (!entity || entity.typeId !== 'minecraft:player')
            return;
        if (hasPoppedTotem(event.healSource))
            eventManager.increment(IDENTIFIER, entity);
    })
});

function hasPoppedTotem(healSource) {
    return healSource.cause === EntityHealCause.TotemOfUndying;
}