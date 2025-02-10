import { world } from "@minecraft/server";

function getPlayer(name) {
    return world.getPlayers({ name: name })[0];
}

function titleCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export { getPlayer, titleCase };