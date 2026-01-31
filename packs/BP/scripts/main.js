import './src/config';

// Commands
import './src/commands/stat';

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
