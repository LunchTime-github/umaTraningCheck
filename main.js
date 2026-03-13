const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

const DATA_DIR = path.join(__dirname, 'data');
const CATALOG_PATH = path.join(DATA_DIR, 'characters_catalog.json');
const CATALOG_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24시간

// ─── 내장 캐릭터 데이터 (fallback) ───────────────────────────────────────────
const CHARACTERS_FALLBACK = [
  { id:  1, name: '스페셜 위크',       releaseDate: '2021-02-24', urlKey: 'special-week' },
  { id:  2, name: '사일런스 스즈카',   releaseDate: '2021-02-24', urlKey: 'silence-suzuka' },
  { id:  3, name: '토카이 테이오',     releaseDate: '2021-02-24', urlKey: 'tokai-teio' },
  { id:  4, name: '마루젠스키',        releaseDate: '2021-02-24', urlKey: 'maruzensky' },
  { id:  5, name: '후지 키세키',       releaseDate: '2021-02-24', urlKey: 'fuji-kiseki' },
  { id:  6, name: '오구리 캡',         releaseDate: '2021-02-24', urlKey: 'oguri-cap' },
  { id:  7, name: '골드 쉽',           releaseDate: '2021-02-24', urlKey: 'gold-ship' },
  { id:  8, name: '우옷카',            releaseDate: '2021-02-24', urlKey: 'vodka' },
  { id:  9, name: '다이와 스칼렛',     releaseDate: '2021-02-24', urlKey: 'daiwa-scarlet' },
  { id: 10, name: '에어 그루브',       releaseDate: '2021-02-24', urlKey: 'air-groove' },
  { id: 11, name: '엘 콘도르 파사',    releaseDate: '2021-02-24', urlKey: 'el-condor-pasa' },
  { id: 12, name: '그래스 원더',       releaseDate: '2021-02-24', urlKey: 'grass-wonder' },
  { id: 13, name: '세이운 스카이',     releaseDate: '2021-02-24', urlKey: 'seiun-sky' },
  { id: 14, name: '킹 헤일로',         releaseDate: '2021-02-24', urlKey: 'king-halo' },
  { id: 15, name: '메이쇼 도토',       releaseDate: '2021-02-24', urlKey: 'meisho-doto' },
  { id: 16, name: '메지로 맥퀸',       releaseDate: '2021-02-24', urlKey: 'mejiro-mcqueen' },
  { id: 17, name: '나이스 네이쳐',     releaseDate: '2021-02-24', urlKey: 'nice-nature' },
  { id: 18, name: '위닝 티켓',         releaseDate: '2021-02-24', urlKey: 'winning-ticket' },
  { id: 19, name: '비와 하야히데',     releaseDate: '2021-02-24', urlKey: 'biwa-hayahide' },
  { id: 20, name: '나리타 브라이언',   releaseDate: '2021-02-24', urlKey: 'narita-brian' },
  { id: 21, name: '미호노 부르봉',     releaseDate: '2021-02-24', urlKey: 'mihono-bourbon' },
  { id: 22, name: '라이스 샤워',       releaseDate: '2021-02-24', urlKey: 'rice-shower' },
  { id: 23, name: '슈퍼 크릭',         releaseDate: '2021-02-24', urlKey: 'super-creek' },
  { id: 24, name: '파인 모션',         releaseDate: '2021-02-24', urlKey: 'fine-motion' },
  { id: 25, name: '이쿠노 딕터스',     releaseDate: '2021-02-24', urlKey: 'ikuno-dictus' },
  { id: 26, name: '맨해튼 카페',       releaseDate: '2021-05-30', urlKey: 'manhattan-cafe' },
  { id: 27, name: '어드마이어 베가',   releaseDate: '2021-05-30', urlKey: 'admire-vega' },
  { id: 28, name: 'T.M. 오페라 오',    releaseDate: '2021-06-27', urlKey: 'tm-opera-o' },
  { id: 29, name: '나리타 탑 로드',    releaseDate: '2021-09-26', urlKey: 'narita-top-road' },
  { id: 30, name: '아그네스 디지털',   releaseDate: '2021-09-26', urlKey: 'agnes-digital' },
  { id: 31, name: '심볼리 루돌프',     releaseDate: '2021-10-31', urlKey: 'symboli-rudolph' },
  { id: 32, name: '히시 아마존',       releaseDate: '2021-10-31', urlKey: 'hishi-amazon' },
  { id: 33, name: '마야노 탑건',       releaseDate: '2021-10-31', urlKey: 'mayano-top-gun' },
  { id: 34, name: '카렌 챤',           releaseDate: '2021-12-28', urlKey: 'curren-chan' },
  { id: 35, name: '아그네스 타키온',   releaseDate: '2022-01-30', urlKey: 'agnes-tachyon' },
  { id: 36, name: '타이키 샤틀',       releaseDate: '2022-01-30', urlKey: 'taiki-shuttle' },
  { id: 37, name: '에이신 플래시',     releaseDate: '2022-03-27', urlKey: 'eishin-flash' },
  { id: 38, name: '스마트 팔콘',       releaseDate: '2022-03-27', urlKey: 'smart-falcon' },
  { id: 39, name: '스위프 토쇼',       releaseDate: '2022-05-29', urlKey: 'sweep-tosho' },
  { id: 40, name: '메지로 도베르',     releaseDate: '2022-06-26', urlKey: 'mejiro-dober' },
  { id: 41, name: '츠루마루 츠요시',   releaseDate: '2022-06-26', urlKey: 'tsurumarufunna' },
  { id: 42, name: '타마모 크로스',     releaseDate: '2022-07-31', urlKey: 'tamamo-cross' },
  { id: 43, name: '키타산 블랙',       releaseDate: '2022-08-28', urlKey: 'kitasan-black' },
  { id: 44, name: '사토노 다이아몬드', releaseDate: '2022-08-28', urlKey: 'satono-diamond' },
  { id: 45, name: '나리타 타이신',     releaseDate: '2022-09-25', urlKey: 'narita-taishin' },
  { id: 46, name: '니시노 플라워',     releaseDate: '2022-09-25', urlKey: 'nishino-flower' },
  { id: 47, name: '뱀부 메모리',       releaseDate: '2022-10-30', urlKey: 'bamboo-memory' },
  { id: 48, name: '야에노 무테키',     releaseDate: '2022-11-27', urlKey: 'yaeno-muteki' },
  { id: 49, name: '에어 샤쿠르',       releaseDate: '2022-12-25', urlKey: 'air-shakur' },
  { id: 50, name: '대링 택트',         releaseDate: '2023-01-29', urlKey: 'daring-tact' },
  { id: 51, name: '메지로 아루당',     releaseDate: '2023-01-29', urlKey: 'mejiro-ardan' },
  { id: 52, name: '히시 미라클',       releaseDate: '2023-02-26', urlKey: 'hishi-miracle' },
  { id: 53, name: '키류 윙',           releaseDate: '2023-04-30', urlKey: 'kiryu-wing' },
  { id: 54, name: '로프 드 마르코',    releaseDate: '2023-05-28', urlKey: 'rope-de-marco' },
  { id: 55, name: '이나리 원',         releaseDate: '2023-06-25', urlKey: 'inari-one' },
  { id: 56, name: '재규어 원',         releaseDate: '2023-06-25', urlKey: 'jaguar-one' },
  { id: 57, name: '메지로 파메르',     releaseDate: '2023-07-30', urlKey: 'mejiro-palmer' },
  { id: 58, name: '타이에이 레이첼',   releaseDate: '2023-08-27', urlKey: 'taiei-rachel' },
  { id: 59, name: '나카야마 페스타',   releaseDate: '2023-10-29', urlKey: 'nakayama-festa' },
  { id: 60, name: '트랜센드',          releaseDate: '2023-10-29', urlKey: 'transcend' },
  { id: 61, name: '야마닌 제퍼',       releaseDate: '2023-12-24', urlKey: 'yamanin-zephyr' },
  { id: 62, name: '사쿠라 로렐',       releaseDate: '2024-01-28', urlKey: 'sakura-laurel' },
];

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

// ─── 캐릭터 카탈로그 캐시 ────────────────────────────────────────────────────
function readCatalogCache() {
  if (!fs.existsSync(CATALOG_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  } catch {
    return null;
  }
}

function writeCatalogCache(characters) {
  ensureDir(DATA_DIR);
  const payload = { characters, updatedAt: new Date().toISOString() };
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(payload, null, 2), 'utf-8');
  return payload;
}

function isCatalogFresh(cache) {
  if (!cache || !cache.updatedAt) return false;
  return (Date.now() - new Date(cache.updatedAt).getTime()) < CATALOG_MAX_AGE_MS;
}

// ─── gametora.com 스크래핑 ───────────────────────────────────────────────────
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; UmaTrainingCheck/2.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
    };
    https.get(url, options, (res) => {
      // 리다이렉트 처리
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let body = '';
      res.setEncoding('utf-8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function parseCharactersFromHtml(html) {
  // Next.js __NEXT_DATA__ 에서 캐릭터 목록 추출 시도
  const nextDataMatch = html.match(/<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (nextDataMatch) {
    try {
      const nextData = JSON.parse(nextDataMatch[1]);
      // gametora 구조 탐색
      const props = nextData?.props?.pageProps;
      const chars = props?.characters || props?.data?.characters || props?.umamusume;
      if (Array.isArray(chars) && chars.length > 10) {
        return chars
          .filter(c => c.slug || c.urlKey || c.url_key)
          .map((c, i) => ({
            id: c.id || i + 1,
            name: c.name_ko || c.name || c.title || '',
            releaseDate: c.release_date || c.releaseDate || '',
            urlKey: c.slug || c.urlKey || c.url_key || '',
          }))
          .filter(c => c.name && c.urlKey);
      }
    } catch { /* ignore */ }
  }

  // HTML 링크 패턴으로 URL key 추출
  const linkPattern = /href="\/(?:ko\/)?umamusume\/characters\/([a-z0-9\-]+)"/g;
  const found = new Map();
  let m;
  while ((m = linkPattern.exec(html)) !== null) {
    const key = m[1];
    if (key && key !== 'characters' && !found.has(key)) {
      found.set(key, key);
    }
  }

  if (found.size > 10) {
    // URL key만 있고 이름이 없는 경우 – fallback과 매칭
    const result = [];
    let idx = 1;
    for (const urlKey of found.keys()) {
      const fb = CHARACTERS_FALLBACK.find(c => c.urlKey === urlKey);
      result.push({
        id: fb?.id || idx,
        name: fb?.name || urlKey,
        releaseDate: fb?.releaseDate || '',
        urlKey,
      });
      idx++;
    }
    return result;
  }

  return null; // 파싱 실패
}

async function fetchCharactersFromWeb() {
  try {
    const html = await fetchUrl('https://gametora.com/ko/umamusume/characters');
    const parsed = parseCharactersFromHtml(html);
    if (parsed && parsed.length >= 20) {
      // fallback 데이터로 누락된 항목 보완
      const existingKeys = new Set(parsed.map(c => c.urlKey));
      CHARACTERS_FALLBACK.forEach(fb => {
        if (!existingKeys.has(fb.urlKey)) parsed.push(fb);
      });
      return parsed.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    }
  } catch { /* ignore */ }
  return null;
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

  win.loadFile(path.join(__dirname, 'dist', 'renderer', 'index.html'));
  win.webContents.openDevTools({ mode: 'detach' });
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

  // ─── 캐릭터 카탈로그 IPC ──────────────────────────────────────────────────
  ipcMain.handle('data:getCharactersCatalog', async () => {
    const cache = readCatalogCache();
    if (isCatalogFresh(cache)) return cache;

    // 백그라운드에서 최신화 시도 (실패해도 캐시 or fallback 반환)
    const fetched = await fetchCharactersFromWeb();
    if (fetched) return writeCatalogCache(fetched);

    // 이미 캐시가 있으면 만료됐어도 반환
    if (cache) return cache;

    // 완전 fallback
    return writeCatalogCache(CHARACTERS_FALLBACK);
  });

  ipcMain.handle('data:refreshCharacters', async () => {
    const fetched = await fetchCharactersFromWeb();
    if (fetched) return writeCatalogCache(fetched);

    // 웹 fetch 실패 → fallback을 강제 갱신
    return writeCatalogCache(CHARACTERS_FALLBACK);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
