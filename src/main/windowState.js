const { screen } = require('electron');

const STATE_KEY = 'windowState';

function restoreWindowState(store) {
	const defaults = {
		width: 1200,
		height: 800,
		x: undefined,
		y: undefined,
		isMaximized: false,
	};

	const saved = store.get(STATE_KEY);
	if (!saved) return defaults;

	// Validate that the saved position is still within a visible display
	const displayBounds = screen.getAllDisplays().reduce((bounds, display) => {
		const { x, y, width, height } = display.bounds;
		return {
			minX: Math.min(bounds.minX, x),
			minY: Math.min(bounds.minY, y),
			maxX: Math.max(bounds.maxX, x + width),
			maxY: Math.max(bounds.maxY, y + height),
		};
	}, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

	const isVisible =
		saved.x !== undefined &&
		saved.y !== undefined &&
		saved.x >= displayBounds.minX - 100 &&
		saved.x <= displayBounds.maxX - 100 &&
		saved.y >= displayBounds.minY - 100 &&
		saved.y <= displayBounds.maxY - 100;

	return {
		width: saved.width || defaults.width,
		height: saved.height || defaults.height,
		x: isVisible ? saved.x : undefined,
		y: isVisible ? saved.y : undefined,
		isMaximized: saved.isMaximized || false,
	};
}

function trackWindowState(window, store) {
	let saveTimeout;

	const saveState = () => {
		if (window.isDestroyed()) return;

		const isMaximized = window.isMaximized();
		const bounds = isMaximized ? store.get(STATE_KEY, {}) : window.getBounds();

		store.set(STATE_KEY, {
			width: bounds.width,
			height: bounds.height,
			x: bounds.x,
			y: bounds.y,
			isMaximized,
		});
	};

	const debouncedSave = () => {
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(saveState, 500);
	};

	window.on('resize', debouncedSave);
	window.on('move', debouncedSave);
	window.on('maximize', debouncedSave);
	window.on('unmaximize', debouncedSave);
	window.on('close', saveState);
}

module.exports = { restoreWindowState, trackWindowState };
