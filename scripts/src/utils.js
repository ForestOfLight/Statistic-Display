import { world } from "@minecraft/server";

function getPlayer(name) {
    return world.getPlayers({ name: name })[0];
}

function titleCase(str) {
    return str.toLowerCase().replaceAll('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export { getPlayer, titleCase };