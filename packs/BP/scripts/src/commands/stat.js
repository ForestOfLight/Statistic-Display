import { Command, PlayerCommandOrigin, BlockCommandOrigin, EntityCommandOrigin, ServerCommandOrigin } from "../../lib/canopy/CanopyExtension";
import { CustomCommandParamType, CommandPermissionLevel, CustomCommandStatus, system } from "@minecraft/server";
import eventManager from "../classes/EventManager";
import Carousel from "../classes/Carousel";
import Display from "../classes/Display";

export class StatCommand extends Command {
    constructor() {
        super({
            name: 'stat:stat',
            description: "Display a statistic on the scoreboard. Use 'hide' to hide the scoreboard. (Statisic format: eventName:sub_type)",
            optionalParameters: [{ name: 'statistic', type: CustomCommandParamType.String }],
            permissionLevel: CommandPermissionLevel.Any,
            allowedSources: [PlayerCommandOrigin, BlockCommandOrigin, EntityCommandOrigin, ServerCommandOrigin],
            callback: (origin, ...args) => this.statCommand(origin, ...args)
        });
    }

    statCommand(origin, statistic) {
        if (statistic === 'hide') {
            system.run(() => {
                Carousel.stop();
                Display.hide();
            });
            return { status: CustomCommandStatus.Success, message: '§7Hid the statistics display.' };
        }
        const eventID = eventManager.getEventIDCaseInsensitive(statistic);
        if (!eventID)
            return { status: CustomCommandStatus.Failure, message: `§cStatistic '${statistic}' not found.` };
        system.run(() => {
            const success = Display.set(eventID);
            if (success) {
                Carousel.stop();
                return origin.sendMessage(`§7Set the statistics display to '${eventID}'.`);
            } else {
                return origin.sendMessage('§cFailed to set the statistics display.');
            }
        });
    }
}

export const statCommand = new StatCommand();