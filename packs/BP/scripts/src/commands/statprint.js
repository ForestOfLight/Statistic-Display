import { Command, PlayerCommandOrigin, BlockCommandOrigin, EntityCommandOrigin, ServerCommandOrigin } from "../../lib/canopy/CanopyExtension";
import { CustomCommandParamType, CommandPermissionLevel, CustomCommandStatus, system } from "@minecraft/server";
import eventManager from "../classes/EventManager";
import Display from "../classes/Display";

export class StatPrintCommand extends Command {
    constructor() {
        super({
            name: 'stat:print',
            description: "Prints the top 15 or a specific player for the specified statistic.",
            mandatoryParameters: [{ name: 'statistic', type: CustomCommandParamType.String }],
            optionalParameters: [{ name: 'player', type: CustomCommandParamType.String }],
            permissionLevel: CommandPermissionLevel.Any,
            allowedSources: [PlayerCommandOrigin, BlockCommandOrigin, EntityCommandOrigin, ServerCommandOrigin],
            callback: (origin, ...args) => this.statPrintCommand(origin, ...args)
        });
    }

    statPrintCommand(origin, statistic, player) {
        const eventID = eventManager.getEventIDCaseInsensitive(statistic);
        if (!eventID)
            return { status: CustomCommandStatus.Failure, message: `§cStatistic '${statistic}' not found.` };
        if (!player)
            return { status: CustomCommandStatus.Success, message: Display.getTopMessage(eventID) };
        else
            return { status: CustomCommandStatus.Success, message: Display.getPlayerMessage(eventID, player) };
    }
}

export const statPrintCommand = new StatPrintCommand();