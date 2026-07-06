const fs = require('fs/promises');
const https = require('https');
const path = require('path');

const planFile = process.argv[2] || '20260617v1_LV_Regieplan_GREEN_FUTURE.json';
const playlistUrl = process.argv[3] || process.env.PLAYER_PLAYLIST || 'https://usa.derhacker.com/GFA_k1_SERVER.json';

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
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8').replace(/^\uFEFF/, '')));
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

function fold(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Ã¼/g, 'u')
    .replace(/Ã¶/g, 'o')
    .replace(/Ã–/g, 'o')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/\.(mov|mp4)$/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\bsocial\b/g, 'sozial')
    .replace(/\bsustainability\b/g, 'sustainability')
    .trim();
}

function scoreMatch(text, clip) {
  const hay = fold(`${clip.fileName} ${clip.relativePath}`);
  const needle = fold(text);
  if (!needle) return 0;
  if (hay === needle) return 1000;
  if (hay.includes(needle)) return 900 + needle.length;
  if (needle.includes(fold(clip.fileName))) return 850;
  const words = needle.split(/\s+/).filter((w) => w.length > 2);
  const hits = words.filter((w) => hay.includes(w)).length;
  return hits ? hits * 20 + Math.min(needle.length, 80) : 0;
}

function makeMedia(clip, rootUrl) {
  const url = joinUrl(rootUrl, clip.relativePath || clip.fileName || '');
  return {
    name: clip.fileName || path.basename(clip.relativePath || 'Player-Video.mp4'),
    type: clip.mime || 'video/mp4',
    url,
    remoteUrl: url,
    thumb: '',
    remote: true,
    relativePath: clip.relativePath || '',
    source: 'player-playlist',
    isLoop: !!clip.isLoop,
    endMode: clip.endMode || '',
    startMode: clip.startMode || '',
    transitionMode: clip.transitionMode || '',
  };
}

function findBestClip(text, clips) {
  const aliases = [
    [/green future sponsoren[_ ]logo/i, 'GFA_LOGOS_LOOP.mp4'],
    [/00[_ ]*green future[_ ]*loop[_ ]*logo/i, '00_LOOP_ALLGEMEIN 2.mp4'],
    [/baujuwel.*schneeweiss.*video/i, '02_Baujuwel. Nachhaltiges bauen & Wohnraum_KAISER.Fullscreen.mp4'],
  ];
  for (const [pattern, fileName] of aliases) {
    if (pattern.test(String(text || ''))) {
      const clip = clips.find((item) => String(item.fileName || '').toLowerCase() === fileName.toLowerCase());
      if (clip) return { clip, score: 1200 };
    }
  }
  let best = null;
  for (const clip of clips) {
    const score = scoreMatch(text, clip);
    if (!best || score > best.score) best = { clip, score };
  }
  return best && best.score >= 80 ? best : null;
}

async function main() {
  const rawPlan = await fs.readFile(planFile, 'utf8');
  const plan = JSON.parse(rawPlan.replace(/^\uFEFF/, ''));
  const playlist = await fetchJson(playlistUrl);
  const rootUrl = playlist.serverRoot || process.env.PLAYER_ROOT || 'https://usa.derhacker.com/CONTENT/';
  const clips = playlist.clips || [];
  const unmatched = [];
  const matched = [];

  for (const [rowIndex, row] of (plan.rows || []).entries()) {
    for (const [screenId, slot] of Object.entries(row.screens || {})) {
      const text = slot && slot.text;
      if (!text) continue;
      const best = findBestClip(text, clips);
      if (!best) {
        unmatched.push({ rowIndex, start: row.start, what: row.what, screenId, text });
        continue;
      }
      slot.media = makeMedia(best.clip, rootUrl);
      matched.push({ rowIndex, start: row.start, text, clip: best.clip.fileName, score: best.score });
    }
  }

  plan.playerPlaylist = playlistUrl;
  plan.playerRoot = rootUrl;
  plan.playerEmbeddedAt = new Date().toISOString();

  const backup = `${planFile}.before-player-embed.bak`;
  try {
    await fs.access(backup);
  } catch (err) {
    await fs.writeFile(backup, rawPlan, 'utf8');
  }
  await fs.writeFile(planFile, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ planFile, backup, clips: clips.length, matched: matched.length, unmatched: unmatched.length, unmatchedItems: unmatched }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
