import { EntityComponentTypes, system, world } from "@minecraft/server";
import eventManager from "../classes/EventManager";
import { titleCase } from "../utils";

const IDENTIFIER = 'itemsPickedUp';

eventManager.registerEvent(IDENTIFIER, 'Items Picked Up', () => {
    world.beforeEvents.entityItemPickup.subscribe((event) => {
        if (!event.entity)
            return;
        const itemStack = event.item?.getComponent(EntityComponentTypes.Item)?.itemStack;
        const itemType = itemStack.typeId.replace("minecraft:", "");
        const count = itemStack.amount;
        system.run(() => {
            eventManager.addCount(IDENTIFIER, event.entity, count);
            
            if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`))
                eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`, `${titleCase(itemType)} Picked Up`, () => {});
            eventManager.addCount(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`, event.entity, count);
        });
    }, { entityFilter: { type: "minecraft:player" } });
});
