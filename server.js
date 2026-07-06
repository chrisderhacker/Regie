const http = require('http');
const https = require('https');
const fs = require('fs/promises');
const path = require('path');

const root = __dirname;
const versionsDir = path.join(root, 'versions');
const defaultProjectFile = path.join(root, process.env.DEFAULT_PROJECT || '20260617v1_LV_Regieplan_GREEN_FUTURE.json');
const playerPlaylistUrl = process.env.PLAYER_PLAYLIST || 'https://usa.derhacker.com/GFA_k1_SERVER.json';
const playerRootUrl = process.env.PLAYER_ROOT || 'https://usa.derhacker.com/CONTENT/';
const port = Number(process.env.PORT || 3000);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

function send(res, status, body, type = 'application/json; charset=utf-8') {
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
  });
  res.end(payload);
}

function cleanName(value, fallback = 'regieplan') {
  return String(value || fallback)
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120) || fallback;
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 25 * 1024 * 1024) throw new Error('JSON ist zu gross.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

function joinUrl(rootUrl, relativePath) {
  return new URL(String(relativePath || '').replace(/^\/+/, ''), rootUrl.endsWith('/') ? rootUrl : `${rootUrl}/`).toString();
}

async function listVersions() {
  await fs.mkdir(versionsDir, { recursive: true });
  const files = (await fs.readdir(versionsDir)).filter((file) => file.endsWith('.json'));
  const versions = [];
  for (const file of files) {
    try {
      const full = path.join(versionsDir, file);
      const [raw, stat] = await Promise.all([fs.readFile(full, 'utf8'), fs.stat(full)]);
      const data = JSON.parse(raw);
      versions.push({
        id: file,
        filename: file,
        projectName: data.projectName || data.state?.projectName || 'Regieplan',
        version: data.version || data.state?.projectVersion || '',
        savedAt: data.savedAt || stat.mtime.toISOString(),
        mtime: stat.mtime.toISOString(),
        size: stat.size,
      });
    } catch (err) {
      // Ignore broken files so one bad manual edit does not hide all versions.
    }
  }
  versions.sort((a, b) => String(b.savedAt || b.mtime).localeCompare(String(a.savedAt || a.mtime)));
  return versions;
}

async function handleApi(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/versions') {
    return send(res, 200, { versions: await listVersions() });
  }

  if (req.method === 'GET' && url.pathname === '/api/default-project') {
    const raw = await fs.readFile(defaultProjectFile, 'utf8');
    return send(res, 200, JSON.parse(raw));
  }

  if (req.method === 'GET' && url.pathname === '/api/player-playlist') {
    const playlist = await fetchJson(playerPlaylistUrl);
    const rootUrl = playlist.serverRoot || playerRootUrl;
    const clips = (playlist.clips || []).map((clip, index) => ({
      index,
      type: clip.type || 'video',
      name: clip.fileName || path.basename(clip.relativePath || ''),
      mime: clip.mime || 'video/mp4',
      relativePath: clip.relativePath || clip.fileName || '',
      url: joinUrl(rootUrl, clip.relativePath || clip.fileName || ''),
      isLoop: !!clip.isLoop,
      endMode: clip.endMode || '',
      startMode: clip.startMode || '',
      transitionMode: clip.transitionMode || '',
      markColor: clip.markColor || '',
      thumbnail: clip.thumbnail ? joinUrl(rootUrl, clip.thumbnail) : '',
    }));
    return send(res, 200, {
      app: playlist.app || 'player-playlist',
      version: playlist.version || 1,
      current: playlist.current || 0,
      root: rootUrl,
      playlist: playerPlaylistUrl,
      clips,
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/versions') {
    const body = JSON.parse(await readBody(req));
    if (!body || typeof body !== 'object' || !body.state) {
      return send(res, 400, { error: 'Keine Regieplan-Daten empfangen.' });
    }
    await fs.mkdir(versionsDir, { recursive: true });
    const version = cleanName(body.version || body.state.projectVersion || new Date().toISOString().slice(0, 10));
    const project = cleanName(body.projectName || body.state.projectName || 'Regieplan');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = cleanName(body.filename || `${version}_${project}.json`).replace(/\.json$/i, '');
    const finalName = `${stamp}_${filename}.json`;
    const full = path.join(versionsDir, finalName);
    const payload = {
      projectName: body.projectName || body.state.projectName || 'Regieplan',
      version: body.version || body.state.projectVersion || '',
      filename: finalName,
      savedAt: new Date().toISOString(),
      state: body.state,
    };
    await fs.writeFile(full, JSON.stringify(payload, null, 2), 'utf8');
    return send(res, 201, payload);
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/versions/')) {
    const id = decodeURIComponent(url.pathname.replace('/api/versions/', ''));
    const safe = path.basename(id);
    if (!safe.endsWith('.json')) return send(res, 400, { error: 'Ungueltige Version.' });
    const full = path.join(versionsDir, safe);
    const raw = await fs.readFile(full, 'utf8');
    return send(res, 200, JSON.parse(raw));
  }

  return send(res, 404, { error: 'API nicht gefunden.' });
}

async function serveStatic(req, res, url) {
  const requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const full = path.normalize(path.join(root, requested));
  if (!full.startsWith(root)) return send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
  const data = await fs.readFile(full);
  res.writeHead(200, {
    'Content-Type': mime[path.extname(full).toLowerCase()] || 'application/octet-stream',
  });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
    return await serveStatic(req, res, url);
  } catch (err) {
    if (err.code === 'ENOENT') return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    const message = err instanceof SyntaxError ? 'JSON konnte nicht gelesen werden.' : err.message;
    return send(res, 500, { error: message || 'Serverfehler' });
  }
});

server.listen(port, () => {
  console.log(`Regieplan server: http://localhost:${port}`);
  console.log(`Versionen: ${versionsDir}`);
});
