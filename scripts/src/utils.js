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

function recolor(text, term, colorCode = '§f') {
	if (text === '' || term === '' || colorCode === '')
		return text;
	const lowerText = text.toLowerCase();
	const lowerTerm = term.toLowerCase();
	const index = lowerText.indexOf(lowerTerm);
	if (index === -1)
		return text;
	const splitText = lowerText.split(lowerTerm);
	let newText = '';
	let lastColorCode = '§f';
	let currentIndex = 0;

	for (let i = 0; i < splitText.length; i++) {
		const splice = splitText[i];
		const originalSplice = text.slice(currentIndex, currentIndex + splice.length);
		currentIndex += splice.length;

		if (i === splitText.length - 1) {
			newText += originalSplice;
			continue;
		}

		const colorCodeIndex = originalSplice.lastIndexOf('§');
		if (colorCodeIndex === -1) {
			newText += originalSplice + colorCode + text.slice(currentIndex, currentIndex + term.length) + lastColorCode;
		} else {
			lastColorCode = originalSplice.slice(colorCodeIndex, colorCodeIndex + 2);
			newText += originalSplice + colorCode + text.slice(currentIndex, currentIndex + term.length) + lastColorCode;
		}

		currentIndex += term.length;
	}

	return newText;
}

export { getPlayer, titleCase, recolor };