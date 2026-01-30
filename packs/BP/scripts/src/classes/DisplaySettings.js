import { world } from "@minecraft/server";

export class DisplaySettings {
    showOfflinePlayers;
    showTotal;

    constructor() {
        this.showOfflinePlayers = world.getDynamicProperty('showOfflinePlayers') === true;
        this.showTotal = world.getDynamicProperty('showTotal') === true;
    }

    get(setting) {
        return this[setting];
    }

    commit(setting, value) {
        if (typeof value !== 'boolean')
            throw new Error(`Invalid value for ${setting}: ${value}. Must be a boolean.`);
        world.setDynamicProperty(setting, value);
        this[setting] = value;
    }
}