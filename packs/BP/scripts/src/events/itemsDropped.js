import { EntityComponentTypes, system, world } from "@minecraft/server";
import eventManager from "../classes/EventManager";
import { titleCase } from "../utils";

const IDENTIFIER = 'itemsDropped';

eventManager.registerEvent(IDENTIFIER, 'Items Dropped', () => {
    world.afterEvents.entityItemDrop.subscribe((event) => {
        if (!event.entity)
            return;
        const itemStacks = event.items.map((itemEntity) => itemEntity?.getComponent(EntityComponentTypes.Item)?.itemStack);
        for (const itemStack of itemStacks) {
            const itemType = itemStack.typeId.replace("minecraft:", "");
            const count = itemStack.amount;
            system.run(() => {
                eventManager.addCount(IDENTIFIER, event.entity, count);
                
                if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`))
                    eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`, `${titleCase(itemType)} Picked Up`, () => {});
                eventManager.addCount(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`, event.entity, count);
            });
        }
    }, { entityFilter: { type: "minecraft:player" } });
});
