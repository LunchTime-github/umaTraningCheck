const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key) => ipcRenderer.invoke('store:get', key),
    set: (key, data) => ipcRenderer.invoke('store:set', key, data),
    add: (key, item) => ipcRenderer.invoke('store:add', key, item),
    update: (key, id, updates) => ipcRenderer.invoke('store:update', key, id, updates),
    delete: (key, id) => ipcRenderer.invoke('store:delete', key, id),
  },
  shell: {
    openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
  },
});
