const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sanitizeKey(key) {
  return key.replace(/[^a-zA-Z0-9_\-]/g, '');
}

function getFilePath(key) {
  const safe = sanitizeKey(key);
  return path.join(DATA_DIR, `${safe}.json`);
}

function readStore(key) {
  const fp = getFilePath(key);
  if (!fs.existsSync(fp)) return [];
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf-8'));
  } catch {
    return [];
  }
}

function writeStore(key, data) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(getFilePath(key), JSON.stringify(data, null, 2), 'utf-8');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 450,
    maxWidth: 450,
    minWidth: 450,
    height: 750,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
  // 개발 시 DevTools 열기: win.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(() => {
  ensureDir(DATA_DIR);
  createWindow();

  // CRUD IPC 핸들러
  ipcMain.handle('store:get', (_e, key) => readStore(key));

  ipcMain.handle('store:set', (_e, key, data) => {
    writeStore(key, data);
    return true;
  });

  ipcMain.handle('store:add', (_e, key, item) => {
    const data = readStore(key);
    item.id = Date.now().toString();
    data.push(item);
    writeStore(key, data);
    return item;
  });

  ipcMain.handle('store:update', (_e, key, id, updates) => {
    const data = readStore(key);
    const idx = data.findIndex(d => d.id === id);
    if (idx === -1) return null;
    data[idx] = { ...data[idx], ...updates };
    writeStore(key, data);
    return data[idx];
  });

  ipcMain.handle('store:delete', (_e, key, id) => {
    const data = readStore(key).filter(d => d.id !== id);
    writeStore(key, data);
    return true;
  });

  // 외부 브라우저 열기 (gametora 도메인만 허용)
  ipcMain.handle('shell:openExternal', (_e, url) => {
    if (typeof url === 'string' && url.startsWith('https://gametora.com/')) {
      shell.openExternal(url);
      return true;
    }
    return false;
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
