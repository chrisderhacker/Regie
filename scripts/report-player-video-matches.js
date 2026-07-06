const fs = require('fs');

const planFile = process.argv[2] || '20260617v1_LV_Regieplan_GREEN_FUTURE.json';
const playlistFile = process.argv[3] || 'C:/tmp/GFA_k1_SERVER.sample.json';
const outFile = process.argv[4] || 'player-video-match-report.json';

const plan = JSON.parse(fs.readFileSync(planFile, 'utf8').replace(/^\uFEFF/, ''));
const player = JSON.parse(fs.readFileSync(playlistFile, 'utf8').replace(/^\uFEFF/, ''));

const stopWords = new Set(['video', 'loop', 'gewinner', 'winner', 'fullscreen', 'mp4', 'mov', 'oder']);

function fixMojibake(value) {
  return String(value || '')
    .replace(/Ã¼/g, 'ue')
    .replace(/Ãœ/g, 'ue')
    .replace(/Ã¶/g, 'oe')
    .replace(/Ã–/g, 'oe')
    .replace(/Ã¤/g, 'ae')
    .replace(/Ã„/g, 'ae')
    .replace(/ÃŸ/g, 'ss')
    .replace(/â/g, '-')
    .replace(/â|â/g, '"');
}

function fold(value) {
  return fixMojibake(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/\.(mov|mp4)$/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\bsocial\b/g, 'sozial')
    .replace(/\bsustainability\b/g, 'sustainability')
    .trim();
}

function tokens(value) {
  return fold(value).split(/\s+/).filter((word) => word.length > 2 && !stopWords.has(word));
}

function clipText(clip) {
  return `${clip.fileName || ''} ${clip.relativePath || ''}`;
}

function score(text, clip) {
  const needle = fold(text);
  const hay = fold(clipText(clip));
  const file = fold(clip.fileName || '');
  if (!needle) return 0;
  let points = 0;
  if (hay === needle || file === needle) points += 1000;
  if (hay.includes(needle)) points += 700 + needle.length;
  if (needle.includes(file) && file.length > 6) points += 600;
  const needleTokens = tokens(text);
  const hits = needleTokens.filter((word) => hay.includes(word));
  points += hits.length * 100;
  points += hits.join('').length;
  if (/\b(loop|logo)\b/.test(needle) && /\b(loop|logo)\b/.test(hay)) points += 60;
  if (/\b(video|botschaft)\b/.test(needle) && /\b(video|botschaft)\b/.test(hay)) points += 60;
  return points;
}

function categoryFromRow(row) {
  return fold(`${row.what || ''} ${row.detail || ''}`);
}

const rows = [];
for (const [rowIndex, row] of (plan.rows || []).entries()) {
  for (const [screenId, slot] of Object.entries(row.screens || {})) {
    if (!slot || !slot.text) continue;
    const ranked = (player.clips || [])
      .map((clip, clipIndex) => ({
        clipIndex,
        fileName: clip.fileName || '',
        relativePath: clip.relativePath || '',
        score: score(slot.text, clip),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    const current = slot.media && slot.media.name ? slot.media.name : '';
    const best = ranked[0] || { fileName: '', score: 0 };
    const second = ranked[1] || { fileName: '', score: 0 };
    const currentIsBest = current === best.fileName;
    const closeRace = second.score && best.score - second.score < 80;
    const lowScore = best.score < 140;
    rows.push({
      rowIndex,
      start: row.start || '',
      what: String(row.what || '').replace(/\s+/g, ' ').trim(),
      screenId,
      text: slot.text,
      current,
      best: best.fileName,
      bestScore: best.score,
      second: second.fileName,
      secondScore: second.score,
      currentIsBest,
      uncertain: !currentIsBest || closeRace || lowScore,
      candidates: ranked,
      categoryHint: categoryFromRow(row),
    });
  }
}

const report = {
  planFile,
  playlistFile,
  total: rows.length,
  uncertain: rows.filter((row) => row.uncertain).length,
  rows,
};

fs.writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  total: report.total,
  uncertain: report.uncertain,
  outFile,
  uncertainRows: report.rows.filter((row) => row.uncertain).map((row) => ({
    rowIndex: row.rowIndex,
    start: row.start,
    text: row.text,
    current: row.current,
    best: row.best,
    second: row.second,
    bestScore: row.bestScore,
    secondScore: row.secondScore,
  })),
}, null, 2));
