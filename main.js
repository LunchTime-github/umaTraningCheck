const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.argv.includes('--dev');

// 빌드된 앱(asar)에서는 __dirname이 읽기 전용이므로 userData 경로 사용
const DATA_DIR = isDev
  ? path.join(__dirname, 'data')
  : path.join(app.getPath('userData'), 'data');


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
  Menu.setApplicationMenu(null);
  const win = new BrowserWindow({
    width: 460,
    minWidth: 460,
    height: 750,
    resizable: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile(path.join(__dirname, 'dist', 'renderer', 'index.html'));

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  // dev 모드에서 dist/renderer 변경 감지 → 자동 리로드
  if (isDev) {
    const rendererDir = path.join(__dirname, 'dist', 'renderer');
    let reloadTimer = null;
    fs.watch(rendererDir, { recursive: true }, () => {
      clearTimeout(reloadTimer);
      reloadTimer = setTimeout(() => {
        if (!win.isDestroyed()) win.webContents.reload();
      }, 300);
    });
  }
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
