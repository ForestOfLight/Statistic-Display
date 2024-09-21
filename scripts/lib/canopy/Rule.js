import { world } from '@minecraft/server';

class Rule {
    #identifier;
    #description;
    #contingentRules;
    #independentRules;

    constructor({ identifier, description, contingentRules = [], independentRules = [] }) {
        this.#identifier = identifier;
        this.#description = description;
        this.#contingentRules = contingentRules;
        this.#independentRules = independentRules;
    }

    getID() {
        return this.#identifier;
    }

    getDescription() {
        return this.#description;
    }

    getContigentRules() {
        return this.#contingentRules;
    }

    getIndependentRules() {
        return this.#independentRules;
    }

    getValue() {
        const value = world.getDynamicProperty(this.#identifier);
        if (value === 'true')
            return true;
        if (['false', undefined].includes(value))
            return false;
        throw new Error(`Rule ${this.#identifier} has an invalid value: ${value}`);
    }
    
    setValue(value) {
        world.setDynamicProperty(this.#identifier, value);
    }
}

export default Rule;