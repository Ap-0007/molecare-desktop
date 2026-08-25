const { Tray, Menu, nativeImage, app } = require('electron');
const path = require('path');

function createTray(mainWindow) {
	// Use a template image on macOS (adapts to dark/light menu bar)
	const iconPath = path.join(__dirname, '..', 'assets', 'tray-icon.png');

	let trayIcon;
	try {
		trayIcon = nativeImage.createFromPath(iconPath);
		if (trayIcon.isEmpty()) {
			// Fallback: create a simple 16x16 icon
			trayIcon = nativeImage.createEmpty();
		}
		if (process.platform === 'darwin') {
			trayIcon = trayIcon.resize({ width: 16, height: 16 });
			trayIcon.setTemplateImage(true);
		}
	} catch (err) {
		trayIcon = nativeImage.createEmpty();
	}

	const tray = new Tray(trayIcon);
	tray.setToolTip('MoleCare');

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Open MoleCare',
			click: () => {
				mainWindow.show();
				mainWindow.focus();
			},
		},
		{
			label: 'My Moles',
			click: () => {
				mainWindow.webContents.executeJavaScript(
					"window.location.hash = '#/moles'"
				);
				mainWindow.show();
				mainWindow.focus();
			},
		},
		{ type: 'separator' },
		{
			label: 'Quit MoleCare',
			click: () => {
				app.isQuitting = true;
				app.quit();
			},
		},
	]);

	tray.setContextMenu(contextMenu);

	tray.on('click', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	return tray;
}

module.exports = { createTray };
