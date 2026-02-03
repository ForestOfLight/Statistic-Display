import { system, world } from '@minecraft/server';
import Display from 'src/classes/Display.js';

const DP_ID = 'carouselData';

class Carousel {
    static entries = [];
    static interval = 20 * 10;
    static isActive = false;
    static runner = undefined;

    static getEntries() {
        return this.entries;
    }

    static add(entry) {
        this.entries.push(entry);
        this.saveData();
    }

    static remove(entry) {
        this.entries = this.entries.filter(e => e !== entry);
        this.saveData();
    }
    
    static getInterval() {
        return this.interval;
    }

    static setInterval(seconds) {
        this.interval = seconds * 20;
        this.saveData();
        this.stop();
        this.start();
    }

    static next() {
        const next = this.entries.shift();
        this.entries.push(next);
        return next;
    }

    static peek() {
        return this.entries[0];
    }

    static start() {
        this.isActive = true;
        if (this.runner)
            system.clearRun(this.runner);
        if (this.entries.length > 0) {
            this.next();
            this.runner = system.runInterval(() => {
                Display.set(this.next());
            }, this.interval);
        }
        this.saveData();
    }

    static stop() {
        this.isActive = false;
        if (this.runner)
            system.clearRun(this.runner);
        this.runner = undefined;
        this.saveData();
    }

    static saveData() {
        world.setDynamicProperty(DP_ID, JSON.stringify({
            entries: this.entries,
            interval: this.interval,
            isActive: this.isActive
        }));
    }

    static onReload() {
        if (!world.getDynamicPropertyIds().includes(DP_ID))
            this.saveData();
        const data = JSON.parse(world.getDynamicProperty(DP_ID));
        this.entries = data.entries;
        this.interval = data.interval;
        this.isActive = data.isActive;
        if (this.isActive)
            this.start();
    }
}

export default Carousel;