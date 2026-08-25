const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

function setupUpdater(mainWindow) {
	autoUpdater.logger = log;
	autoUpdater.autoDownload = true;
	autoUpdater.autoInstallOnAppQuit = true;

	autoUpdater.on('checking-for-update', () => {
		log.info('Checking for updates...');
	});

	autoUpdater.on('update-available', (info) => {
		log.info('Update available:', info.version);
		mainWindow.webContents.send('updater:available', info.version);
	});

	autoUpdater.on('update-not-available', () => {
		log.info('App is up to date.');
	});

	autoUpdater.on('download-progress', (progress) => {
		log.info(`Download progress: ${Math.round(progress.percent)}%`);
	});

	autoUpdater.on('update-downloaded', (info) => {
		log.info('Update downloaded:', info.version);
		mainWindow.webContents.send('updater:downloaded', info.version);
	});

	autoUpdater.on('error', (err) => {
		log.error('Auto-updater error:', err.message);
	});

	// Check for updates on launch
	autoUpdater.checkForUpdatesAndNotify();

	// Check periodically (every 6 hours)
	setInterval(() => {
		autoUpdater.checkForUpdatesAndNotify();
	}, 6 * 60 * 60 * 1000);
}

module.exports = { setupUpdater };
