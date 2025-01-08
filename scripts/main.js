import 'src/config';

// Commands
import 'src/commands/stat';

// Events
import 'src/events/blocksMined';
import 'src/events/blocksPlaced';
import 'src/events/deaths';
import 'src/events/itemUsed';
import 'src/events/playTime';
import 'src/events/killed';
import 'src/events/killedBy';
import 'src/events/interactedWith';
import 'src/events/highestXpLevel';
import 'src/events/toolsBroken';
import 'src/events/changedDimension';
import 'src/events/effectsGained';
import 'src/events/damageTaken';
import 'src/events/damageDealt';
import 'src/events/chats';
import 'src/events/emotes';
import 'src/events/joins';
import 'src/events/timeSinceDeath';
import 'src/events/longestSession';
import 'src/events/itemsPickedUp';
import 'src/events/itemsDropped';
import 'src/events/other';

// Setup
import Display from 'src/classes/Display';
import Carousel from 'src/classes/Carousel';
Display.onReload();
Carousel.onReload();
