import { Rule, Command } from 'lib/canopy/CanopyExtension';
import { extension } from 'src/config';
import eventManager from 'src/classes/EventManager';
import Display from 'src/classes/Display';
import Carousel from 'src/classes/Carousel';

const commandStatRule = new Rule({
    identifier: 'commandStat',
    description: 'Enables stat command.'
});
extension.addRule(commandStatRule);

const statCommand = new Command({
    name: 'stat',
    description: 'Toggles custom statistics in the world\'s scoreboard.',
    usage: 'stat [args...]',
    callback: statCommandCallback,
    args: [
        { type: 'string', name: 'argOne' },
        { type: 'string', name: 'argTwo' },
        { type: 'string|number', name: 'argThree' }
    ],
    contingentRules: ['commandStat'],
    helpEntries: [
        { usage: 'stat list', description: 'List all available statistics.' },
        { usage: 'stat <statistic>', description: 'Display a statistic on the scoreboard. (Format: eventName:sub_type)' },
        { usage: 'stat <statistic/all> reset', description: 'Reset all counts for the specified statistic.' },
        { usage: 'stat hide', description: 'Hides the scoreboard.' },
        { usage: 'stat <statistic> print [player]', description: 'Prints the top 10 or a specific player for the specified statistic.' },
        { usage: 'stat carousel [start/stop]', description: 'Starts or stops the statistic carousel.' },
        { usage: 'stat carousel <add/remove> <statistic>', description: 'Adds or removes a statistic from the carousel.' },
        { usage: 'stat carousel list', description: 'Lists all statistics in the carousel.' },
        { usage: 'stat carousel interval [seconds]', description: 'Sets the interval for the statistic carousel.' },
        { usage: 'stat toggle [total/offline]', description: 'Toggles whether the total field or offline players should be shown.' }
    ]
});
extension.addCommand(statCommand);

function statCommandCallback(sender, args) {
    let { argOne, argTwo, argThree } = args;
    if (argOne === null)
        return statCommand.sendUsage(sender);

    if (argOne === 'hide') {
        Carousel.stop();
        Display.hide();
        sender.sendMessage('§7Hid the statistics display.');
    } else if (argOne === 'list') {
        sender.sendMessage(`§aAvailable statistic names:${formatStatNames()}`);
    } else if (argTwo === 'reset' && argOne === 'all') {
        eventManager.resetAll();
        sender.sendMessage('§7Reset all statistics.');
    } else if (argTwo === 'reset' && eventManager.exists(argOne)) {
        eventManager.reset(argOne);
        sender.sendMessage(`§7Reset statistics for '${argOne}'.`);
    } else if (argTwo === 'print' && eventManager.exists(argOne)) {
        if (argThree === null)
            Display.printTop(sender, argOne);
        else
            Display.printPlayer(sender, argOne, argThree);
    } else if (argOne === 'toggle') {
        const state = Display.toggleSetting(argTwo);
        if (state !== null)
            sender.sendMessage(`§7Toggled setting: ${state.setting} - ${state.newValue ? '§aenabled' : '§cdisabled'}§7.`);
        else
            sender.sendMessage(`§cInvalid setting: ${argTwo}.`);
    } else if (argOne === 'carousel') {
        carouselHandler(sender, argTwo, argThree);
    } else if (eventManager.exists(argOne)) {
        const success = Display.set(argOne);
        if (success) {
            Carousel.stop();
            sender.sendMessage(`§7Set the statistics display to '${argOne}'.`);
        } else {
            sender.sendMessage('§cFailed to set the statistics display.');
        }
    } else {
        sender.sendMessage(`§cStatistic '${argOne}' not found.`);
    }
}

function formatStatNames() {
    const eventList = eventManager.getEventIDs();
    const baseEvents = []
    const subEvents = {};
    const heirarchySeparator = ':';

    for (const eventID of eventList) {
        if (!eventID.includes(heirarchySeparator)) {
            baseEvents.push(eventID);
            subEvents[eventID] = [];
        }
    }
    for (const baseEvent of baseEvents) {
        for (const eventID of eventList) {
            if (eventID.includes(baseEvent + heirarchySeparator) && eventID !== baseEvent) {
                subEvents[baseEvent].push(eventID.replace(baseEvent + heirarchySeparator, ''));
            }
        }
    }

    let output = '';
    for (const eventID of Object.keys(subEvents)) {
        output += `\n §7- §f${eventID}`;
        if (subEvents[eventID].length > 0)
            output += `§8${heirarchySeparator}[${subEvents[eventID].join('/')}]`;
    }
    return output;
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
