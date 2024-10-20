import 'src/config';

// Commands
import 'src/commands/stat';
import 'src/commands/transferstats';

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

import Display from 'src/classes/Display';
import Carousel from 'src/classes/Carousel';
Display.onReload();
Carousel.onReload();
