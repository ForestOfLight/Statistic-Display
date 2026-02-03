import { VanillaCommand, PlayerCommandOrigin, BlockCommandOrigin, EntityCommandOrigin, ServerCommandOrigin } from "../../lib/canopy/CanopyExtension";
import { CustomCommandParamType, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";
import eventManager from "../classes/EventManager";
import { StatList } from "../classes/StatList";
import { recolor } from "../utils";

export class StatListCommand extends VanillaCommand {
    constructor() {
        super({
            name: 'stat:list',
            description: 'List all available statistics. Type an unknown statistic to search for specific identifiers.',
            optionalParameters: [{ name: 'searchterm', type: CustomCommandParamType.String }],
            permissionLevel: CommandPermissionLevel.Any,
            allowedSources: [PlayerCommandOrigin, BlockCommandOrigin, EntityCommandOrigin, ServerCommandOrigin],
            callback: (origin, ...args) => this.statListCommand(origin, ...args)
        });
    }

    statListCommand(origin, searchTerm) {
        if (searchTerm)
            return { status: CustomCommandStatus.Success, message: this.getSubEventSearchMessage(searchTerm) };
        else
            return { status: CustomCommandStatus.Success, message: this.getBaseStatsMessage() };
    }

    getBaseStatsMessage() {
        const statList = new StatList(eventManager.getEventIDs());
        let output = '';
        for (const eventID of statList.getBaseEventIDs()) {
            const subIDs = statList.getSubEventIDs(eventID);
            output += `\n §7- ${eventID}`;
            if (subIDs.length > 0)
                output += `§8${eventManager.SUBEVENT_DELIMITER}identifier`;
        }
        return `§7Available statistics:${output}\n§aUse /stat:list <statistic/searchterm> to search for specific identifiers (block or entity IDs).`;
    }

    getSubEventSearchMessage(searchTerm) {
        const statList = new StatList(eventManager.getEventIDs());
        const baseEvents = statList.getBaseEventIDs();
        const searchedEventID = eventManager.getEventIDCaseInsensitive(searchTerm);
        if (baseEvents.includes(searchedEventID))
            return this.getAllSubEventsForBaseMessage(statList, searchedEventID);
        else
            return this.getEventSearchMessage(statList, searchTerm);
    }

    getAllSubEventsForBaseMessage(statList, baseEvent) {
        const subEvents = statList.getSubEventIDs(baseEvent);
        if (subEvents.length > 0) {
            let output = `§7Sub-statistics for '${baseEvent}':`;
            for (const subEvent of subEvents)
                output += `\n §7- ${baseEvent}${eventManager.SUBEVENT_DELIMITER}§f${subEvent}`;
            return output;
        } else {
            return `§cThere are no sub-statistics for '${baseEvent}'.`;
        }
    }

    getEventSearchMessage(statList, searchTerm) {
        let output = `§7Sub-statistic search results for '${searchTerm}':`;
        const baseEvents = statList.getBaseEventIDs();
        for (const baseEvent of baseEvents) {
            const subEvents = statList.getSubEventIDs(baseEvent).filter(subEvent => (baseEvent + subEvent).includes(searchTerm));
            if (subEvents.length > 0) {
                output += `\n §7- ${baseEvent}${eventManager.SUBEVENT_DELIMITER}§f${subEvents.join('§7, §f')}`;
            }
        }
        return recolor(output, searchTerm, '§a');
    }
}

export const statListCommand = new StatListCommand();