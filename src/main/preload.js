const { contextBridge, ipcRenderer } = require('electron');

/**
 * Preload script — exposes a safe IPC bridge to the renderer process.
 * The renderer accesses these via window.electronAPI.
 */
contextBridge.exposeInMainWorld('electronAPI', {
	// ─── Auth (encrypted via safeStorage) ─────────────────
	auth: {
		setToken: (key, value) => ipcRenderer.invoke('auth:setToken', key, value),
		getToken: (key) => ipcRenderer.invoke('auth:getToken', key),
		clearToken: (key) => ipcRenderer.invoke('auth:clearToken', key),
		clearAll: () => ipcRenderer.invoke('auth:clearAll'),
	},

	// ─── General Store (preferences) ──────────────────────
	store: {
		get: (key) => ipcRenderer.invoke('store:get', key),
		set: (key, value) => ipcRenderer.invoke('store:set', key, value),
		delete: (key) => ipcRenderer.invoke('store:delete', key),
	},

	// ─── App Info ─────────────────────────────────────────
	app: {
		version: () => ipcRenderer.invoke('app:version'),
		platform: () => ipcRenderer.invoke('app:platform'),
	},

	// ─── Shell ────────────────────────────────────────────
	shell: {
		openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
	},

	// ─── Notifications ────────────────────────────────────
	notification: {
		show: (title, body) => ipcRenderer.invoke('notification:show', title, body),
	},

	// ─── File Operations ──────────────────────────────────
	file: {
		saveDialog: (filename, base64Data) =>
			ipcRenderer.invoke('file:saveDialog', filename, base64Data),
	},

	// ─── Print ────────────────────────────────────────────
	print: {
		page: () => ipcRenderer.invoke('print:page'),
	},
});
