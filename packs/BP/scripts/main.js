import { CanopyExtension } from './lib/canopy/CanopyExtension';

export const extension = new CanopyExtension({
    name: 'StatisticDisplay',
    description: 'Statistic tracking for §l§aCanopy§r.',
    version: '1.1.12'
});

// Commands
import './src/commands/stat';
import './src/commands/statlist';
import './src/commands/statreset';
import './src/commands/statprint';
import './src/commands/statcarousel';

// Rules
import { showOfflinePlayers } from './src/rules/showOfflinePlayers';
import { showTotal } from './src/rules/showTotal';
import { carouselInterval } from './src/rules/carouselInterval';

extension.addRule(showOfflinePlayers);
extension.addRule(showTotal);
extension.addRule(carouselInterval);

// Events
import './src/events/blocksMined';
import './src/events/blocksPlaced';
import './src/events/deaths';
import './src/events/itemUsed';
import './src/events/playTime';
import './src/events/killed';
import './src/events/killedBy';
import './src/events/interactedWith';
import './src/events/highestXpLevel';
import './src/events/toolsBroken';
import './src/events/changedDimension';
import './src/events/effectsGained';
import './src/events/damageTaken';
import './src/events/damageDealt';
import './src/events/chats';
import './src/events/emotes';
import './src/events/joins';
import './src/events/timeSinceDeath';
import './src/events/longestSession';
import './src/events/other';
import './src/events/totemsPopped';
import './src/events/itemsPickedUp';
import './src/events/itemsDropped';

// Setup
import Display from './src/classes/Display';
import Carousel from './src/classes/Carousel';
import { world } from '@minecraft/server';
world.afterEvents.worldLoad.subscribe(() => {
    Display.onReload();
    Carousel.onReload();
});
