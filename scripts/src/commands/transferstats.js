import { world } from '@minecraft/server';
import { Command } from 'lib/canopy/CanopyExtension';
import { extension } from 'src/config';
import eventManager from 'src/classes/EventManager';

const transferstatsCommand = new Command({
    name: 'transferstats',
    description: 'Transfers statistics from v1.0.0 to v1.1.0.',
    usage: 'transferstats',
    callback: transferstatsCommandCallback
});
extension.addCommand(transferstatsCommand);

function transferstatsCommandCallback(sender) {
    world.sendMessage('§cTransferring all statistics from v1.0.0 to v1.1.0...');
    world.scoreboard.getObjectives().forEach(objective => {
        if (['blocksMined', 'blocksPlaced', 'deaths', 'interactedWith', 'itemsUsed', 'killed', 'killedBy', 'playTime'].some(id => objective.id.includes(id))) {
            sender.sendMessage(`§cTransferring ${objective.id}...`);
            objective.getScores().forEach(score => {
                const player = { name: score.participant.displayName.slice(0, -1), id: score.participant.id };
                const eventID = objective.id.replace('_', ':');
                const displayName = objective.displayName;

                console.warn(`[Stats] Transferring ${player.name}'s ${displayName} (${eventID})...`);
                if (!eventManager.exists(eventID)) {
                    eventManager.registerEvent(eventID, displayName, () => {});
                    eventManager.setCount(eventID, player, score.score);
                } else {
                    const newCount = eventManager.getEvent(eventID).getCount(player);
                    eventManager.setCount(eventID, player, newCount + score.score);
                }
            });
            world.scoreboard.removeObjective(objective);
        }
    });
}
