// By JaylyMC
import { EntityInventoryComponent, ItemCooldownComponent, ItemDurabilityComponent, ItemEnchantableComponent, ItemFoodComponent, ItemStack, system, world } from "@minecraft/server";

var PlayerInventoryStorage = [];

class InventoryChangeEvent {
    constructor(player, container) {
        this.slotsChanged = [];
        this.player = player;
        this.container = container;
    }
};

class InventoryChangeEventSignal {
    constructor() {
        /**
         * @internal
         */
        this.callbacks = [];
    }

    /**
     * @remarks
     * Adds a callback that will be called when an entity dies.
     * @param callback
     */
    subscribe(callback) {
        this.callbacks.push(callback);
        return callback;
    }

    /**
     * @remarks
     * Removes a callback from being called when an entity dies.
     * @param callback
     * @throws This function can throw errors.
     */
    unsubscribe(callback) {
        const index = this.callbacks.findIndex((value) => value === callback);
        this.callbacks.splice(index);
    }

    /**
     * @internal
     */
    trigger(event) {
        for (const callback of this.callbacks) {
            callback(event);
        }
    }
};

function shallowComparison(obj1 = {}, obj2 = {}) {
    let same = true;
    if (Object.keys(obj1).length === Object.keys(obj2).length) {
        const sameObject = [];
        for (const key in obj1) {
            sameObject.push(obj1[key] === obj2[key]);
        }
        ;
        if (sameObject.filter((v) => !v).length > 0) same = false;
    } else same = false;
    return same;
}

function ItemComponentCompare(item1, item2) {
    if (item1.getComponents().length !== item2.getComponents().length) return false;
    const foodEquals = shallowComparison(
        item1.getComponent(ItemFoodComponent.componentId) ?? {},
        item2.getComponent(ItemFoodComponent.componentId) ?? {}
    );
    const cooldownEquals = shallowComparison(
        item1.getComponent(ItemCooldownComponent.componentId) ?? {},
        item2.getComponent(ItemCooldownComponent.componentId) ?? {}
    );
    const enchantsEquals = (() => {
        const item1Enchants = item1.getComponent(ItemEnchantableComponent.componentId);
        const item2Enchants = item2.getComponent(ItemEnchantableComponent.componentId);
        return shallowComparison(item1Enchants?.getEnchantments(), item2Enchants?.getEnchantments());
    })();
    const durabilityEquals = shallowComparison(
        item1.getComponent(ItemDurabilityComponent.componentId) ?? {},
        item2.getComponent(ItemDurabilityComponent.componentId) ?? {}
    );
    return foodEquals && cooldownEquals && enchantsEquals && durabilityEquals;
}

function ItemStackEquals2(item1, item2) {
    if (item1 instanceof ItemStack && item2 instanceof ItemStack) {
        const amountEquals = item1.amount === item2.amount;
        const nameTagEquals = item1.nameTag === item2.nameTag;
        const typeIdEquals = item1.typeId === item2.typeId;
        const componentEquals = ItemComponentCompare(item1, item2);
        const loreEquals = shallowComparison(item1.getLore(), item2.getLore());
        return amountEquals && nameTagEquals && typeIdEquals && componentEquals && loreEquals;
    } else return typeof item1 === typeof item2;
}

var inventoryChange = new InventoryChangeEventSignal();

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const inventory = player.getComponent(EntityInventoryComponent.componentId);
        const pInventory = PlayerInventoryStorage.find((value) => value.player === player);
        const container = [];
        if (!inventory.container) continue;
        for (let slot = 0; slot < inventory.container.size; slot++) {
            const item = inventory.container.getItem(slot);
            container.push(item);
        }
        ;
        const event = new InventoryChangeEvent(player, container);
        if (!pInventory) PlayerInventoryStorage.push(event);
        else {
            let difference = pInventory.container.map((item, index) => ItemStackEquals2(item, container[index]));
            event.slotsChanged = difference.map((value, index) => value === false ? index : -1).filter((index) => index !== -1);
            pInventory.container = container;
            if (event.slotsChanged.length > 0) inventoryChange.trigger(event);
        }
    }
});

export { inventoryChange };