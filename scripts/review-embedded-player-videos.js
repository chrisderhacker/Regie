const fs = require('fs');

const planFile = process.argv[2] || '20260617v1_LV_Regieplan_GREEN_FUTURE.json';
const outFile = process.argv[3] || 'embedded-player-video-review.json';
const plan = JSON.parse(fs.readFileSync(planFile, 'utf8').replace(/^\uFEFF/, ''));

function fold(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/Ã¤/g, 'ae')
    .replace(/Ã¶/g, 'oe')
    .replace(/Ã¼/g, 'ue')
    .replace(/Ã–/g, 'oe')
    .replace(/\.mov|\.mp4/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\bsocial\b/g, 'sozial')
    .trim();
}

function words(value) {
  return fold(value).split(/\s+/).filter((word) => word.length > 2 && !['video', 'loop', 'winner', 'gewinner'].includes(word));
}

function overlap(a, b) {
  const hay = fold(b);
  const list = words(a);
  if (!list.length) return 0;
  return list.filter((word) => hay.includes(word)).length / list.length;
}

const review = [];
for (const [rowIndex, row] of (plan.rows || []).entries()) {
  for (const [screenId, slot] of Object.entries(row.screens || {})) {
    if (!slot || !slot.text || !slot.media) continue;
    const text = slot.text;
    const media = slot.media.name || '';
    const exact = fold(text) === fold(media);
    const contained = fold(media).includes(fold(text)) || fold(text).includes(fold(media));
    const ratio = overlap(text, `${media} ${slot.media.relativePath || ''}`);
    if (!exact && !contained && ratio < 0.75) {
      review.push({
        rowIndex,
        start: row.start || '',
        what: String(row.what || '').replace(/\s+/g, ' ').trim(),
        screenId,
        regieplanText: text,
        embeddedFile: media,
        url: slot.media.remoteUrl || slot.media.url || '',
        overlap: Number(ratio.toFixed(2)),
      });
    }
  }
}

fs.writeFileSync(outFile, `${JSON.stringify({ planFile, count: review.length, review }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ outFile, count: review.length, review }, null, 2));
