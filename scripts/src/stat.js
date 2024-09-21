import { Rule, Command } from 'lib/canopy/CanopyExtension';
import { extension } from 'src/config';
import eventManager from 'src/classes/EventManager';
import { world } from '@minecraft/server';

const commandStatRule = new Rule({
    identifier: 'commandStat',
    description: 'Enables stat command.',
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
        { usage: 'stat list', description: 'List all available statistics.' },
        { usage: 'stat <statistic>', description: 'Display a statistic on the scoreboard.' },
        { usage: 'stat clear', description: 'Hide the scoreboard.' },
        { usage: 'stat <statistic/all> reset', description: 'Reset all counts for the specified statistic.' }
    ]
});
extension.addCommand(statCommand);

function statCommandCallback(sender, args) {
    let { name, reset } = args;
    if (name === null)
        return statCommand.sendUsage(sender);

    if (name === 'clear') {
        eventManager.clearDisplay();
        sender.sendMessage('§7Hid the statistics display.');
    } else if (name === 'list') {
        sender.sendMessage(`§aAvailable statistic names:${formatStatNames()}`);
    } else if (reset === 'reset' && name === 'all') {
        eventManager.resetAll();
        sender.sendMessage('§7Reset all statistics.');
    } else if (reset === 'reset' && eventManager.exists(name)) {
        eventManager.reset(name);
        sender.sendMessage(`§7Reset all statistics for '${name}'.`)
    } else if (eventManager.exists(name)) {
        const success = eventManager.setDisplay(name);
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

    for (const eventID of eventList) {
        if (!eventID.includes('_')) {
            baseEvents.push(eventID);
            subEvents[eventID] = [];
        }
    }
    for (const baseEvent of baseEvents) {
        for (const eventID of eventList) {
            if (eventID.includes(baseEvent + '_') && eventID !== baseEvent) {
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
