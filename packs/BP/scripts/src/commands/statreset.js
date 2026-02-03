import { Command, PlayerCommandOrigin, BlockCommandOrigin, EntityCommandOrigin, ServerCommandOrigin } from "../../lib/canopy/CanopyExtension";
import { CustomCommandParamType, CommandPermissionLevel, CustomCommandStatus, system } from "@minecraft/server";
import eventManager from "../classes/EventManager";

export class StatResetCommand extends Command {
    constructor() {
        super({
            name: 'stat:reset',
            description: "Reset all counts for the specified statistic. Use 'all' to reset all statistics.",
            optionalParameters: [{ name: 'statistic', type: CustomCommandParamType.String }],
            permissionLevel: CommandPermissionLevel.GameDirectors,
            allowedSources: [PlayerCommandOrigin, BlockCommandOrigin, EntityCommandOrigin, ServerCommandOrigin],
            callback: (origin, ...args) => this.statResetCommand(origin, ...args)
        });
    }

    statResetCommand(origin, statistic) {
        if (statistic === 'all') {
            system.run(() => eventManager.resetAll());
            return { status: CustomCommandStatus.Success, message: '§7Reset all statistics.' };
        } else {
            const eventID = eventManager.getEventIDCaseInsensitive(statistic);
            if (!eventID)
                return { status: CustomCommandStatus.Failure, message: `§cStatistic '${statistic}' not found.` };
            system.run(() => eventManager.reset(eventID));
            return { status: CustomCommandStatus.Success, message: `§7Reset statistics for '${eventID}'.` };
        }
    }
}

export const statResetCommand = new StatResetCommand();