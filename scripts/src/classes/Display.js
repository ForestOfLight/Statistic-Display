import { ObjectiveSortOrder, DisplaySlotId, world, system } from '@minecraft/server';
import eventManager from "./EventManager";

const DISPLAY_SLOT = DisplaySlotId.Sidebar;
const DISPLAY_OBJECTIVE_ID = 'statDisplay';

class Display {
    static currentEvent = undefined;
    static settings = {
        showOfflinePlayers: world.getDynamicProperty('showOfflinePlayers') === true,
        showTotal: world.getDynamicProperty('showTotal') === true
    }

    static onReload() {
        const activeObjective = world.scoreboard.getObjective(DISPLAY_OBJECTIVE_ID);
        if (!activeObjective)
            return;
        const activeEvent = eventManager.findEventByDisplayName(activeObjective.displayName);
        if (!activeEvent)
            throw Error(`[Stats] Could not reload. Did not find event with display name '${activeObjective.displayName}'.`);
        this.currentEvent = activeEvent;
        this.update(activeEvent);
    }

    static hide() {
        const success = world.scoreboard.clearObjectiveAtDisplaySlot(DISPLAY_SLOT);
        if (!success)
            return false;
        return true;
    }
    
    static set(eventID) {
        if (!eventManager.validateEventID(eventID))
            return false;

        const event = eventManager.getEvent(eventID);
        const eventData = event.getData();
        if (world.scoreboard.getObjective(DISPLAY_OBJECTIVE_ID))
            world.scoreboard.removeObjective(DISPLAY_OBJECTIVE_ID);
        const objective = world.scoreboard.addObjective(DISPLAY_OBJECTIVE_ID, event.displayName);
        eventData.participants.forEach(participant => {
            objective.setScore(participant.name + ' ', participant.score); // The space is necessary for Minecraft not to attach it to the player object upon relog.
        });
        world.scoreboard.setObjectiveAtDisplaySlot(DISPLAY_SLOT, { objective, sortOrder: ObjectiveSortOrder.Descending });
        this.currentEvent = event;
        this.update(event);
        return true;
    }

    static update(event) {
        if (event !== this.currentEvent)
            return false;
        const objective = world.scoreboard.getObjective(DISPLAY_OBJECTIVE_ID);
        if (!objective)
            return false;

        let participants = event.getData().participants;
        participants.push(...objective.getParticipants().map(participant => ({ name: participant.displayName.slice(0,-1) })));
        participants = participants.filter((participant) => participant && participant.name !== 'Total');
        participants.forEach(participant => {
            const player = world.getPlayers({ name: participant.name })[0];
            if (!player) {
                if (this.settings.showOfflinePlayers) {
                    objective.setScore(participant.name + ' ', event.getCount({ name: participant.name }));
                } else {
                    objective.removeParticipant(participant.name + ' ');
                }
                return;
            }
            objective.setScore(participant.name + ' ', event.getCount(player));
        });

        if (this.settings.showTotal)
            objective.setScore('Total:', event.getTotal());
        else
            objective.removeParticipant('Total:');
        
        return true;
    }

    static getSetting(setting) {
        const value = world.getDynamicProperty(setting);
        return value;
    }

    static toggleSetting(setting) {
        const settingMap = {
            'offline' : 'showOfflinePlayers',
            'total' : 'showTotal'
        }
        setting = settingMap[setting];
        if (!setting)
            return null;
        const currentValue = this.getSetting(setting);
        const newValue = !currentValue;
        world.setDynamicProperty(setting, newValue);
        this.settings[setting] = newValue;
        this.update(this.currentEvent);
        return { setting, newValue };
    }

    static printTop(sender, eventID) {
        const event = eventManager.getEvent(eventID);
        const participants = event.getData().participants;
        if (participants.length === 0)
            return sender.sendMessage('§7No statistics found for ' + event.displayName + '.');

        const sortedParticipants = participants.sort((a, b) => b.score - a.score);
        const topParticipants = sortedParticipants.slice(0, Math.min(15, participants.length));
        sender.sendMessage('§7Best Statistics for ' + event.displayName + ':');
        topParticipants.forEach((participant, index) => {
            sender.sendMessage('§7' + (index + 1) + '. ' + participant.name + ' - §c' + participant.score);
        });
    }

    static printPlayer(sender, eventID, playerName) {
        const event = eventManager.getEvent(eventID);
        const count = event.getCount({ name: String(playerName) });
        if (count === 0)
            return sender.sendMessage('§7No statistics found for ' + playerName + ' in ' + event.displayName + '.');
        sender.sendMessage('§7' + event.displayName + ' for ' + playerName + ': §c' + count);
    }
}

world.afterEvents.playerJoin.subscribe((event) => {
    if (Display.currentEvent) {
        const runner = system.runInterval(() => {
            if (!world.getAllPlayers().includes(world.getEntity(event.playerId))) {
                return;
            }
            Display.update(Display.currentEvent);
            system.clearRun(runner);
        });
    }
});

world.afterEvents.playerLeave.subscribe(() => {
    if (Display.currentEvent)
        Display.update(Display.currentEvent);
});

export default Display;