import { world } from "@minecraft/server";

class BulkDP {
    static DP_MAX_LENGTH = 32767;

    static load(bulkIdentifier) {
        if (!world.getDynamicPropertyIds().includes(bulkIdentifier))
            return [];
        
        let result = '';
        JSON.parse(world.getDynamicProperty(bulkIdentifier)).forEach(identifier => {
            result += world.getDynamicProperty(identifier);
        });
        return JSON.parse(result);
    }

    static save(bulkIdentifier, value) {
        const valueStr = JSON.stringify(value);
        const identifiers = [];
        for (let i = 0, chunkID = 0; i < valueStr.length; i += this.DP_MAX_LENGTH, chunkID++) {
            const chunk = valueStr.slice(i, i + this.DP_MAX_LENGTH);
            const identifier = `${bulkIdentifier}-${chunkID}`;
            world.setDynamicProperty(identifier, chunk);
            identifiers.push(identifier);
        }
        world.setDynamicProperty(bulkIdentifier, JSON.stringify(identifiers));
        return identifiers;
    }

    static remove(bulkIdentifier) {
        if (!world.getDynamicPropertyIds().includes(bulkIdentifier))
            throw Error(`[Stats] Could not remove dynamic property. Property '${bulkIdentifier}' not found.`);
        JSON.parse(world.getDynamicProperty(bulkIdentifier)).forEach(identifier => {
            world.setDynamicProperty(identifier, undefined);
        });
        world.setDynamicProperty(bulkIdentifier, undefined);
    }
}

export default BulkDP;