import { Rule, Command } from 'lib/canopy/CanopyExtension';
import { extension } from 'src/config';
import eventManager from 'src/classes/EventManager';
import Display from 'src/classes/Display';

const commandStatRule = new Rule({
    identifier: 'commandStat',
    description: 'Enables stat command.',
});
extension.addRule(commandStatRule);

const statCommand = new Command({
    name: 'stat',
    description: 'Toggles custom statistics in the world\'s scoreboard.',
    usage: 'stat [args...]',
    callback: statCommandCallback,
    args: [
        { type: 'string', name: 'name' },
        { type: 'string', name: 'argTwo' },
        { type: 'string', name: 'player' }
    ],
    contingentRules: ['commandStat'],
    helpEntries: [
        { usage: 'stat list', description: 'List all available statistics.' },
        { usage: 'stat <statistic>', description: 'Display a statistic on the scoreboard.' },
        { usage: 'stat <statistic/all> reset', description: 'Reset all counts for the specified statistic.' },
        { usage: 'stat clear', description: 'Hide the scoreboard.' },
        { usage: 'stat <statistic> print [player]', description: 'Prints the top 10 or a specific player for the specified statistic.' },
        { usage: 'stat toggle [total/offline]', description: 'Toggle the display of total or offline players.' }
    ]
});
extension.addCommand(statCommand);

function statCommandCallback(sender, args) {
    let { name, argTwo, player } = args;
    if (name === null)
        return statCommand.sendUsage(sender);

    if (name === 'clear') {
        Display.clear();
        sender.sendMessage('§7Hid the statistics display.');
    } else if (name === 'list') {
        sender.sendMessage(`§aAvailable statistic names:${formatStatNames()}`);
    } else if (argTwo === 'reset' && name === 'all') {
        eventManager.resetAll();
        sender.sendMessage('§7Reset all statistics.');
    } else if (argTwo === 'reset' && eventManager.exists(name)) {
        eventManager.reset(name);
        sender.sendMessage(`§7Reset all statistics for '${name}'.`);
    } else if (argTwo === 'print' && eventManager.exists(name)) {
        if (player === null)
            Display.printTop(sender, name);
        else
            Display.printPlayer(sender, name, player);
    } else if (name === 'toggle') {
        const state = Display.toggleSetting(argTwo);
        if (state !== null)
            sender.sendMessage(`§7Toggled setting: ${state.setting} - ${state.newValue ? '§aenabled' : '§cdisabled'}§7.`);
        else
            sender.sendMessage(`§cInvalid setting: ${argTwo}.`);
    } else if (eventManager.exists(name)) {
        const success = Display.set(name);
        if (success)
            sender.sendMessage(`§7Set the statistics display to '${name}'.`);
        else
            sender.sendMessage('§cFailed to set the statistics display.');
    } else {
        sender.sendMessage(`§cStatistic '${name}' not found.`);
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
