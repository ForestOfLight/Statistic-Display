import { world } from "@minecraft/server";

const DP_MAX_LENGTH = 32767;

export class BulkDP {
    bulkCache = void 0;

    constructor(bulkDPIdentifier) {
        this.bulkDPIdentifier = bulkDPIdentifier;
    }

    get() {
        if (this.bulkCache !== void 0)
            return this.bulkCache;
        if (!world.getDynamicPropertyIds().includes(this.bulkDPIdentifier)) {
            this.bulkCache = [];
            return this.bulkCache;
        }
        let result = '';
        JSON.parse(world.getDynamicProperty(this.bulkDPIdentifier)).forEach(identifier => {
            result += world.getDynamicProperty(identifier);
        });
        this.bulkCache = JSON.parse(result);
        return this.bulkCache;
    }

    set(value) {
        this.bulkCache = value;
        const valueStr = JSON.stringify(value);
        const identifiers = [];
        for (let i = 0, chunkID = 0; i < valueStr.length; i += this.DP_MAX_LENGTH, chunkID++) {
            const chunk = valueStr.slice(i, i + this.DP_MAX_LENGTH);
            const identifier = `${this.bulkDPIdentifier}-${chunkID}`;
            world.setDynamicProperty(identifier, chunk);
            identifiers.push(identifier);
        }
        world.setDynamicProperty(this.bulkDPIdentifier, JSON.stringify(identifiers));
        return identifiers;
    }

    delete() {
        if (!world.getDynamicPropertyIds().includes(this.bulkDPIdentifier))
            throw Error(`[Stats] Could not remove dynamic property. Property '${this.bulkDPIdentifier}' not found.`);
        JSON.parse(world.getDynamicProperty(this.bulkDPIdentifier)).forEach(identifier => {
            world.setDynamicProperty(identifier, void 0);
        });
        world.setDynamicProperty(this.bulkDPIdentifier, void 0);
        this.bulkCache = void 0;
    }
}
