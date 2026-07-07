const fs = require('fs/promises');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist-ftp');
const defaultJson = '20260617v1_LV_Regieplan_GREEN_FUTURE.json';

async function copyFile(from, to) {
  const target = to || from;
  await fs.mkdir(path.dirname(path.join(out, target)), { recursive: true });
  await fs.copyFile(path.join(root, from), path.join(out, target));
}

function replaceBlock(source, startNeedle, endNeedle, replacement) {
  const start = source.indexOf(startNeedle);
  const end = source.indexOf(endNeedle, start);
  if (start < 0 || end < 0) {
    throw new Error(`Block nicht gefunden: ${startNeedle}`);
  }
  return source.slice(0, start) + replacement.trim() + '\n' + source.slice(end);
}

function makeStaticAppJs(source) {
  let js = source;

  js = js.replace(
    `const DEFAULT_PROJECT_FILE='${defaultJson}';`,
    `const DEFAULT_PROJECT_FILE='${defaultJson}';\nconst STATIC_FTP_MODE=true;\nconst PLAYER_PLAYLIST_URL='https://usa.derhacker.com/GFA_k1_SERVER.json';\nconst PLAYER_ROOT_URL='https://usa.derhacker.com/CONTENT/';`
  );

  js = js.replace(
    'async function serverFetch(path,options={}){',
    `async function serverFetch(path,options={}){
  if(typeof STATIC_FTP_MODE!=='undefined'&&STATIC_FTP_MODE){
    if(path==='/api/versions')return {versions:[]};
    if(String(path).startsWith('/api/versions/'))throw new Error('FTP-Version: Server-Versionen sind deaktiviert.');
    if(path==='/api/default-project')return fetchJsonFile(DEFAULT_PROJECT_FILE);
    if(path==='/api/player-playlist'){
      const playlist=await fetchJsonFile(PLAYER_PLAYLIST_URL);
      const rootUrl=playlist.serverRoot||PLAYER_ROOT_URL;
      const join=(rel)=>new URL(String(rel||'').replace(/^\\/+/,''),rootUrl.endsWith('/')?rootUrl:rootUrl+'/').toString();
      return {
        app:playlist.app||'player-playlist',
        version:playlist.version||1,
        clips:(playlist.clips||[]).map((clip,index)=>({
          index,
          type:clip.type||'video',
          name:clip.fileName||String(clip.relativePath||'').split('/').pop()||'Player-Video',
          mime:clip.mime||'video/mp4',
          relativePath:clip.relativePath||clip.fileName||'',
          url:join(clip.relativePath||clip.fileName||''),
          isLoop:!!clip.isLoop,
          endMode:clip.endMode||'',
          startMode:clip.startMode||'',
          transitionMode:clip.transitionMode||'',
          markColor:clip.markColor||'',
          thumbnail:clip.thumbnail?join(clip.thumbnail):''
        }))
      };
    }
  }`
  );

  js = replaceBlock(js, 'async function saveServerVersion(){', 'async function loadServerVersions(){', `
async function saveServerVersion(){
  try{
    bumpVersion();
    syncVersionField();
    saveLocal(false);
    const blob=new Blob([JSON.stringify(exportableState(),null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=\`\${versionText()}_\${safeProjectName()}.json\`;
    a.style.display='none';
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},150);
    setServerStatus('FTP-Version: Server-Speichern ist deaktiviert. Die Version wurde als JSON heruntergeladen.');
  }catch(err){
    console.error(err);
    setServerStatus('Export fehlgeschlagen: '+err.message);
    alert('Export fehlgeschlagen: '+err.message);
  }
}
`);

  js = replaceBlock(js, 'async function loadServerVersions(){', 'async function loadServerVersion(id){', `
async function loadServerVersions(){
  const box=$('#versionList');
  if(box)box.innerHTML='<div class="help">FTP-Version: Server-Versionen sind ohne Node/PHP noch deaktiviert. Nutze Export oder Lokal speichern.</div>';
  setServerStatus('FTP-Version bereit. Default-Regieplan wird direkt aus der JSON geladen.');
}
`);

  js = replaceBlock(js, 'async function loadServerVersion(id){', 'let playerClips=[];', `
async function loadServerVersion(id){
  setServerStatus('FTP-Version: Gespeicherte Server-Versionen sind ohne Node/PHP noch deaktiviert.');
}
`);

  js = replaceBlock(js, 'async function loadPlayerClips(){', 'function hasStoredLocalProject(){', `
async function loadPlayerClips(){
  try{
    const playlist=await fetchJsonFile(PLAYER_PLAYLIST_URL);
    const rootUrl=playlist.serverRoot||PLAYER_ROOT_URL;
    const join=(rel)=>new URL(String(rel||'').replace(/^\\/+/,''),rootUrl.endsWith('/')?rootUrl:rootUrl+'/').toString();
    playerClips=(playlist.clips||[]).map((clip,index)=>({
      index,
      type:clip.type||'video',
      name:clip.fileName||String(clip.relativePath||'').split('/').pop()||'Player-Video',
      mime:clip.mime||'video/mp4',
      relativePath:clip.relativePath||clip.fileName||'',
      url:join(clip.relativePath||clip.fileName||''),
      isLoop:!!clip.isLoop,
      endMode:clip.endMode||'',
      startMode:clip.startMode||'',
      transitionMode:clip.transitionMode||'',
      markColor:clip.markColor||'',
      thumbnail:clip.thumbnail?join(clip.thumbnail):''
    }));
    const box=$('#playerClipList'); if(!box)return;
    box.innerHTML=playerClips.map((clip,i)=>\`<div class="clipItem"><div><b>\${esc(clip.name)}</b><span>\${esc(clip.relativePath||clip.url)}\${clip.isLoop?' · LOOP':''}</span></div><button class="mini" data-insert-player-clip="\${i}">Einfügen</button></div>\`).join('')||'<div class="help">Keine Videos in der Player-Playlist gefunden.</div>';
    $$('[data-insert-player-clip]').forEach(b=>b.addEventListener('click',()=>insertPlayerClip(b.dataset.insertPlayerClip)));
    setPlayerStatus(\`\${playerClips.length} Player-Video(s) geladen.\`);
  }catch(err){
    console.warn(err);
    setPlayerStatus('Player-Playlist nicht erreichbar: '+err.message);
  }
}
`);

  js = replaceBlock(js, 'async function loadDefaultProjectFromServer(force=true){', 'function saveLocal(){', `
async function loadDefaultProjectFromServer(force=true){
  if(!force&&hasStoredLocalProject())return;
  if(new URLSearchParams(location.search).get('local')==='1')return;
  try{
    const data=await fetchJsonFile(DEFAULT_PROJECT_FILE);
    state=data.state||data;
    render();
    setServerStatus('Standard-Projekt geladen aus '+DEFAULT_PROJECT_FILE+': '+(state.projectName||'Regieplan'));
  }catch(err){
    console.warn('Standard-Projekt nicht geladen',err);
    setServerStatus('Standard-Projekt nicht geladen: '+err.message);
  }
}
`);

  js = replaceBlock(js, 'function saveLocal(){', 'function applyCleanColorDefaults(force=false){', `
function saveLocal(){
  try{
    localStorage.setItem('regieplan_webapp_v36_meta',JSON.stringify({
      projectName:state.projectName||'Regieplan',
      projectVersion:state.projectVersion||'',
      savedAt:new Date().toISOString()
    }));
  }catch(e){}
}
function loadLocal(){
  // FTP-Version: Der Default-Regieplan wird immer direkt aus der JSON geladen.
}

`);

  js += `

/* ---- FTP static final overrides ---- */
(function(){
  async function staticLoadPlayerClips(){
    try{
      const playlist=await fetchJsonFile(PLAYER_PLAYLIST_URL);
      const rootUrl=playlist.serverRoot||PLAYER_ROOT_URL;
      const join=(rel)=>new URL(String(rel||'').replace(/^\\/+/,''),rootUrl.endsWith('/')?rootUrl:rootUrl+'/').toString();
      playerClips=(playlist.clips||[]).map((clip,index)=>({
        index,
        type:clip.type||'video',
        name:clip.fileName||String(clip.relativePath||'').split('/').pop()||'Player-Video',
        mime:clip.mime||'video/mp4',
        relativePath:clip.relativePath||clip.fileName||'',
        url:join(clip.relativePath||clip.fileName||''),
        isLoop:!!clip.isLoop,
        endMode:clip.endMode||'',
        startMode:clip.startMode||'',
        transitionMode:clip.transitionMode||'',
        markColor:clip.markColor||'',
        thumbnail:clip.thumbnail?join(clip.thumbnail):''
      }));
      const box=$('#playerClipList'); if(!box)return;
      box.innerHTML=playerClips.map((clip,i)=>\`<div class="clipItem"><div><b>\${esc(clip.name)}</b><span>\${esc(clip.relativePath||clip.url)}\${clip.isLoop?' · LOOP':''}</span></div><button class="mini" data-insert-player-clip="\${i}">Einfügen</button></div>\`).join('')||'<div class="help">Keine Videos in der Player-Playlist gefunden.</div>';
      $$('[data-insert-player-clip]').forEach(b=>b.addEventListener('click',()=>insertPlayerClip(b.dataset.insertPlayerClip)));
      setPlayerStatus(\`\${playerClips.length} Player-Video(s) geladen.\`);
    }catch(err){console.warn(err);setPlayerStatus('Player-Playlist nicht erreichbar: '+err.message)}
  }
  async function staticLoadDefaultProject(force=true){
    if(!force&&hasStoredLocalProject())return;
    if(new URLSearchParams(location.search).get('local')==='1')return;
    try{
      const data=await fetchJsonFile(DEFAULT_PROJECT_FILE);
      state=data.state||data;
      render();
      setServerStatus('FTP-Version: Standard-Projekt geladen aus '+DEFAULT_PROJECT_FILE);
    }catch(err){console.warn(err);setServerStatus('Standard-Projekt nicht geladen: '+err.message)}
  }
  function hasRealProjectRows(){
    return Array.isArray(state?.rows)&&state.rows.length>20&&document.querySelectorAll('#tbody tr').length>20;
  }
  function ensureDefaultProjectLoaded(){
    if(new URLSearchParams(location.search).get('local')==='1')return;
    if(hasRealProjectRows())return;
    staticLoadDefaultProject(true).catch(err=>console.warn('Default-Watchdog konnte den Regieplan nicht laden',err));
  }
  window.saveServerVersion=async function(){
    bumpVersion();syncVersionField();saveLocal(false);
    const blob=new Blob([JSON.stringify(exportableState(),null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=\`\${versionText()}_\${safeProjectName()}.json\`;a.style.display='none';
    document.body.appendChild(a);a.click();
    setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},150);
    setServerStatus('FTP-Version: Version wurde als JSON heruntergeladen.');
  };
  window.loadServerVersions=async function(){
    const box=$('#versionList');
    if(box)box.innerHTML='<div class="help">FTP-Version: Server-Versionen sind ohne Node/PHP deaktiviert. Nutze Export oder Lokal speichern.</div>';
    setServerStatus('FTP-Version bereit. Default-Regieplan wird direkt aus der JSON geladen.');
  };
  window.loadServerVersion=async function(){setServerStatus('FTP-Version: Server-Versionen sind ohne Node/PHP deaktiviert.');};
  window.loadPlayerClips=staticLoadPlayerClips;
  window.loadDefaultProjectFromServer=staticLoadDefaultProject;
  try{saveServerVersion=window.saveServerVersion;loadServerVersions=window.loadServerVersions;loadServerVersion=window.loadServerVersion;loadPlayerClips=window.loadPlayerClips;loadDefaultProjectFromServer=window.loadDefaultProjectFromServer;}catch(e){}
  setTimeout(()=>{try{loadServerVersions();loadDefaultProjectFromServer(true);loadPlayerClips();}catch(e){console.warn(e)}},0);
  window.addEventListener('load',()=>setTimeout(ensureDefaultProjectLoaded,250));
  setTimeout(ensureDefaultProjectLoaded,1200);
})();
`;

  return js;
}

async function main() {
  await fs.rm(out, { recursive: true, force: true });
  await fs.mkdir(path.join(out, 'assets'), { recursive: true });
  await copyFile('index.html');
  await copyFile('assets/app.css');
  await copyFile(defaultJson);
  await copyFile('README.md');

  const appJs = await fs.readFile(path.join(root, 'assets/app.js'), 'utf8');
  await fs.writeFile(path.join(out, 'assets/app.js'), makeStaticAppJs(appJs), 'utf8');

  const indexPath = path.join(out, 'index.html');
  let index = await fs.readFile(indexPath, 'utf8');
  index = index
    .replace(/assets\/app\.css\?v=[^"']+/g, 'assets/app.css?v=ftp-static-20260707-v126')
    .replace(/assets\/app\.js\?v=[^"']+/g, 'assets/app.js?v=ftp-static-20260707-v126')
    .replace(/<div class="buildBadge" id="buildBadge">[^<]*<\/div>/, '<div class="buildBadge" id="buildBadge">FTP 20260707-v126</div>');
  await fs.writeFile(indexPath, index, 'utf8');

  await fs.writeFile(path.join(out, 'UPLOAD-HINWEIS.txt'), [
    'FTP-Upload fuer regie.derhacker.com',
    '',
    'Diese Dateien/Ordner komplett in den Webroot der Subdomain hochladen:',
    '- index.html',
    '- assets/',
    `- ${defaultJson}`,
    '',
    'Diese statische Version braucht kein Node.js.',
    'Server-Versionen speichern ist in dieser FTP-Version deaktiviert und erzeugt stattdessen einen JSON-Download.',
    'Der Default-Regieplan wird direkt aus der JSON-Datei geladen.',
    '',
    'Spaeter fuer Hostinger/Node nehmen wir wieder server.js/package.json dazu.',
    ''
  ].join('\n'), 'utf8');

  console.log(`Static FTP build written to ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
