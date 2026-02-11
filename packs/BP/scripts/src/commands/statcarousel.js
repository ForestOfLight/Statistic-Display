import { Command, PlayerCommandOrigin, BlockCommandOrigin, EntityCommandOrigin, ServerCommandOrigin } from "../../lib/canopy/CanopyExtension";
import { CustomCommandParamType, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";
import eventManager from "../classes/EventManager";
import Carousel from "../classes/Carousel";

const CAROUSEL_ACTIONS = Object.freeze({
    START: 'start',
    STOP: 'stop',
    ADD: 'add',
    REMOVE: 'remove',
    LIST: 'list'
});

export class StatCarouselCommand extends Command {
    constructor() {
        super({
            name: 'stat:carousel',
            description: "Manages the statistic carousel.",
            enums: [{ name: 'stat:carouselActions', values: Object.values(CAROUSEL_ACTIONS) }],
            mandatoryParameters: [{ name: 'stat:carouselActions', type: CustomCommandParamType.Enum }],
            optionalParameters: [{ name: 'statistic', type: CustomCommandParamType.String }],
            permissionLevel: CommandPermissionLevel.Any,
            allowedSources: [PlayerCommandOrigin, BlockCommandOrigin, EntityCommandOrigin, ServerCommandOrigin],
            callback: (origin, ...args) => this.statCarouselCommand(origin, ...args)
        });
    }

    statCarouselCommand(origin, action, statistic) {
        switch (action) {
            case CAROUSEL_ACTIONS.START:
                Carousel.start();
                return { status: CustomCommandStatus.Success, message: '§7Started the statistic carousel.' };
            case CAROUSEL_ACTIONS.STOP:
                Carousel.stop();
                return { status: CustomCommandStatus.Success, message: '§7Stopped the statistic carousel.' };
            case CAROUSEL_ACTIONS.ADD:
                return this.add(statistic);
            case CAROUSEL_ACTIONS.REMOVE:
                return this.remove(statistic);
            case CAROUSEL_ACTIONS.LIST:
                return this.list();
            default:
                return { status: CustomCommandStatus.Success, message: `§cInvalid carousel action: ${action}.` };
        }
    }

    add(statistic) {
        const eventID = eventManager.getEventIDCaseInsensitive(statistic);
        if (!eventID)
            return { status: CustomCommandStatus.Failure, message: `§cStatistic '${statistic}' not found.` };
        Carousel.add(eventID);
        return { status: CustomCommandStatus.Success, message: `§7Added '${eventID}' to the carousel.` };
    }

    remove(statistic) {
        const eventID = eventManager.getEventIDCaseInsensitive(statistic);
        if (!eventID)
            return { status: CustomCommandStatus.Failure, message: `§cStatistic '${statistic}' not found.` };
        Carousel.remove(eventID);
        return { status: CustomCommandStatus.Success, message: `§7Removed '${eventID}' from the carousel.` };
    }

    list() {
        const entries = Carousel.getEntries();
        if (entries.length === 0)
            return { status: CustomCommandStatus.Success, message: '§7No statistics in the carousel.' };
        return { status: CustomCommandStatus.Success, message: `§aStatistics in the carousel:${entries.map(entry => `\n §7- ${entry}`).join('')}` };
    }
}

export const statCarouselCommand = new StatCarouselCommand();