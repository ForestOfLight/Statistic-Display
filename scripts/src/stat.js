import { Rule, Command } from 'lib/canopy/CanopyExtension';
import { extension } from 'src/config';
import eventManager from 'src/classes/EventManager';

const commandStatRule = new Rule({
    identifier: 'commandStat',
    description: 'Enables/disables the stat command.',
});
extension.addRule(commandStatRule);

const statCommand = new Command({
    name: 'stat',
    description: 'Toggles custom statistics in the world\'s scoreboard.',
    usage: 'stat <statistic/clear/list> [reset]',
    callback: statCommandCallback,
    args: [
        { type: 'string', name: 'name' },
        { type: 'string', name: 'reset'}
    ],
    contingentRules: ['commandStat'],
    helpEntries: [
        { usage: 'stat <statistic>', description: 'Set the statistics display to the specified name.' },
        { usage: 'stat clear', description: 'Clear the statistics display.' },
        { usage: 'stat list', description: 'List all available statistics.' },
        { usage: 'stat <statistic> reset', description: 'Clear all statistics for the specified name.' }
    ]
});
extension.addCommand(statCommand);

function statCommandCallback(sender, args) {
    let { name, reset } = args;
    if (name === null)
        return statCommand.sendUsage(sender);

    if (name === 'clear') {
        eventManager.clearDisplay();
        sender.sendMessage('§7Cleared the statistics display.');
    } else if (name === 'list') {
        sender.sendMessage(`§aAvailable statistic names:${formatStatNames()}`);
    } else if (reset === 'reset' && eventManager.exists(name)) {
        eventManager.reset(name);
        sender.sendMessage(`§7Cleared all statistics for '${name}'.`)
    } else if (eventManager.exists(name)) {
        eventManager.setDisplay(name);
        sender.sendMessage(`§7Set the statistics display to '${name}'.`);
    } else {
        sender.sendMessage(`§cStatistic '${name}' not found.`);
    }
}

function formatStatNames() {
    const eventList = eventManager.getEventIDs();
    const baseEvents = []
    const subEvents = {};

    for (const eventID of eventList) {
        if (!eventID.includes('_')) {
            baseEvents.push(eventID);
            subEvents[eventID] = [];
        }
    }
    for (const baseEvent of baseEvents) {
        for (const eventID of eventList) {
            if (eventID.includes(baseEvent) && eventID !== baseEvent) {
                subEvents[baseEvent].push(eventID.replace(baseEvent + '_', ''));
            }
        }
    }

    let output = '';
    for (const eventID of Object.keys(subEvents)) {
        output += `\n §7- §f${eventID}`;
        if (subEvents[eventID].length > 0)
            output += `§8_[${subEvents[eventID].join('/')}]`;
    }
    return output;
}