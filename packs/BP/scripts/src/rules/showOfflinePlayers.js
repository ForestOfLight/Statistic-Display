import { BooleanRule } from "../../lib/canopy/CanopyExtension";
import { world, system } from '@minecraft/server';
import Display from "../classes/Display";
import { extension } from "../config";

class ShowOfflinePlayers extends BooleanRule {
    constructor() {
        super({
            identifier: 'showOfflinePlayers',
            description: 'Whether to show offline players in the statistic display.',
            defaultValue: true,
            onEnableCallback: () => this.subscribeToEvents(),
            onDisableCallback: () => this.unsubscribeFromEvents()
        });
        this.onPlayerJoinBound = this.onPlayerJoin.bind(this);
        this.onPlayerLeaveBound = this.onPlayerLeave.bind(this);
    }

    subscribeToEvents() {
        world.afterEvents.playerJoin.subscribe(this.onPlayerJoinBound);
        world.afterEvents.playerLeave.subscribe(this.onPlayerLeaveBound);
        Display.update()
    }

    unsubscribeFromEvents() {
        world.afterEvents.playerJoin.unsubscribe(this.onPlayerJoinBound);
        world.afterEvents.playerLeave.unsubscribe(this.onPlayerLeaveBound);
        Display.update();
    }

    onPlayerJoin(event) {
        if (Display.currentEvent) {
            const runner = system.runInterval(() => {
                if (!world.getAllPlayers().includes(world.getEntity(event.playerId)))
                    return;
                Display.update();
                system.clearRun(runner);
            });
        }
    }

    onPlayerLeave() {
        if (Display.currentEvent)
            Display.update();
    }
}

export const showOfflinePlayers = new ShowOfflinePlayers();
extension.addRule(showOfflinePlayers);