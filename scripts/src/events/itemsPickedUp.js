import { EntityComponentTypes, system, world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";
import { Vector } from "src/classes/Vector";
import { inventoryChange } from "src/classes/InventoryChangeEvent";

const IDENTIFIER = 'itemsPickedUp';

eventManager.registerEvent(IDENTIFIER, 'Items Picked Up', () => {
    world.beforeEvents.entityRemove.subscribe((entityRemoveEvent) => {
        if (!entityRemoveEvent.removedEntity || entityRemoveEvent.removedEntity.typeId !== 'minecraft:item') 
            return;

        // By JaylyMC, with some modifications
        const { removedEntity } = entityRemoveEvent;
        const itemStack = removedEntity.getComponent(EntityComponentTypes.Item)?.itemStack;
        if (!itemStack)
            return;
        const nearbyPlayers = removedEntity.dimension.getPlayers({
            location: Vector.subtract(removedEntity.location, { x: 1.5, y: 0.5, z: 1.5 }),
            volume: { x: 3, y: 2, z: 3 }
        });
        const inventoryChangeCallback = inventoryChange.subscribe((invChangeEvent) => {
            if (!nearbyPlayers.includes(invChangeEvent.player))
                return;
            for (const slotId of invChangeEvent.slotsChanged) {
                const invItem = invChangeEvent.container[slotId];
                if (invItem && invItem.typeId === itemStack.typeId) {
                    const itemType = itemStack.typeId.replace('minecraft:', '');
                    eventManager.addCount(IDENTIFIER, invChangeEvent.player, itemStack.amount);
                    console.warn(`Added ${itemStack.amount} to ${IDENTIFIER} for ${invChangeEvent.player.name}`);
                    if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`))
                        eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`, `${titleCase(itemType)} Picked Up`, () => {});
                    eventManager.addCount(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`, invChangeEvent.player, itemStack.amount);
                    console.warn(`Added ${itemStack.amount} to ${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType} for ${invChangeEvent.player.name}`);
                    inventoryChange.unsubscribe(inventoryChangeCallback);
                }
            }
        });
        system.run(() => {
            inventoryChange.unsubscribe(inventoryChangeCallback);
        });
    });
});
