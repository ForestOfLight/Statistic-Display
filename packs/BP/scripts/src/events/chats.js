import { world } from "@minecraft/server";
import eventManager from "src/classes/EventManager";

const IDENTIFIER = 'chats';

eventManager.registerEvent(IDENTIFIER, 'Chatty Kathys', () => {
    world.afterEvents.chatSend.subscribe((event) => {
        if (!event.sender)
            return;
        eventManager.increment(IDENTIFIER, event.sender);
    });
});