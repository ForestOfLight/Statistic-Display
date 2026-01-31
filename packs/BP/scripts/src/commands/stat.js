import { Command } from 'lib/canopy/CanopyExtension';
import { extension } from '../config';
import eventManager from '../classes/EventManager';
import Display from '../classes/Display';
import Carousel from '../classes/Carousel';
import { StatList } from '../classes/StatList';
import { recolor } from '../utils';

const statCommand = new Command({
    name: 'stat',
    description: { text: 'Toggles custom statistics in the world\'s scoreboard.' },
    usage: 'stat [args...]',
    callback: statCommandCallback,
    args: [
        { type: 'string', name: 'argOne' },
        { type: 'string', name: 'argTwo' },
        { type: 'string|number', name: 'argThree' }
    ],
    helpEntries: [
        { usage: 'stat list [statistic/searchterm]', description: { text: 'List all available statistics. Use the searchterm to search for specific identifiers.' } },
        { usage: 'stat <statistic>', description: { text: 'Display a statistic on the scoreboard. (Format: eventName:sub_type)' } },
        { usage: 'stat <statistic/all> reset', description: { text: 'Reset all counts for the specified statistic.' } },
        { usage: 'stat hide', description: { text: 'Hides the scoreboard.' } },
        { usage: 'stat <statistic> print [player]', description: { text: 'Prints the top 15 or a specific player for the specified statistic.' } },
        { usage: 'stat carousel [start/stop]', description: { text: 'Starts or stops the statistic carousel.' } },
        { usage: 'stat carousel <add/remove> <statistic>', description: { text: 'Adds or removes a statistic from the carousel.' } },
        { usage: 'stat carousel list', description: { text: 'Lists all statistics in the carousel.' } },
        { usage: 'stat carousel interval [seconds]', description: { text: 'Sets the interval for the statistic carousel.' } },
        { usage: 'stat toggle [total/offline]', description: { text: 'Toggles whether the total field or offline players should be shown.' } }
    ]
});
extension.addCommand(statCommand);

function statCommandCallback(sender, args) {
    let { argOne, argTwo, argThree } = args;
    if (argOne === null)
        return statCommand.sendUsage(sender);

    const eventID = eventManager.getEventIDCaseInsensitive(argOne);
    if (argOne === 'hide') {
        Carousel.stop();
        Display.hide();
        sender.sendMessage('§7Hid the statistics display.');
    } else if (argOne === 'list') {
        listHandler(sender, argTwo);
    } else if (argTwo === 'reset' && argOne === 'all') {
        eventManager.resetAll();
        sender.sendMessage('§7Reset all statistics.');
    } else if (argTwo === 'reset' && eventID) {
        eventManager.reset(eventID);
        sender.sendMessage(`§7Reset statistics for '${eventID}'.`);
    } else if (argTwo === 'print' && eventID) {
        if (argThree === null)
            Display.printTop(sender, eventID);
        else
            Display.printPlayer(sender, eventID, argThree);
    } else if (argOne === 'toggle') {
        const state = Display.toggleSetting(argTwo);
        if (state !== null)
            sender.sendMessage(`§7Toggled setting: ${state.setting} - ${state.newValue ? '§aenabled' : '§cdisabled'}§7.`);
        else
            sender.sendMessage(`§cInvalid setting: ${argTwo}.`);
    } else if (argOne === 'carousel') {
        carouselHandler(sender, argTwo, argThree);
    } else if (eventID) {
        const success = Display.set(eventID);
        if (success) {
            Carousel.stop();
            sender.sendMessage(`§7Set the statistics display to '${eventID}'.`);
        } else {
            sender.sendMessage('§cFailed to set the statistics display.');
        }
    } else {
        sender.sendMessage(`§cStatistic '${argOne}' not found.`);
    }
}

function listHandler(sender, searchTerm) {
    if (!searchTerm) {
        printBaseStats(sender);
    } else {
        handleSubEventSearch(sender, searchTerm);
    }
}

function printBaseStats(sender) {
    const statList = new StatList(eventManager.getEventIDs());
    let output = '';
    for (const eventID of statList.getBaseEventIDs()) {
        const subIDs = statList.getSubEventIDs(eventID);
        output += `\n §7- ${eventID}`;
        if (subIDs.length > 0)
            output += `§8${eventManager.SUBEVENT_DELIMITER}identifier`;
    }
    sender.sendMessage(`§7Available statistics:${output}\n§aUse ${Command.getPrefix()}stat list <statistic/searchterm> to search for specific identifiers (block or entity IDs).`);
}

function handleSubEventSearch(sender, searchTerm) {
    const statList = new StatList(eventManager.getEventIDs());
    const baseEvents = statList.getBaseEventIDs();
    if (baseEvents.includes(searchTerm)) {
        printAllSubEventsForBase(sender, statList, searchTerm);
    } else {
        printSubEventSearch(sender, statList, searchTerm);
    }
}

function printAllSubEventsForBase(sender, statList, baseEvent) {
    const subEvents = statList.getSubEventIDs(baseEvent);
    if (subEvents.length > 0) {
        let output = `§7Sub-statistics for '${baseEvent}':`;
        for (const subEvent of subEvents)
            output += `\n §7- ${baseEvent}${eventManager.SUBEVENT_DELIMITER}§f${subEvent}`;
        sender.sendMessage(output);
    } else {
        sender.sendMessage(`§cThere are no sub-statistics for '${baseEvent}'.`);
    }
}

function printSubEventSearch(sender, statList, searchTerm) {
    let output = `§7Sub-statistic search results for '${searchTerm}':`;
    const baseEvents = statList.getBaseEventIDs();
    for (const baseEvent of baseEvents) {
        const subEvents = statList.getSubEventIDs(baseEvent).filter(subEvent => subEvent.includes(searchTerm));
        if (subEvents.length > 0) {
            output += `\n §7- ${baseEvent}${eventManager.SUBEVENT_DELIMITER}§f${subEvents.join('§7, §f')}`;
        }
    }
    sender.sendMessage(recolor(output, searchTerm, '§a'));
}

function carouselHandler(sender, action, arg) {
    switch (action) {
        case 'start':
            Carousel.start();
            sender.sendMessage('§7Started the statistic carousel.');
            break;
        case 'stop':
            Carousel.stop();
            sender.sendMessage('§7Stopped the statistic carousel.');
            break;
        case 'interval':
            if (arg === null)
                return sender.sendMessage(`§7Current carousel interval: ${Carousel.getInterval() / 20} seconds.`);
            const seconds = parseInt(arg);
            if (isNaN(seconds))
                return sender.sendMessage(`§cInvalid interval: ${arg}.`);
            Carousel.setInterval(seconds);
            sender.sendMessage(`§7Set carousel interval to ${seconds} seconds.`);
            break;
        case 'add':
            if (!eventManager.exists(arg))
                return sender.sendMessage(`§cStatistic '${arg}' not found.`);
            Carousel.add(arg);
            sender.sendMessage(`§7Added '${arg}' to the carousel.`);
            break;
        case 'remove':
            if (!eventManager.exists(arg))
                return sender.sendMessage(`§cStatistic '${arg}' not found.`);
            Carousel.remove(arg);
            sender.sendMessage(`§7Removed '${arg}' from the carousel.`);
            break;
        case 'list':
            const entries = Carousel.getEntries();
            if (entries.length === 0)
                return sender.sendMessage('§7No statistics in the carousel.');
            sender.sendMessage(`§aStatistics in the carousel:${entries.map(entry => `\n §7- ${entry}`).join('')}`);
            break;
        default:
            sender.sendMessage(`§cInvalid carousel action: ${action}.`);
            break;
    }
}
