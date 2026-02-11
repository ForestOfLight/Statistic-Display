import { ObjectiveSortOrder, DisplaySlotId, world } from '@minecraft/server';
import eventManager from "./EventManager";
import { showOfflinePlayers } from '../rules/showOfflinePlayers';
import { showTotal } from '../rules/showTotal';

const DISPLAY_SLOT = DisplaySlotId.Sidebar;
const DISPLAY_OBJECTIVE_ID = 'statDisplay';

class Display {
    static currentEvent = void 0;

    static onReload() {
        const activeObjective = world.scoreboard.getObjective(DISPLAY_OBJECTIVE_ID);
        if (!activeObjective)
            return;
        const activeEvent = eventManager.findEventByDisplayName(activeObjective.displayName);
        if (!activeEvent)
            throw Error(`[Stats] Could not reload. Did not find event with display name '${activeObjective.displayName}'.`);
        this.currentEvent = activeEvent;
        this.update();
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
        this.update();
        return true;
    }

    static update() {
        const objective = world.scoreboard.getObjective(DISPLAY_OBJECTIVE_ID);
        if (!objective)
            return false;

        let participants = this.currentEvent.getData().participants;
        participants.push(...objective.getParticipants().map(participant => ({ name: participant.displayName.slice(0,-1) })));
        participants = participants.filter((participant) => participant && participant.name !== 'Total');
        participants.forEach(participant => {
            const player = world.getPlayers({ name: participant.name })[0];
            if (!player) {
                if (showOfflinePlayers.getValue())
                    objective.setScore(participant.name + ' ', this.currentEvent.getCount({ name: participant.name }));
                else
                    objective.removeParticipant(participant.name + ' ');
                return;
            }
            objective.setScore(participant.name + ' ', this.currentEvent.getCount(player));
        });

        if (showTotal.getValue())
            objective.setScore('Total:', this.currentEvent.getTotal());
        else
            objective.removeParticipant('Total:');
        
        return true;
    }

    static getTopMessage(eventID) {
        const event = eventManager.getEvent(eventID);
        const participants = event.getData().participants;
        if (participants.length === 0)
            return '§7No statistics found for ' + event.displayName + '.';

        const sortedParticipants = participants.sort((a, b) => b.score - a.score);
        const topParticipants = sortedParticipants.slice(0, Math.min(15, participants.length));
        let message = '§7Top Statistics for ' + event.displayName + ':';
        topParticipants.forEach((participant, index) => {
            message += '\n§7' + (index + 1) + '. ' + participant.name + ' - §c' + participant.score;
        });
        return message;
    }

    static getPlayerMessage(eventID, playerName) {
        const event = eventManager.getEvent(eventID);
        const count = event.getCount({ name: String(playerName) });
        if (count === 0)
            return '§7No statistics found for ' + playerName + ' in ' + event.displayName + '.';
        return '§7' + event.displayName + ' for ' + playerName + ': §c' + count;
    }
}

export default Display;