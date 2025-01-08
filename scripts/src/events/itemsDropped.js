import { EntityComponentTypes, EntityItemComponent, system, world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";
import { titleCase } from "src/utils";
import { Vector } from "src/classes/Vector";
import { inventoryChange } from "src/classes/InventoryChangeEvent";

const IDENTIFIER = 'itemsDropped';

eventManager.registerEvent(IDENTIFIER, 'Items Dropped', () => {
    world.afterEvents.entitySpawn.subscribe((entitySpawnEvent) => {
        // By JaylyMC, with some modifications
        const entity = entitySpawnEvent.entity;
        if (entity.typeId !== "minecraft:item" || !entity.isValid())
            return;
        const player = entity.dimension.getPlayers({ minDistance: 0 }).find((p) => Vector.distance(p.getViewDirection(), entity.getViewDirection()) === 0 );
        const itemStack = entity.getComponent(EntityComponentTypes.Item)?.itemStack;
        if (!player || !itemStack)
            return;
        const playerHealth = player.getComponent(EntityComponentTypes.Health)?.currentValue;
        if (playerHealth <= 0)
            return;
        console.warn(`Player ${player.name} dropped ${itemStack.amount} of ${itemStack.typeId}`);
        const inventoryChangeCallback = inventoryChange.subscribe((invChangeEvent) => {
            if (invChangeEvent.player !== player)
                return;
            for (const slotId of invChangeEvent.slotsChanged) {
                const invItem = invChangeEvent.container[slotId];
                if (invItem && invItem.typeId === itemStack.typeId) {
                    const itemType = itemStack.typeId.replace('minecraft:', '');
                    eventManager.addCount(IDENTIFIER, invChangeEvent.player, itemStack.amount);
                    if (!eventManager.isRegistered(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`))
                        eventManager.registerEvent(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`, `${titleCase(itemType)} Dropped`, () => {});
                    eventManager.addCount(`${IDENTIFIER}${eventManager.SUBEVENT_DELIMITER}${itemType}`, invChangeEvent.player, itemStack.amount);
                    inventoryChange.unsubscribe(inventoryChangeCallback);
                }
            }
        });
        system.run(() => {
            inventoryChange.unsubscribe(inventoryChangeCallback);
        });
    });
});
