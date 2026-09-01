const { Menu, app, shell } = require('electron');

function createMenu(mainWindow, isDev) {
	const isMac = process.platform === 'darwin';

	const template = [
		// App menu (macOS only)
		...(isMac ? [{
			label: app.name,
			submenu: [
				{ role: 'about' },
				{ type: 'separator' },
				{
					label: 'Preferences...',
					accelerator: 'Cmd+,',
					click: () => {
						mainWindow.webContents.executeJavaScript(
							"window.location.hash = '#/settings'"
						);
						mainWindow.show();
					},
				},
				{ type: 'separator' },
				{ role: 'services' },
				{ type: 'separator' },
				{ role: 'hide' },
				{ role: 'hideOthers' },
				{ type: 'separator' },
				{ role: 'quit' },
			],
		}] : []),

		// File menu
		{
			label: 'File',
			submenu: [
				{
					label: 'New Mole Check',
					accelerator: 'CmdOrCtrl+N',
					click: () => {
						mainWindow.webContents.executeJavaScript(
							"window.location.hash = '#/moles/new'"
						);
						mainWindow.show();
					},
				},
				{ type: 'separator' },
				{
					label: 'Export Report (PDF)',
					accelerator: 'CmdOrCtrl+E',
					click: () => {
						mainWindow.webContents.send('menu:exportPdf');
					},
				},
				{
					label: 'Print...',
					accelerator: 'CmdOrCtrl+P',
					click: () => {
						mainWindow.webContents.print();
					},
				},
				{ type: 'separator' },
				isMac ? { role: 'close' } : { role: 'quit' },
			],
		},

		// Edit menu
		{
			label: 'Edit',
			submenu: [
				{ role: 'undo' },
				{ role: 'redo' },
				{ type: 'separator' },
				{ role: 'cut' },
				{ role: 'copy' },
				{ role: 'paste' },
				{ role: 'selectAll' },
			],
		},

		// View menu
		{
			label: 'View',
			submenu: [
				{ role: 'reload' },
				{ role: 'forceReload' },
				...(isDev ? [{ role: 'toggleDevTools' }] : []),
				{ type: 'separator' },
				{ role: 'resetZoom' },
				{ role: 'zoomIn' },
				{ role: 'zoomOut' },
				{ type: 'separator' },
				{ role: 'togglefullscreen' },
			],
		},

		// Window menu
		{
			label: 'Window',
			submenu: [
				{ role: 'minimize' },
				{ role: 'zoom' },
				...(isMac ? [
					{ type: 'separator' },
					{ role: 'front' },
					{ type: 'separator' },
					{ role: 'window' },
				] : [
					{ role: 'close' },
				]),
			],
		},

		// Help menu
		{
			label: 'Help',
			submenu: [
				{
					label: 'MoleCare Help',
					click: () => {
						mainWindow.webContents.executeJavaScript(
							"window.location.hash = '#/user-guide'"
						);
						mainWindow.show();
					},
				},
				{
					label: 'Visit Website',
					click: () => shell.openExternal('https://molecare.co.uk'),
				},
				{ type: 'separator' },
				{
					label: 'Report an Issue',
					click: () => shell.openExternal('https://molecare.co.uk/about-us'),
				},
			],
		},
	];

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}

module.exports = { createMenu };