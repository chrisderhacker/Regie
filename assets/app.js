/* ---- script block 1 ---- */
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const uid=()=>Math.random().toString(36).slice(2,9); const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const pad=n=>String(n).padStart(2,'0'); const ymd=()=>{let d=new Date();return d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())};
function dateDE(d=new Date()){return pad(d.getDate())+'.'+pad(d.getMonth()+1)+'.'+d.getFullYear()}
function parseVersionMeta(){
 let pv=String(state.projectVersion||'');
 let currentDate=ymd();
 if(!state.projectDate){
  let compact=pv.match(/(20\d{6})\s*v\s*(\d+)/i);
  let oldDate=pv.match(/Stand:\s*(\d{2})\.(\d{2})\.(\d{4})/i);
  state.projectDate=compact?compact[1]:(oldDate?oldDate[3]+oldDate[2]+oldDate[1]:currentDate);
 }
 if(!state.versionNumber){
  let compact=pv.match(/v\s*(\d+)/i);
  let old=pv.match(/Version\s*(\d+)(?:[.,]\d+)?/i);
  state.versionNumber=compact?parseInt(compact[1],10):(old?parseInt(old[1],10):1);
 }
 state.versionNumber=Math.max(1,parseInt(state.versionNumber,10)||1);
}
function versionText(){parseVersionMeta();return `${state.projectDate||ymd()}v${state.versionNumber||1}`}
function syncVersionField(){state.projectVersion=versionText();let el=$('#projectVersion');if(el){el.value=state.projectVersion;el.readOnly=true;el.title='Automatisch: YYYYMMDDv1. Export JSON erhöht auf die nächste Version.'}}
function bumpVersion(){parseVersionMeta();state.projectDate=ymd();state.versionNumber=(parseInt(state.versionNumber,10)||1)+1;state.projectVersion=versionText();saveLocal(false)}
function t2s(t){let p=String(t||'0').trim().replace(',',':').split(':').map(Number); if(p.some(Number.isNaN))return 0; if(p.length===1)p=[0,p[0],0]; if(p.length===2)p=[0,p[0],p[1]]; return Math.max(0,(p[0]||0)*3600+(p[1]||0)*60+(p[2]||0));}
function s2t(s){s=Math.max(0,Math.round(s||0));return `${pad(Math.floor(s/3600))}:${pad(Math.floor(s%3600/60))}:${pad(s%60)}`}
function norm(t){return s2t(t2s(t))} function contrast(hex){hex=(hex||'#000000').replace('#','');let r=parseInt(hex.slice(0,2),16)||0,g=parseInt(hex.slice(2,4),16)||0,b=parseInt(hex.slice(4,6),16)||0;return ((r*299+g*587+b*114)/1000)>145?'#111711':'#fff'}
const baseCols=[{id:'handle',name:'',fixed:true,show:true},{id:'color',name:'Farbe',fixed:true,show:true},{id:'cue',name:'Cue',fixed:true,show:true},{id:'start',name:'Start',fixed:true,show:true},{id:'duration',name:'Dauer',fixed:true,show:true},{id:'end',name:'Ende',fixed:true,show:true},{id:'what',name:'Was / Aktion',show:true,type:'text'},{id:'people',name:'Beteiligte',show:true,type:'people'},{id:'detail',name:'Detail / Regie',show:true,type:'text'},{id:'light',name:'Licht',show:true,type:'text'},{id:'sound',name:'Audio / Ton',show:true,type:'text'},{id:'camera',name:'Kamera / Zusatz',show:true,type:'text'},{id:'responsible',name:'Verantwortlich',show:false,type:'text'},{id:'moderation',name:'Moderation',show:false,type:'text'},{id:'standby',name:'Stand-by',show:false,type:'text'},{id:'mic',name:'Mikro',show:false,type:'text'},{id:'playback',name:'Zuspielung',show:false,type:'text'},{id:'graphic',name:'Grafik / BB',show:false,type:'text'},{id:'stagepos',name:'Position',show:false,type:'text'},{id:'props',name:'Requisite',show:false,type:'text'},{id:'catering',name:'Catering',show:false,type:'text'},{id:'safety',name:'Sicherheit',show:false,type:'text'},{id:'status',name:'Status',show:false,type:'text'},{id:'notes',name:'Notizen',show:false,type:'text'}];
const columnTemplates=[{id:'responsible',name:'Verantwortlich'},{id:'moderation',name:'Moderation'},{id:'standby',name:'Stand-by'},{id:'mic',name:'Mikro'},{id:'playback',name:'Zuspielung'},{id:'graphic',name:'Grafik / BB'},{id:'stagepos',name:'Position'},{id:'props',name:'Requisite'},{id:'catering',name:'Catering'},{id:'safety',name:'Sicherheit'},{id:'status',name:'Status'},{id:'notes',name:'Notizen'},{id:'prompt',name:'Prompt'},{id:'camera2',name:'Kamera 2'}];
const basePresets=[{id:'neutral',name:'Standard',dark:'#121812',light:'#ffffff'},{id:'violet',name:'Show',dark:'#4b206d',light:'#f3d8ff'},{id:'blue',name:'Video',dark:'#0f4670',light:'#dff2ff'},{id:'green',name:'Talk',dark:'#16482c',light:'#dcfbe5'},{id:'orange',name:'Umbau',dark:'#70450d',light:'#ffe7bd'},{id:'red',name:'Achtung',dark:'#6e2222',light:'#ffd8d8'},{id:'yellow',name:'Pause',dark:'#64580a',light:'#fff8bd'},{id:'lime',name:'Cue',dark:'#2e4708',light:'#efffc2'}];
let state={projectName:'Regieplan Eventname',projectDate:'',versionNumber:1,projectVersion:'',theme:'dark',zoom:1,logo:null,logoMode:'contain',logoPos:{x:50,y:50},cols:JSON.parse(JSON.stringify(baseCols)),screens:[{id:'screen1',name:'LED Main',res:'1920x1080'}],columnOrder:null,people:[],presets:JSON.parse(JSON.stringify(basePresets)),colWidths:{},rowHeights:{},showStartRowId:null,rows:[]};
function defaultRows(){state.rows=[row('neutral','09:00:00','00:10:00','Einlass / Welcome Loop','Gäste kommen an. Hintergrundmusik leise.','Welcome Loop','Einlass','Welcome Loop',''),row('blue','09:10:00','00:02:00','Intro Video','Licht runter, Video auf LED.','Intro.mp4','Video-Licht','Video Ton',''),row('green','09:12:00','00:05:00','Begrüßung Moderator','Moderator kommt auf Bühne.','Live Bild + Bauchbinde','Bühne','Headset 1','Cam 1')];recalc(0,false)}
function row(preset,start,duration,what,detail,screenText,light,sound,camera){let r={id:uid(),preset,start,duration,end:'',what,people:[],detail,light,sound,camera,screens:{}};state.screens.forEach(s=>r.screens[s.id]={text:screenText||'',media:null});return r}
defaultRows();
function preset(id){return state.presets.find(p=>p.id===id)||state.presets[0]||basePresets[0]} function colorsFor(p){let bg=state.theme==='light'?(p.light||'#fff'):(p.dark||'#111');return{bg,tx:state.theme==='light'?(p.textLight||contrast(bg)):(p.textDark||'#ffffff')}}
function allDisplayCols(){let shown=state.cols.filter(c=>c.show);let screenCols=state.screens.map(s=>({id:'screen:'+s.id,name:`${s.name} · ${s.res}`,type:'screen'}));return [...shown,...screenCols]}
function ensureColumnOrder(){let ids=allDisplayCols().map(c=>c.id);if(!Array.isArray(state.columnOrder))state.columnOrder=[...ids];state.columnOrder=state.columnOrder.filter(id=>ids.includes(id));ids.forEach(id=>{if(!state.columnOrder.includes(id))state.columnOrder.push(id)});}
function colById(id){if(id.startsWith('screen:')){let sid=id.split(':')[1],s=state.screens.find(x=>x.id===sid);return s?{id,name:`${s.name} · ${s.res}`,type:'screen'}:null}return state.cols.find(c=>c.id===id)||null}
function cols(){ensureColumnOrder();return state.columnOrder.map(colById).filter(Boolean).filter(c=>c.show!==false)}
function defaultColumnWidth(c){if(!c)return 140;if(c.id==='handle')return 46;if(c.id==='cue')return 54;if(c.id==='color')return 120;if(['start','duration','end'].includes(c.id))return 116;if(c.id==='what')return 220;if(c.id==='people')return 230;if(c.id==='detail')return 290;if(c.id==='sound')return 260;if(c.type==='screen')return 300;return 150}
function colWidth(c){state.colWidths=state.colWidths||{};return Math.max(44,Math.round(state.colWidths[c.id]||defaultColumnWidth(c)))}
function colStyle(c){let w=colWidth(c);return `width:calc(${w}px * var(--zoom));min-width:calc(${w}px * var(--zoom));max-width:calc(${w}px * var(--zoom));`}
function setColWidth(id,w,persist=true){state.colWidths=state.colWidths||{};state.colWidths[id]=Math.max(44,Math.min(1200,Math.round(w)));if(persist)saveLocal(false)}
function autoExpandMediaColumn(colId,media,rowId){let kind=mediaKind(media);let current=colWidth({id:colId,type:colId==='sound'?'text':'screen'});let target=kind==='VIDEO'||kind==='BILD'?620:(kind==='AUDIO'?260:current);if(current<target)setColWidth(colId,target);if(rowId){let r=state.rows.find(x=>x.id===rowId);if(r){let rh=rowHeight(r);let targetH=(kind==='VIDEO'||kind==='BILD')?170:(kind==='AUDIO'?120:rh);if(rh<targetH)setRowHeight(rowId,targetH)}}}
function rowHasMedia(r){return !!(r?.soundMedia)||!!Object.values(r?.screens||{}).some(s=>s&&s.media)}
function rowHeight(r){state.rowHeights=state.rowHeights||{};let def=r?.isBlock?52:(rowHasMedia(r)?126:64);return Math.max(36,Math.round(state.rowHeights[r.id]||def))}
function rowStyle(r){return `--row-h:calc(${rowHeight(r)}px * var(--zoom));`}
function setRowHeight(id,h,persist=true){state.rowHeights=state.rowHeights||{};state.rowHeights[id]=Math.max(36,Math.min(320,Math.round(h)));if(persist)saveLocal(false)}
function currentInsertIndex(){let id=state.activeRowId;let i=state.rows.findIndex(r=>r.id===id);return i>=0?i+1:state.rows.length}
function firstTimedRow(){return (state.rows||[]).find(r=>!r.isBlock)||null}
function showStartRow(){let r=(state.rows||[]).find(x=>x.id===state.showStartRowId&&!x.isBlock);return r||firstTimedRow()}
function showStartIndex(){let r=showStartRow();return r?state.rows.findIndex(x=>x.id===r.id):-1}
function totalDurationSeconds(){let start=showStartIndex();if(start<0)return 0;return (state.rows||[]).slice(start).reduce((sum,r)=>sum+(r.isBlock?0:t2s(r.duration)),0)}
function totalDurationText(){let s=totalDurationSeconds();let h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;return h?`${h}:${pad(m)}:${pad(sec)}`:`${m}:${pad(sec)}`}
function showStartText(){let r=showStartRow();return r?norm(r.start||'00:00:00'):'–'}
function render(){document.body.classList.toggle('light',state.theme==='light');document.documentElement.style.setProperty('--zoom',state.zoom);$('#themeBtn').textContent=state.theme==='light'?'Dark Mode':'Light Mode';$('#zoomLabel').textContent=Math.round(state.zoom*100)+'%';$('#projectName').value=state.projectName;syncVersionField();$('#headline').textContent=state.projectName||'Regieplan';renderLogo();renderTable();renderSide();saveLocal(false)}
function renderLogo(){let f=$('#logoFrame'); if(state.logo){f.classList.add('hasLogo');f.style.backgroundImage=`url(${state.logo})`;f.style.backgroundSize=state.logoMode==='cover'?'cover':'contain';f.style.backgroundPosition=`${state.logoPos.x}% ${state.logoPos.y}%`}else{f.classList.remove('hasLogo');f.style.backgroundImage=''}$('#logoFit').classList.toggle('active',state.logoMode!=='cover');$('#logoFill').classList.toggle('active',state.logoMode==='cover')}
function isDeletableCol(c){return c&&!c.fixed&&c.id!=='sound'}
function colDeleteButton(c){return isDeletableCol(c)?`<button type="button" class="colDelete" data-delete-col="${esc(c.id)}" title="Spalte ausblenden/löschen">×</button>`:''}
function rowActions(r){return `<td class="rowActionsCell"><div class="rowActions"><button type="button" class="rowActionBtn dim" data-toggle-row-muted="${r.id}" title="Zeile ausgrauen/einblenden">${r.muted?'◐':'○'}</button><button type="button" class="rowActionBtn delete" data-delete-row="${r.id}" title="Zeile löschen">×</button></div></td>`}
function renderTable(){let c=cols();$('#thead').innerHTML='<tr>'+c.map(x=>`<th draggable="true" data-colhead="${esc(x.id)}" title="Spalte ziehen und sortieren · rechten Rand ziehen zum Vergrößern" style="${colStyle(x)}"><span class="colBox ${isDeletableCol(x)?'hasDelete':''}">${esc(x.name||'')}</span>${colDeleteButton(x)}<span class="colResize" data-resize-col="${esc(x.id)}" title="Spaltenbreite ziehen"></span></th>`).join('')+'<th class="rowActionsHead">AKTION</th></tr>';let q=($('#search').value||'').toLowerCase();$('#tbody').innerHTML='';let cue=0;state.rows.forEach((r,i)=>{if(q&&!JSON.stringify(r).toLowerCase().includes(q))return;let p=preset(r.preset),ct=colorsFor(p);let tr=document.createElement('tr');tr.dataset.id=r.id;tr.style.setProperty('--row-bg',ct.bg);tr.style.setProperty('--row-text',ct.tx);tr.style.cssText += rowStyle(r);if(r.id===state.activeRowId)tr.classList.add('activeRow');if(r.muted)tr.classList.add('rowMuted');if(r.isBlock){tr.classList.add('blockSeparator');tr.innerHTML=`<td colspan="${c.length}"><div class="blockBar"><span class="grip" draggable="true" title="Trenner ziehen">⋮⋮</span><div class="colorPill" data-color="${r.id}">${esc(preset(r.preset).name)}</div><input class="blockInput" data-field="what" value="${esc(r.what||'Abschnitt')}" placeholder="Abschnitt / Blocktitel"><span class="rowResize" data-resize-row="${r.id}" title="Zeilenhöhe ziehen"></span></div></td>${rowActions(r)}`;}else{cue++;tr.innerHTML=c.map(col=>cell(col,r,cue,ct)).join('')+rowActions(r);}$('#tbody').appendChild(tr)});bindTable()}
function cell(c,r,cueNo,ct){let st=colStyle(c);if(c.id==='handle')return `<td class="handleCell" style="${st}"><span class="grip" draggable="true" title="Zeile ziehen">⋮⋮</span><span class="rowResize" data-resize-row="${r.id}" title="Zeilenhöhe ziehen"></span></td>`;if(c.id==='color')return `<td class="colorCell" style="${st}"><div class="colorPill" data-color="${r.id}" style="background:${ct.bg};color:${ct.tx}">${esc(preset(r.preset).name)}</div></td>`;if(c.id==='cue')return `<td class="cueCell" style="${st}">${cueNo}</td>`;if(c.id==='start')return `<td style="${st}"><div class="timeCell"><button type="button" class="showStartBtn ${state.showStartRowId===r.id?'active':''}" data-show-start="${r.id}" title="Diese Zeile als Show-Start setzen">SHOW START</button><input class="cellInput time" data-field="start" value="${esc(r.start)}"></div></td>`;if(c.id==='duration')return `<td style="${st}"><input class="cellInput duration" data-field="duration" value="${esc(r.duration)}" title="Mausrad: ±1 Minute · Shift: ±10 Minuten"></td>`;if(c.id==='end')return `<td style="${st}"><input class="cellInput endInput" data-end="1" value="${esc(r.end)}" readonly></td>`;if(c.type==='people')return `<td class="col-people" style="${st}"><div class="peopleCell" data-people="1">${(r.people||[]).map(pid=>token(pid)).join('')}</div></td>`;if(c.type==='screen'){let sid=c.id.split(':')[1],s=(r.screens&&r.screens[sid])||{text:'',media:null};return `<td class="col-screen" style="${st}"><div class="mediaDrop ${s.media?'hasMedia':''}" data-screen="${sid}"><div class="mediaText" contenteditable="true">${esc(s.text||'')}</div>${media(s.media,r.id,sid)}${!s.media?`<button type="button" class="mediaAdd screenMediaAdd" data-pick-media="${r.id}|${sid}">+ Video/Bild</button>`:''}<input class="mediaFileInput" type="file" data-media-file="${r.id}|${sid}" accept="image/*,video/*,.mp4,.mov,.m4v,.webm,.jpg,.jpeg,.png,.gif,.webp"></div></td>`}if(c.id==='sound'){let m=r.soundMedia||null;return `<td class="col-small audioTonCol" style="${st}"><div class="mediaDrop audioTonDrop ${m?'hasMedia':''}" data-audio-ton="${r.id}"><div class="mediaText" contenteditable="true" data-audio-text="1">${esc(r.sound||'')}</div>${media(m,r.id,'sound')}${!m?`<button type="button" class="mediaAdd" data-pick-media="${r.id}|sound">+ MP3/WAV</button>`:''}<input class="mediaFileInput" type="file" data-media-file="${r.id}|sound" accept="audio/*,.mp3,.wav,.wave,.m4a,.aac,.ogg,.flac"></div></td>`}let klass=c.id==='what'?'col-what':c.id==='detail'?'col-detail':'col-small';return `<td class="${klass}" style="${st}"><textarea class="cellText" data-field="${c.id}">${esc(r[c.id]||'')}</textarea></td>`}
function cell(c,r,cueNo,ct){
  let st=colStyle(c);
  if(c.id==='handle')return `<td class="handleCell" style="${st}"><span class="grip" draggable="true" title="Zeile ziehen">⋮⋮</span><span class="rowResize" data-resize-row="${r.id}" title="Zeilenhoehe ziehen"></span></td>`;
  if(c.id==='color')return `<td class="colorCell" style="${st}"><div class="colorPill" data-color="${r.id}" style="background:${ct.bg};color:${ct.tx}">${esc(preset(r.preset).name)}</div></td>`;
  if(c.id==='cue')return `<td class="cueCell" style="${st}">${cueNo}</td>`;
  if(c.id==='start')return `<td style="${st}"><div class="timeCell"><button type="button" class="showStartBtn ${state.showStartRowId===r.id?'active':''}" data-show-start="${r.id}" title="Diese Zeile als Show-Start setzen">SHOW START</button><input class="cellInput time" data-field="start" value="${esc(r.start)}"></div></td>`;
  if(c.id==='duration')return `<td style="${st}"><input class="cellInput duration" data-field="duration" value="${esc(r.duration)}" title="Mausrad: +/-1 Minute, Shift: +/-10 Minuten"></td>`;
  if(c.id==='end')return `<td style="${st}"><input class="cellInput endInput" data-end="1" value="${esc(r.end)}" readonly></td>`;
  if(c.type==='people')return `<td class="col-people" style="${st}"><div class="peopleCell" data-people="1">${(r.people||[]).map(pid=>token(pid)).join('')}</div></td>`;
  if(c.type==='screen'){
    let sid=c.id.split(':')[1],s=(r.screens&&r.screens[sid])||{text:'',media:null},prev=previousScreenMedia(r.id,sid);
    let emptyTools=!s.media?`${prev?`<button type="button" class="mediaAdd previous" title="${esc(prev.media.name||'Vorheriges Medium')}" data-use-previous-media="${r.id}|${sid}">wie vorher</button>`:''}<button type="button" class="mediaAdd screenMediaAdd" data-pick-media="${r.id}|${sid}">+ Video/Bild</button>`:'';
    return `<td class="col-screen" style="${st}"><div class="mediaDrop ${s.media?'hasMedia':''}" data-screen="${sid}"><div class="mediaText" contenteditable="true">${esc(s.text||'')}</div>${media(s.media,r.id,sid)}${emptyTools}<input class="mediaFileInput" type="file" data-media-file="${r.id}|${sid}" accept="image/*,video/*,.mp4,.mov,.m4v,.webm,.jpg,.jpeg,.png,.gif,.webp"></div></td>`;
  }
  if(c.id==='sound'){
    let m=r.soundMedia||null;
    return `<td class="col-small audioTonCol" style="${st}"><div class="mediaDrop audioTonDrop ${m?'hasMedia':''}" data-audio-ton="${r.id}"><div class="mediaText" contenteditable="true" data-audio-text="1">${esc(r.sound||'')}</div>${media(m,r.id,'sound')}${!m?`<button type="button" class="mediaAdd" data-pick-media="${r.id}|sound">+ MP3/WAV</button>`:''}<input class="mediaFileInput" type="file" data-media-file="${r.id}|sound" accept="audio/*,.mp3,.wav,.wave,.m4a,.aac,.ogg,.flac"></div></td>`;
  }
  let klass=c.id==='what'?'col-what':c.id==='detail'?'col-detail':'col-small';
  return `<td class="${klass}" style="${st}"><textarea class="cellText" data-field="${c.id}">${esc(r[c.id]||'')}</textarea></td>`;
}
function token(pid){let p=state.people.find(x=>x.id===pid);if(!p)return'';return `<span class="personToken" data-pid="${p.id}">${p.img?`<img src="${p.img}">`:''}<span>${esc(p.name)}</span><button title="entfernen" data-remove-person="${p.id}">×</button><span class="hoverCard">${p.img?`<img src="${p.img}">`:''}<b>${esc(p.name)}</b><span>${esc(p.role||'')}</span></span></span>`}
function placeholderThumb(label,bg1='#0c1210',bg2='#050806',fg='#c9ff19'){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs><rect width="320" height="180" rx="18" fill="url(#g)"/><circle cx="104" cy="90" r="24" fill="rgba(255,255,255,.12)"/><polygon points="96,74 96,106 124,90" fill="#ffffff"/><text x="160" y="104" fill="${fg}" font-family="Arial, sans-serif" font-size="28" font-weight="700" text-anchor="middle">${label}</text></svg>`;return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
function extOf(name){return String(name||'').split('.').pop().toLowerCase()}
function audioWaveThumb(label='AUDIO'){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#111817"/><stop offset="1" stop-color="#050807"/></linearGradient></defs><rect width="320" height="180" rx="18" fill="url(#g)"/><path d="M38 92h31l14-34 24 82 22-108 28 124 22-92 18 28h85" fill="none" stroke="#c9ff19" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><text x="160" y="158" fill="#ffffff" font-family="Arial, sans-serif" font-size="24" font-weight="700" text-anchor="middle">${label}</text></svg>`;return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
function mediaKind(m){if(!m)return'';if((m.type||'').startsWith('video/'))return'VIDEO';if((m.type||'').startsWith('image/'))return'BILD';if((m.type||'').startsWith('audio/')){let e=extOf(m.name);return e==='wav'||e==='wave'?'WAV':(e==='mp3'?'MP3':'AUDIO')}return'DATEI'}
function mediaThumb(m){if(!m)return'';if((m.type||'').startsWith('video/'))return m.thumb||placeholderThumb('VIDEO');if((m.type||'').startsWith('image/'))return m.thumb||m.data;if((m.type||'').startsWith('audio/'))return m.thumb||audioWaveThumb(mediaKind(m));return m.thumb||placeholderThumb('FILE','#101415','#070909','#fff')}
function media(m,rowId,sid){if(!m)return'';let kind=mediaKind(m),thumb=mediaThumb(m),av=((m.type||'').startsWith('video/')||(m.type||'').startsWith('audio/')),stored=!!m.mediaKey,missing=(!m.data&&!m.url&&av&&!stored);let audioClass=(m.type||'').startsWith('audio/')?' audioThumb':'';return `<div class="mediaPreview" data-open-media="${rowId}|${sid}" data-missing="${missing?1:0}" data-stored="${stored?1:0}" title="${missing?'Datei erneut auswählen':'Datei öffnen'}"><div class="mediaThumbStack"><div class="mediaThumb${audioClass}"><img src="${thumb}" alt="${kind}"></div><span class="mediaBadge">${missing?'FEHLT':kind}</span></div><div class="mediaMeta"><span class="mediaName">${esc(m.name)}</span></div><div class="mediaTools"><button class="mediaTool replace" type="button" title="Datei ersetzen" data-pick-media="${rowId}|${sid}">↺</button><button class="mediaTool" type="button" title="Datei entfernen" data-clear-media="${rowId}|${sid}">×</button></div></div>`}
function media(m,rowId,sid){
  if(!m)return'';
  let kind=mediaKind(m),thumb=mediaThumb(m),av=((m.type||'').startsWith('video/')||(m.type||'').startsWith('audio/')),stored=!!m.mediaKey,remote=!!(m.remote||m.remoteUrl),missing=(!m.data&&!m.url&&av&&!stored&&!remote);
  let audioClass=(m.type||'').startsWith('audio/')?' audioThumb':'';
  let title=missing?'Datei erneut auswaehlen':'Datei oeffnen';
  let detail=m.relativePath||m.remoteUrl||m.url||m.name||'';
  return `<div class="mediaPreview" data-open-media="${rowId}|${sid}" data-missing="${missing?1:0}" data-stored="${stored?1:0}" data-remote="${remote?1:0}" title="${title}"><div class="mediaThumbStack"><span class="mediaTitle">${esc(m.name||'Datei')}</span><div class="mediaThumb${audioClass}"><img src="${thumb}" alt="${kind}"></div><span class="mediaBadge">${missing?'FEHLT':(remote?'LINK':kind)}</span></div><div class="mediaMeta"><span class="mediaName">${esc(detail)}</span></div><div class="mediaTools"><button class="mediaTool replace" type="button" title="Datei ersetzen" data-pick-media="${rowId}|${sid}">↺</button><button class="mediaTool" type="button" title="Datei entfernen" data-clear-media="${rowId}|${sid}">×</button></div></div>`;
}
function media(m,rowId,sid){
  if(!m)return'';
  let kind=mediaKind(m),av=((m.type||'').startsWith('video/')||(m.type||'').startsWith('audio/')),stored=!!m.mediaKey,remote=!!(m.remote||m.remoteUrl),missing=(!m.data&&!m.url&&av&&!stored&&!remote);
  let audioClass=(m.type||'').startsWith('audio/')?' audioThumb':'';
  let title=missing?'Datei erneut auswaehlen':'Datei oeffnen';
  let detail=m.relativePath||m.remoteUrl||m.url||m.name||'';
  let src=m.url||m.remoteUrl||m.data||'';
  let thumb=mediaThumb(m);
  let thumbHtml=((m.type||'').startsWith('video/')&&src&&!m.thumb)?`<video data-src="${esc(src)}" muted playsinline preload="none"></video>`:`<img src="${thumb}" alt="${kind}">`;
  let label=missing?'FEHLT':kind;
  return `<div class="mediaPreview" data-open-media="${rowId}|${sid}" data-missing="${missing?1:0}" data-stored="${stored?1:0}" data-remote="${remote?1:0}" title="${title}"><div class="mediaThumbStack"><div class="mediaThumb${audioClass}">${thumbHtml}</div><div class="mediaLabelRow"><span class="mediaBadge">${label}</span><span class="mediaTitle">${esc(m.name||'Datei')}</span></div></div><div class="mediaMeta"><span class="mediaName">${esc(detail)}</span></div><div class="mediaTools"><button class="mediaTool replace" type="button" title="Datei ersetzen" data-pick-media="${rowId}|${sid}">↺</button><button class="mediaTool" type="button" title="Datei entfernen" data-clear-media="${rowId}|${sid}">×</button></div></div>`;
}
function previousScreenMedia(rowId,sid){let idx=state.rows.findIndex(r=>r.id===rowId);if(idx<0)return null;for(let i=idx-1;i>=0;i--){let prev=state.rows[i];let slot=prev?.screens?.[sid];if(!prev?.isBlock&&slot?.media)return{media:slot.media,text:slot.text||slot.media.name||''}}return null}
function usePreviousScreenMedia(rowId,sid){let r=state.rows.find(x=>x.id===rowId),prev=previousScreenMedia(rowId,sid);if(!r||!prev)return;if(!r.screens)r.screens={};if(!r.screens[sid])r.screens[sid]={text:'',media:null};r.screens[sid].media=JSON.parse(JSON.stringify(prev.media));r.screens[sid].text=(r.screens[sid].text||prev.text||prev.media.name||'').trim();autoExpandMediaColumn('screen:'+sid,r.screens[sid].media,r.id);render()}
function primeVideoThumbs(){
  const loadOne=v=>{
    if(v.dataset.loaded)return;
    v.dataset.loaded='1';
    if(v.dataset.src&&!v.src)v.src=v.dataset.src;
    v.muted=true;
    v.playsInline=true;
    const seek=()=>{try{if(Number.isFinite(v.duration)&&v.duration>.3)v.currentTime=Math.min(1,v.duration*.08)}catch(e){}};
    v.addEventListener('loadedmetadata',seek,{once:true});
    try{v.load()}catch(e){}
  };
  const videos=$$('.mediaThumb video[data-src]');
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){loadOne(entry.target);io.unobserve(entry.target)}}),{root:$('#tableWrap'),rootMargin:'240px'});
    videos.forEach(v=>io.observe(v));
  }else{
    videos.slice(0,20).forEach(loadOne);
  }
}
let dragRow=null, dragCol=null;
function moveRowsByDragV100(dragId,targetId,beforeTarget){
  let from=state.rows.findIndex(r=>r.id===dragId),to=state.rows.findIndex(r=>r.id===targetId);
  if(from<0||to<0)return false;
  let end=from+1;
  if(state.rows[from]?.isBlock){while(end<state.rows.length&&!state.rows[end].isBlock)end++;}
  if(to>=from&&to<end)return false;
  let group=state.rows.splice(from,end-from);
  let newTo=state.rows.findIndex(r=>r.id===targetId);
  if(newTo<0)newTo=state.rows.length;
  if(!beforeTarget)newTo++;
  state.rows.splice(newTo,0,...group);
  return true;
}
function bindTable(){
 primeVideoThumbs();
 bindColumnDrag();
$$('#tbody tr').forEach(tr=>{tr.addEventListener('mousedown',()=>{state.activeRowId=tr.dataset.id;$$('#tbody tr').forEach(x=>x.classList.remove('activeRow'));tr.classList.add('activeRow');saveLocal(false)});tr.addEventListener('focusin',()=>{state.activeRowId=tr.dataset.id;$$('#tbody tr').forEach(x=>x.classList.remove('activeRow'));tr.classList.add('activeRow');saveLocal(false)});let grip=tr.querySelector('.grip'); if(grip){grip.addEventListener('dragstart',e=>{dragRow=tr.dataset.id;tr.classList.add('dragging');e.dataTransfer.setData('text/plain',dragRow);e.dataTransfer.effectAllowed='move'});grip.addEventListener('dragend',()=>{$$('#tbody tr').forEach(x=>x.classList.remove('dragging','dropBefore','dropAfter'));dragRow=null})}tr.addEventListener('dragover',e=>{if(!dragRow)return;e.preventDefault();let r=tr.getBoundingClientRect(),before=e.clientY<r.top+r.height/2;tr.classList.toggle('dropBefore',before);tr.classList.toggle('dropAfter',!before)});tr.addEventListener('dragleave',()=>tr.classList.remove('dropBefore','dropAfter'));tr.addEventListener('drop',e=>{if(!dragRow)return;e.preventDefault();let before=tr.classList.contains('dropBefore');if(moveRowsByDragV100(dragRow,tr.dataset.id,before))recalc(0,true)})});
 $$('[data-field]').forEach(el=>{let commit=()=>{let r=rowFrom(el),f=el.dataset.field;if(!r)return;if(f==='start'){r.start=norm(el.value);recalc(state.rows.indexOf(r),true)}else if(f==='duration'){r.duration=norm(el.value);recalc(state.rows.indexOf(r),true)}else{r[f]=el.value;saveLocal()}};el.addEventListener('blur',commit);el.addEventListener('change',commit);el.addEventListener('keydown',e=>{if(e.key==='Enter'&&el.tagName==='INPUT'){e.preventDefault();el.blur()}});if(el.classList.contains('duration')||el.dataset.field==='start'){el.addEventListener('input',()=>{let r=rowFrom(el);if(!r)return;let i=state.rows.indexOf(r);if(el.dataset.field==='start'){r.start=el.value}else{r.duration=el.value}recalc(i,false);syncTimeCells();});}if(el.classList.contains('duration'))el.addEventListener('wheel',e=>{
  if(document.activeElement!==el)return;
  e.preventDefault();
  let r=rowFrom(el); if(!r)return;
  let i=state.rows.indexOf(r);
  // Immer exakt 1 Minute pro Mausrad-Schritt; mit Shift exakt 10 Minuten.
  let step=(e.shiftKey?10:1)*60;
  let next=s2t(Math.max(0,t2s(el.value)+(e.deltaY<0?step:-step)));
  el.value=next; r.duration=norm(next);
  recalc(i,false); syncTimeCells();
},{passive:false})});
 $$('[data-color]').forEach(el=>el.addEventListener('click',e=>openColorMenu(e.currentTarget.dataset.color,e.currentTarget)));
 $$('[data-show-start]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();state.showStartRowId=b.dataset.showStart;state.activeRowId=state.showStartRowId;render()}));
 $$('.peopleCell').forEach(el=>{el.addEventListener('dragover',e=>{if(e.dataTransfer.types.includes('text/person')||e.dataTransfer.types.includes('person')){e.preventDefault();el.classList.add('over')}});el.addEventListener('dragleave',()=>el.classList.remove('over'));el.addEventListener('drop',e=>{let pid=e.dataTransfer.getData('text/person')||e.dataTransfer.getData('person');if(!pid)return;e.preventDefault();el.classList.remove('over');let r=rowFrom(el);r.people=[...(r.people||[]),pid].filter((v,i,a)=>a.indexOf(v)===i);render()})});
 $$('[data-remove-person]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();let r=rowFrom(b),pid=b.dataset.removePerson;r.people=(r.people||[]).filter(x=>x!==pid);render()}));
 $$('.mediaDrop[data-screen]').forEach(el=>{let over=e=>{if(e.dataTransfer?.types?.includes('Files')){e.preventDefault();e.stopPropagation();el.classList.add('over');e.dataTransfer.dropEffect='copy'}};let drop=async e=>{if(!e.dataTransfer?.files?.length)return;e.preventDefault();e.stopPropagation();el.classList.remove('over');let file=e.dataTransfer.files[0],kind=fileKindFromName(file);if(kind.type.startsWith('audio/')){alert('Audio bitte in die Spalte Audio / Ton legen, nicht in LED / Screen.');return}let r=rowFrom(el),sid=el.dataset.screen;if(!r.screens)r.screens={};if(!r.screens[sid])r.screens[sid]={text:'',media:null};const media=await readMedia(file);r.screens[sid].media=media;r.screens[sid].text=(el.querySelector('.mediaText')?.innerText||r.screens[sid].text||media.name).trim()||media.name;autoExpandMediaColumn('screen:'+sid,media,r.id);render()};el.addEventListener('dragenter',over,true);el.addEventListener('dragover',over,true);el.addEventListener('dragleave',e=>{e.stopPropagation();el.classList.remove('over')},true);el.addEventListener('drop',drop,true);el.querySelector('.mediaText')?.addEventListener('drop',drop,true);el.querySelector('.mediaText')?.addEventListener('dragover',over,true);el.querySelector('.mediaText')?.addEventListener('blur',()=>{let r=rowFrom(el),sid=el.dataset.screen;if(!r.screens)r.screens={};if(!r.screens[sid])r.screens[sid]={};r.screens[sid].text=el.querySelector('.mediaText').innerText;saveLocal()})});
 $$('.audioTonDrop').forEach(el=>{let over=e=>{if(e.dataTransfer?.types?.includes('Files')){e.preventDefault();e.stopPropagation();el.classList.add('over');e.dataTransfer.dropEffect='copy'}};let drop=async e=>{if(!e.dataTransfer?.files?.length)return;e.preventDefault();e.stopPropagation();el.classList.remove('over');let file=e.dataTransfer.files[0],kind=fileKindFromName(file);if(!kind.type.startsWith('audio/')){alert('In Audio / Ton bitte MP3, WAV oder eine Audiodatei verwenden.');return}let r=rowFrom(el);if(!r)return;const media=await readMedia(file);r.soundMedia=media;r.sound=(el.querySelector('[data-audio-text]')?.innerText||r.sound||media.name).trim()||media.name;autoExpandMediaColumn('sound',media,r.id);render()};el.addEventListener('dragenter',over,true);el.addEventListener('dragover',over,true);el.addEventListener('dragleave',e=>{e.stopPropagation();el.classList.remove('over')},true);el.addEventListener('drop',drop,true);el.querySelector('[data-audio-text]')?.addEventListener('drop',drop,true);el.querySelector('[data-audio-text]')?.addEventListener('dragover',over,true);el.querySelector('[data-audio-text]')?.addEventListener('blur',()=>{let r=rowFrom(el);if(!r)return;r.sound=el.querySelector('[data-audio-text]').innerText;saveLocal()})});
 $$('[data-use-previous-media]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();let [rid,sid]=b.dataset.usePreviousMedia.split('|');usePreviousScreenMedia(rid,sid)}));
 $$('[data-pick-media]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();let inp=$$('[data-media-file]').find(x=>x.dataset.mediaFile===b.dataset.pickMedia);if(inp)inp.click()}));
 $$('[data-media-file]').forEach(inp=>inp.addEventListener('change',async()=>{let file=inp.files&&inp.files[0];if(!file)return;let [rid,sid]=inp.dataset.mediaFile.split('|');let r=state.rows.find(x=>x.id===rid);if(!r)return;let kind=fileKindFromName(file);if(sid==='sound'){if(!kind.type.startsWith('audio/')){alert('In Audio / Ton bitte MP3, WAV oder eine Audiodatei verwenden.');inp.value='';return}const media=await readMedia(file);r.soundMedia=media;r.sound=(r.sound||media.name).trim()||media.name;autoExpandMediaColumn('sound',media,r.id);inp.value='';render();return}if(kind.type.startsWith('audio/')){alert('Audio bitte in die Spalte Audio / Ton legen, nicht in LED / Screen.');inp.value='';return}if(!r.screens)r.screens={};if(!r.screens[sid])r.screens[sid]={text:'',media:null};const media=await readMedia(file);r.screens[sid].media=media;r.screens[sid].text=(r.screens[sid].text||media.name).trim()||media.name;autoExpandMediaColumn('screen:'+sid,media,r.id);inp.value='';render()}));
 $$('[data-clear-media]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();let [rid,sid]=b.dataset.clearMedia.split('|');let r=state.rows.find(x=>x.id===rid);if(!r)return;if(sid==='sound'){let old=r.soundMedia;if(old?.mediaKey)deleteMediaBlob(old.mediaKey);if(old?.url)URL.revokeObjectURL(old.url);r.soundMedia=null;render();return}if(!r.screens||!r.screens[sid])return;let old=r.screens[sid].media;if(old?.mediaKey)deleteMediaBlob(old.mediaKey);if(old?.url)URL.revokeObjectURL(old.url);r.screens[sid].media=null;render()}));
 $$('[data-open-media]').forEach(p=>p.addEventListener('click',e=>{if(e.target.closest('[data-clear-media]'))return;let [rid,sid]=p.dataset.openMedia.split('|');let r=state.rows.find(x=>x.id===rid);let m=sid==='sound'?r?.soundMedia:r?.screens?.[sid]?.media;if(m)openMediaModal(m,rid,sid)}));
 $$('[data-delete-row]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();let id=b.dataset.deleteRow;let r=state.rows.find(x=>x.id===id);if(!r)return;if(!confirm((r.isBlock?'Trenner':'Zeile')+' wirklich löschen?'))return;state.rows=state.rows.filter(x=>x.id!==id);if(state.activeRowId===id)state.activeRowId=null;if(state.showStartRowId===id)state.showStartRowId=null;recalc(0,true)}));
 $$('[data-toggle-row-muted]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();let r=state.rows.find(x=>x.id===b.dataset.toggleRowMuted);if(!r)return;r.muted=!r.muted;render()}));
 function beginRowResize(id,startY,handle){
   const r=state.rows.find(x=>x.id===id); if(!r)return;
   state.activeRowId=id;
   const startH=rowHeight(r);
   if(handle)handle.classList.add('active'); document.body.classList.add('resizingRow');
   let raf=0,lastH=startH;
   const apply=()=>{raf=0;setRowHeight(id,lastH,false);const tr=document.querySelector(`#tbody tr[data-id="${CSS.escape(id)}"]`);if(tr)tr.style.setProperty('--row-h',`calc(${rowHeight(r)}px * var(--zoom))`)};
   const move=ev=>{lastH=startH+(ev.clientY-startY)/Math.max(state.zoom||1,.01);if(!raf)raf=requestAnimationFrame(apply)};
   const up=()=>{if(raf){cancelAnimationFrame(raf);apply()}if(handle)handle.classList.remove('active');document.body.classList.remove('resizingRow');window.removeEventListener('mousemove',move);window.removeEventListener('mouseup',up);saveLocal(false)};
   window.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
 }
 $$('.rowResize').forEach(handle=>{
   handle.addEventListener('mousedown',e=>{
     e.preventDefault();e.stopPropagation();
     beginRowResize(handle.dataset.resizeRow,e.clientY,handle);
   });
 });
 const tbody=$('#tbody');
 if(false&&tbody){
   tbody.addEventListener('mousemove',e=>{
     const td=e.target.closest('td'); $$('#tbody td.rowResizeHover').forEach(x=>{if(x!==td)x.classList.remove('rowResizeHover')});
     if(!td||document.body.classList.contains('resizingRow'))return;
     const r=td.getBoundingClientRect(); td.classList.toggle('rowResizeHover',e.clientY>r.bottom-9);
   });
   tbody.addEventListener('mouseleave',()=>$$('#tbody td.rowResizeHover').forEach(x=>x.classList.remove('rowResizeHover')));
   tbody.addEventListener('mousedown',e=>{
     if(e.target.closest('.rowResize,.grip,.colResize'))return;
     const td=e.target.closest('td'); if(!td)return; const rect=td.getBoundingClientRect();
     if(e.clientY<=rect.bottom-9)return;
     e.preventDefault();e.stopPropagation();
     const tr=td.closest('tr'); if(tr?.dataset.id)beginRowResize(tr.dataset.id,e.clientY,null);
   });
 }
}


function deleteColumn(id){
  if(!id)return;
  if(id.startsWith('screen:')){
    let sid=id.split(':')[1];
    let sc=state.screens.find(s=>s.id===sid);
    if(!sc)return;
    if(!confirm(`Screen-Spalte „${sc.name}“ löschen?`))return;
    state.screens=state.screens.filter(s=>s.id!==sid);
    state.rows.forEach(r=>{if(r.screens)delete r.screens[sid]});
    if(state.colWidths)delete state.colWidths[id];
  }else{
    let col=state.cols.find(c=>c.id===id);
    if(!col||col.fixed)return;
    // Basis-Spalten werden nur ausgeblendet, freie Spalten komplett gelöscht.
    let isBase=baseCols.some(b=>b.id===id);
    if(isBase){col.show=false;}else{
      if(!confirm(`Spalte „${col.name||id}“ löschen?`))return;
      state.cols=state.cols.filter(c=>c.id!==id);
      state.rows.forEach(r=>{delete r[id]});
    }
    if(state.colWidths)delete state.colWidths[id];
  }
  if(Array.isArray(state.columnOrder))state.columnOrder=state.columnOrder.filter(x=>x!==id);
  render();
}

function bindColumnResize(){
  $$('.colResize').forEach(handle=>{
    handle.addEventListener('mousedown',e=>{
      e.preventDefault();e.stopPropagation();
      const id=handle.dataset.resizeCol;
      const th=handle.closest('th');
      const colIndex=Array.from(th.parentElement.children).indexOf(th);
      const startX=e.clientX;
      const startW=(th.getBoundingClientRect().width/Math.max(state.zoom||1,0.01));
      handle.classList.add('active');document.body.classList.add('resizingCol');
      let raf=0,lastW=startW;
      const apply=()=>{raf=0;setColWidth(id,lastW,false);const style=colStyle({id,type:id.startsWith('screen:')?'screen':'text'});th.style.cssText=style;$$('#tbody tr').forEach(tr=>{const td=tr.children[colIndex];if(td)td.style.cssText=style+(td.style.cssText.includes('--row-h')?'': '')})};
      const move=ev=>{const delta=(ev.clientX-startX)/Math.max(state.zoom||1,0.01);lastW=startW+delta;if(!raf)raf=requestAnimationFrame(apply)};
      const up=()=>{if(raf){cancelAnimationFrame(raf);apply()}document.body.classList.remove('resizingCol');window.removeEventListener('mousemove',move);window.removeEventListener('mouseup',up);saveLocal(false)};
      window.addEventListener('mousemove',move);window.addEventListener('mouseup',up,{once:true});
    });
    handle.addEventListener('dragstart',e=>e.preventDefault());
  });
}
function bindColumnDrag(){
 bindColumnResize();
 $$('.colDelete').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();deleteColumn(b.dataset.deleteCol)}));
 $$('#thead th[data-colhead]').forEach(th=>{
  th.addEventListener('dragstart',e=>{if(e.target.closest('.colResize,.colDelete')){e.preventDefault();return;}dragCol=th.dataset.colhead;th.classList.add('colDragging');e.dataTransfer.setData('text/column',dragCol);e.dataTransfer.effectAllowed='move'});
  th.addEventListener('dragend',()=>{$$('#thead th').forEach(x=>x.classList.remove('colDragging','colDropBefore','colDropAfter'));dragCol=null});
  th.addEventListener('dragover',e=>{if(!dragCol)return;e.preventDefault();let r=th.getBoundingClientRect(),before=e.clientX<r.left+r.width/2;th.classList.toggle('colDropBefore',before);th.classList.toggle('colDropAfter',!before)});
  th.addEventListener('dragleave',()=>th.classList.remove('colDropBefore','colDropAfter'));
  th.addEventListener('drop',e=>{if(!dragCol)return;e.preventDefault();let target=th.dataset.colhead;if(target===dragCol)return;ensureColumnOrder();let from=state.columnOrder.indexOf(dragCol),to=state.columnOrder.indexOf(target);if(from<0||to<0)return;let [moved]=state.columnOrder.splice(from,1);let newTo=state.columnOrder.indexOf(target);state.columnOrder.splice(th.classList.contains('colDropAfter')?newTo+1:newTo,0,moved);render()});
 });
}
function rowFrom(el){return state.rows.find(r=>r.id===el.closest('tr')?.dataset.id)}

function syncTimeCells(){
  $$('#tbody tr').forEach(tr=>{
    let r=state.rows.find(x=>x.id===tr.dataset.id); if(!r)return;
    let st=tr.querySelector('[data-field="start"]'); if(st)st.value=r.start;
    let du=tr.querySelector('[data-field="duration"]'); if(du&&document.activeElement!==du)du.value=r.duration;
    let en=tr.querySelector('[data-end]'); if(en)en.value=r.end;
  });
  saveLocal(false);
}
function recalc(start=0,rerender=true){let current=null;for(let j=0;j<state.rows.length;j++){let rr=state.rows[j];if(rr.isBlock)continue;if(j<start){rr.start=norm(rr.start);rr.duration=norm(rr.duration);rr.end=s2t(t2s(rr.start)+t2s(rr.duration));current=rr.end;continue}break}for(let i=start;i<state.rows.length;i++){let r=state.rows[i];if(r.isBlock){r.start='';r.duration='00:00:00';r.end='';continue}if(current&&i>start)r.start=current;else r.start=norm(r.start||current||'09:00:00');r.duration=norm(r.duration);r.end=s2t(t2s(r.start)+t2s(r.duration));current=r.end}if(rerender)render();else saveLocal(false)}
function addRow(block=false){let insertAt=currentInsertIndex();let prev=[...state.rows.slice(0,insertAt)].reverse().find(r=>!r.isBlock),start=prev?prev.end:'09:00:00';let r={id:uid(),isBlock:block,preset:block?'lime':'neutral',start:block?'':start,duration:block?'00:00:00':'00:05:00',end:'',what:block?'NEUER ABSCHNITT':'Neue Regiezeile',people:[],detail:'',light:'',sound:'',camera:'',screens:{}};state.screens.forEach(s=>r.screens[s.id]={text:'',media:null});state.cols.forEach(c=>{if(c.id.startsWith('col_')||(!baseCols.find(b=>b.id===c.id)))r[c.id]=''});state.rows.splice(insertAt,0,r);state.activeRowId=r.id;recalc(insertAt,true);setTimeout(()=>{let tr=document.querySelector(`#tbody tr[data-id="${CSS.escape(r.id)}"]`);tr?.scrollIntoView({block:'center',inline:'nearest'});},0)}
let regiePreviewIndex=0;
function mediaSourceUrl(m){return m?.remoteUrl||m?.url||m?.data||''}
function normalizeMediaKey(m){return String(mediaSourceUrl(m)||m?.name||'').toLowerCase().replace(/[?#].*$/,'').trim()}
function regieVideoItems(){
  const items=[],screenIds=(state.screens||[]).map(s=>s.id);
  let last='';
  (state.rows||[]).forEach((r,rowIndex)=>{
    if(r.isBlock)return;
    for(const sid of screenIds){
      const m=r.screens?.[sid]?.media;
      if(!m||!(m.type||'').startsWith('video/'))continue;
      const key=normalizeMediaKey(m);
      if(!key||key===last)continue;
      last=key;
      items.push({rowId:r.id,rowIndex,name:m.name||'Video',url:mediaSourceUrl(m),screen:sid,start:r.start||'',what:r.what||'',key,loop:!!(m.isLoop||m.loop)});
      break;
    }
  });
  return items;
}
function playRegiePreview(index){
  const items=regieVideoItems(),video=$('#regiePreviewVideo'),now=$('#regiePreviewNow');
  if(!video||!items.length)return;
  regiePreviewIndex=Math.max(0,Math.min(items.length-1,Number(index)||0));
  const item=items[regiePreviewIndex];
  if(video.src!==item.url)video.src=item.url;
  video.loop=!!item.loop;
  video.play().catch(()=>{});
  if(now)now.textContent=(item.start?item.start+' - ':'')+item.name;
  renderRegiePreviewList(items);
}
function toggleRegiePreview(index){
  const video=$('#regiePreviewVideo');
  if(!video)return;
  if(Number(index)!==regiePreviewIndex||!video.src){playRegiePreview(index);return}
  if(video.paused)video.play().catch(()=>{});else video.pause();
  renderRegiePreviewList();
}
function renderRegiePreviewList(existing=null){
  const box=$('#regiePreviewList'),video=$('#regiePreviewVideo'),now=$('#regiePreviewNow');
  if(!box)return;
  const items=existing||regieVideoItems();
  if(!items.length){box.innerHTML='<div class="help">Keine Videos im Regieplan gefunden.</div>';if(now)now.textContent='Noch kein Video ausgewaehlt.';return}
  if(regiePreviewIndex>=items.length)regiePreviewIndex=0;
  box.innerHTML=items.map((item,i)=>`<div class="regiePreviewItem ${i===regiePreviewIndex?'active':''}"><div><b>${esc(item.name)}</b><span>${esc((item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||''))}</span></div><button class="regiePreviewBtn" type="button" title="Play/Pause" data-regie-preview-play="${i}">${i===regiePreviewIndex&&video&&!video.paused?'II':'▶'}</button><a class="regiePreviewBtn" title="Link oeffnen" href="${esc(item.url)}" target="_blank" rel="noopener">↗</a></div>`).join('');
  $$('[data-regie-preview-play]').forEach(b=>b.addEventListener('click',()=>toggleRegiePreview(b.dataset.regiePreviewPlay)));
}
function renderSide(){
  $('#statBox').innerHTML=`<div class="statLine"><span>Zeilen</span><b>${state.rows.filter(r=>!r.isBlock).length}</b></div><div class="statLine"><span>Screens</span><b>${state.screens.length}</b></div><div class="statLine"><span>Menschen</span><b>${state.people.length}</b></div><div class="statLine marker"><span>Show-Start</span><b>${showStartText()}</b></div><div class="statLine"><span>Gesamtlänge</span><b>${totalDurationText()}</b></div>`;
  $('#peopleList').innerHTML=state.people.map(p=>`<div class="person" draggable="true" data-person="${p.id}">${p.img?`<img src="${p.img}">`:''}<b>${esc(p.name)}</b><span>${esc(p.role||'')}</span><button data-del-person="${p.id}">X</button></div>`).join('')||'<div class="help">Noch keine Menschen angelegt.</div>';
  $$('[data-person]').forEach(el=>el.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/person',el.dataset.person);e.dataTransfer.setData('person',el.dataset.person)}));
  $$('[data-del-person]').forEach(b=>b.addEventListener('click',()=>{state.people=state.people.filter(p=>p.id!==b.dataset.delPerson);state.rows.forEach(r=>r.people=(r.people||[]).filter(id=>id!==b.dataset.delPerson));render()}));
  $('#screenList').innerHTML=state.screens.map(s=>`<div class="item"><b>${esc(s.name)}</b><span>${esc(s.res)}</span></div>`).join('');
  const tplCols=[['responsible','Verantwortlich'],['moderation','Moderation'],['standby','Stand-by'],['mic','Mikro'],['playback','Zuspielung'],['graphics','Grafik / BB'],['position','Position'],['props','Requisite'],['catering','Catering'],['security','Sicherheit'],['status','Status'],['notes','Notizen'],['prompt','Prompt']];
  $('#columnTemplates').innerHTML=tplCols.map(([id,name])=>`<button class="chipBtn" data-template-col="${id}|${name}">+ ${esc(name)}</button>`).join('');
  $$('[data-template-col]').forEach(b=>b.addEventListener('click',()=>{let [id,name]=b.dataset.templateCol.split('|');addTemplateColumn(id,name)}));
  $('#columnList').innerHTML=state.cols.filter(c=>c.id!=='handle'&&c.id!=='cue').map(c=>`<label class="colToggle"><input type="checkbox" ${c.show?'checked':''} data-toggle-col="${c.id}"> ${esc(c.name)}</label>`).join('');
  $$('[data-toggle-col]').forEach(i=>i.addEventListener('change',()=>{let c=state.cols.find(c=>c.id===i.dataset.toggleCol);if(c)c.show=i.checked;render()}));
  renderRegiePreviewList();
  renderColorControls();
}
const palette=[['Violett','#b85cff','#f3d8ff'],['Blau','#4fb6ff','#dff2ff'],['Grün','#4ee27b','#dcfbe5'],['Orange','#ff9e24','#ffe7bd'],['Rot','#ff5e66','#ffd8d8'],['Gelb','#ffe35a','#fff8bd'],['Lime','#c9ff19','#efffc2']];
let selectedPresetId='neutral';
function renderColorControls(){
  const selected=preset(selectedPresetId);
  $('#colorQuick').innerHTML=palette.map(([n,d,l])=>`<button class="quickSwatch" title="${n} auf ${esc(selected?.name||'Preset')} anwenden" data-quick-color="${d}|${l}" style="background:${d}"></button>`).join('');
  $$('[data-quick-color]').forEach(b=>b.addEventListener('click',()=>{let p=preset(selectedPresetId); if(!p)return; let [d,l]=b.dataset.quickColor.split('|'); p.dark=d; p.light=l; render()}));
  let box=$('#presetList');
  box.innerHTML=state.presets.map(p=>{
    let dark=p.dark||'#111111', light=p.light||'#ffffff';
    let sel=p.id===selectedPresetId?' style="outline:2px solid var(--lime);outline-offset:2px"':'';
    return `<div class="presetCard" data-pre="${p.id}"${sel}>
      <div class="presetNameRow">
        <input type="text" value="${esc(p.name)}" data-preset-name="${p.id}" aria-label="Preset Name">
      </div>
      <div class="presetPreviewPair">
        <button class="presetPreviewMini" data-select-preset="${p.id}" style="background:${dark};color:${contrast(dark)}">D</button>
        <button class="presetPreviewMini" data-select-preset="${p.id}" style="background:${light};color:${contrast(light)}">L</button>
      </div>
      <div class="colorDots">${palette.map(([n,d,l])=>`<button class="colorDot" title="${n}" data-dot="${p.id}|${d}|${l}" style="background:${d}"></button>`).join('')}</div>
      <div class="presetAdvanced">
        <label class="colorEdit">D <input type="color" value="${dark}" data-preset-dark="${p.id}"></label>
        <label class="colorEdit">L <input type="color" value="${light}" data-preset-light="${p.id}"></label>
        ${p.id==='neutral'?'':`<button class="presetDelete" data-del-preset="${p.id}">löschen</button>`}
      </div>
    </div>`
  }).join('');
  $$('[data-select-preset]').forEach(b=>b.addEventListener('click',()=>{selectedPresetId=b.dataset.selectPreset; renderSide()}));
  $$('[data-pre]').forEach(card=>card.addEventListener('click',e=>{ if(e.target.closest('input,button'))return; selectedPresetId=card.dataset.pre; renderSide(); }));
  $$('[data-preset-name]').forEach(i=>i.addEventListener('change',()=>{preset(i.dataset.presetName).name=i.value;render()}));
  $$('[data-preset-dark]').forEach(i=>i.addEventListener('change',()=>{preset(i.dataset.presetDark).dark=i.value;render()}));
  $$('[data-preset-light]').forEach(i=>i.addEventListener('change',()=>{preset(i.dataset.presetLight).light=i.value;render()}));
  $$('[data-dot]').forEach(b=>b.addEventListener('click',()=>{let [id,d,l]=b.dataset.dot.split('|');let p=preset(id);p.dark=d;p.light=l;selectedPresetId=id;render()}));
  $$('[data-del-preset]').forEach(b=>b.addEventListener('click',()=>{state.presets=state.presets.filter(p=>p.id!==b.dataset.delPreset);state.rows.forEach(r=>{if(r.preset===b.dataset.delPreset)r.preset='neutral'});selectedPresetId='neutral';render()}));
}
function openColorMenu(rowId,anchor){let m=$('#colorMenu');let r=state.rows.find(x=>x.id===rowId);m.innerHTML=state.presets.map(p=>{let oldTheme=state.theme, c=colorsFor(p);return `<div class="colorChoice" data-choose="${p.id}" style="background:${c.bg};color:${c.tx}"><span>${esc(p.name)}</span><span>✓</span></div>`}).join('');let rect=anchor.getBoundingClientRect();m.style.left=Math.min(rect.left,window.innerWidth-245)+'px';m.style.top=Math.min(rect.bottom+6,window.innerHeight-300)+'px';m.classList.add('show');$$('[data-choose]').forEach(x=>x.onclick=()=>{r.preset=x.dataset.choose;m.classList.remove('show');render()})}
window.addEventListener('click',e=>{if(!e.target.closest('#colorMenu')&&!e.target.closest('[data-color]'))$('#colorMenu').classList.remove('show')});
const MEDIA_DB_NAME='regieplan_media_v32';
const MEDIA_STORE='files';
let mediaDbPromise=null;
function openMediaDb(){
  if(!('indexedDB' in window))return Promise.resolve(null);
  if(mediaDbPromise)return mediaDbPromise;
  mediaDbPromise=new Promise(resolve=>{
    const req=indexedDB.open(MEDIA_DB_NAME,1);
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(MEDIA_STORE))db.createObjectStore(MEDIA_STORE,{keyPath:'key'});};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>resolve(null);
  });
  return mediaDbPromise;
}
async function putMediaBlob(key,file){
  const db=await openMediaDb(); if(!db)return false;
  return new Promise(resolve=>{
    const tx=db.transaction(MEDIA_STORE,'readwrite');
    tx.objectStore(MEDIA_STORE).put({key,blob:file,name:file.name,type:file.type||'',size:file.size||0,ts:Date.now()});
    tx.oncomplete=()=>resolve(true); tx.onerror=()=>resolve(false);
  });
}
async function getMediaBlob(key){
  const db=await openMediaDb(); if(!db||!key)return null;
  return new Promise(resolve=>{
    const tx=db.transaction(MEDIA_STORE,'readonly');
    const req=tx.objectStore(MEDIA_STORE).get(key);
    req.onsuccess=()=>resolve(req.result||null); req.onerror=()=>resolve(null);
  });
}
async function deleteMediaBlob(key){
  const db=await openMediaDb(); if(!db||!key)return;
  try{db.transaction(MEDIA_STORE,'readwrite').objectStore(MEDIA_STORE).delete(key)}catch(e){}
}
function makeMediaKey(file){return 'media_'+Date.now().toString(36)+'_'+uid()+'_'+String(file.name||'file').replace(/[^a-z0-9._-]+/gi,'_').slice(-80)}
async function hydrateMediaSource(m){
  if(!m)return'';
  if(m.remoteUrl||m.url||m.data)return m.remoteUrl||m.url||m.data;
  if(m.mediaKey){
    const stored=await getMediaBlob(m.mediaKey);
    if(stored?.blob){m.url=URL.createObjectURL(stored.blob);m.type=m.type||stored.type||'';m.name=m.name||stored.name||'';return m.url;}
  }
  if((m.type||'').startsWith('audio/')&&m.name)return encodeURI(m.name);
  return'';
}
function pickMediaFor(rowId,sid){
  if(!rowId||!sid)return;
  const inp=$$('[data-media-file]').find(x=>x.dataset.mediaFile===rowId+'|'+sid);
  if(inp)inp.click();
}
function makeVideoThumb(src){return new Promise(resolve=>{try{const video=document.createElement('video');video.preload='metadata';video.muted=true;video.playsInline=true;video.src=src;let done=false;const finish=(val)=>{if(done)return;done=true;resolve(val)};video.addEventListener('loadeddata',()=>{const target=Math.min(Math.max(video.duration?Math.min(1,video.duration/3):0.1,0.1),2);try{video.currentTime=target}catch(e){finish('')}});video.addEventListener('seeked',()=>{try{const w=240,h=135;const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.drawImage(video,0,0,w,h);finish(canvas.toDataURL('image/jpeg',0.78))}catch(e){finish('')}});video.addEventListener('error',()=>finish(''));setTimeout(()=>finish(''),2200)}catch(e){resolve('')}})}
function fileKindFromName(file){
  const ext=(file.name||'').split('.').pop().toLowerCase();
  let type=file.type||'';
  if(!type){
    if(['mp3','wav','wave','m4a','aac','ogg','flac'].includes(ext)) type=ext==='mp3'?'audio/mpeg':(ext==='wav'||ext==='wave'?'audio/wav':'audio/'+ext);
    else if(['mp4','mov','m4v','webm'].includes(ext)) type=ext==='mov'?'video/quicktime':'video/'+ext;
    else if(['jpg','jpeg','png','gif','webp'].includes(ext)) type=ext==='jpg'?'image/jpeg':'image/'+ext;
    else type='file';
  }
  return {ext,type};
}
async function readMedia(file){
  const kind=fileKindFromName(file); const type=kind.type;
  if(type.startsWith('video/')||type.startsWith('audio/')){
    const url=URL.createObjectURL(file);
    const mediaKey=makeMediaKey(file);
    await putMediaBlob(mediaKey,file);
    const thumb=type.startsWith('video/') ? (await makeVideoThumb(url) || placeholderThumb('VIDEO')) : placeholderThumb((kind.ext||'AUDIO').toUpperCase(),'#101415','#070909','#ffffff');
    return {name:file.name,type,url,thumb,mediaKey,localOnly:true,size:file.size||0};
  }
  return new Promise(resolve=>{let fr=new FileReader();fr.onload=()=>{const data=fr.result;let media={name:file.name,type,data,thumb:''};if(type.startsWith('image/'))media.thumb=data;else media.thumb=placeholderThumb('FILE','#101415','#070909','#ffffff');resolve(media)};fr.readAsDataURL(file)});
}

async function openMediaModal(m,rowId=null,sid=null){
  let modal=$('#mediaModal'),body=$('#mediaModalBody'),title=$('#mediaModalTitle');if(!modal||!body)return;
  title.textContent=m.name||'';
  let type=m.type||'',src=await hydrateMediaSource(m);
  if(!src&&(type.startsWith('video/')||type.startsWith('audio/'))){
    body.innerHTML=`<div class="mediaModalMissing"><b>${esc(m.name||'Mediendatei')}</b><div>Die Mediendatei wurde in diesem Browser noch nicht gefunden. Wähle sie einmal neu aus; danach bleibt sie lokal im Browser gespeichert und ist nach Neuladen wieder abspielbar.</div><div class="mediaModalActions"><button class="btn primary" id="modalRelinkMedia">Datei wählen</button><button class="btn" id="modalCloseHint">Schließen</button></div></div>`;
    setTimeout(()=>{let rb=$('#modalRelinkMedia');if(rb)rb.onclick=()=>pickMediaFor(rowId,sid);let cb=$('#modalCloseHint');if(cb)cb.onclick=()=>closeMediaModal();},0)
  }else if(type.startsWith('video/'))body.innerHTML=`<video src="${src}" controls autoplay playsinline></video>`;
  else if(type.startsWith('image/'))body.innerHTML=`<img src="${src}" alt="${esc(m.name)}">`;
  else if(type.startsWith('audio/'))body.innerHTML=`<audio src="${src}" controls autoplay></audio>`;
  else body.innerHTML=`<div class="help">${esc(m.name||'Datei')}</div>`;
  modal.classList.add('show')
}
function closeMediaModal(){let modal=$('#mediaModal'),body=$('#mediaModalBody');if(body)body.innerHTML='';if(modal)modal.classList.remove('show')}

function mergeBaseColumns(){let existing=new Map((state.cols||[]).map(c=>[c.id,c]));baseCols.forEach(b=>{if(!existing.has(b.id)){state.cols.push(JSON.parse(JSON.stringify(b)));}else{let c=existing.get(b.id);c.name=c.name||b.name;c.type=c.type||b.type;c.fixed=c.fixed||b.fixed;if(typeof c.show==='undefined')c.show=!!b.show;}})}
function addTemplateColumn(id,name){let c=state.cols.find(x=>x.id===id);if(c){c.show=true;}else{state.cols.push({id,name,show:true,type:'text'});state.rows.forEach(r=>r[id]='');}ensureColumnOrder();if(!state.columnOrder.includes(id))state.columnOrder.push(id);render()}
function exportableState(){
  const copy=JSON.parse(JSON.stringify(state));
  (copy.rows||[]).forEach(r=>{Object.values(r.screens||{}).forEach(s=>{if(s.media){if(s.media.remoteUrl)s.media.url=s.media.remoteUrl;else delete s.media.url;if((s.media.type||'').startsWith('video/')||(s.media.type||'').startsWith('audio/'))delete s.media.data;}});if(r.soundMedia){if(r.soundMedia.remoteUrl)r.soundMedia.url=r.soundMedia.remoteUrl;else delete r.soundMedia.url;if((r.soundMedia.type||'').startsWith('audio/'))delete r.soundMedia.data;}});
  return copy;
}
function setServerStatus(text){let el=$('#serverStatus');if(el)el.textContent=text||''}
function safeProjectName(){return (state.projectName||'Regieplan').replace(/[^a-z0-9äöüß_-]+/gi,'_')}
async function serverFetch(path,options={}){
  const res=await fetch(path,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
  if(!res.ok){let msg='HTTP '+res.status;try{let data=await res.json();if(data.error)msg=data.error}catch(e){}throw new Error(msg)}
  return res.json();
}
const DEFAULT_PROJECT_FILE='20260617v1_LV_Regieplan_GREEN_FUTURE.json';
async function fetchJsonFile(path){
  const res=await fetch(path,{cache:'no-store'});
  if(!res.ok)throw new Error('HTTP '+res.status);
  return res.json();
}
async function saveServerVersion(){
  try{
    bumpVersion();syncVersionField();
    const body={projectName:state.projectName||'Regieplan',version:versionText(),filename:`${versionText()}_${safeProjectName()}.json`,state:exportableState()};
    const saved=await serverFetch('/api/versions',{method:'POST',body:JSON.stringify(body)});
    setServerStatus('Gespeichert: '+saved.filename);
    await loadServerVersions();
    render();
  }catch(err){console.error(err);setServerStatus('Server-Speichern fehlgeschlagen: '+err.message);alert('Server-Speichern fehlgeschlagen: '+err.message)}
}
async function loadServerVersions(){
  try{
    const data=await serverFetch('/api/versions');
    const box=$('#versionList'); if(!box)return;
    box.innerHTML=(data.versions||[]).map(v=>`<div class="versionItem"><div><b>${esc(v.filename)}</b><span>${esc(v.projectName||'Regieplan')} · ${esc(v.version||'')} · ${new Date(v.savedAt||v.mtime).toLocaleString('de-AT')}</span></div><button class="mini" data-load-version="${esc(v.id)}">Laden</button></div>`).join('')||'<div class="help">Noch keine Server-Versionen gespeichert.</div>';
    $$('[data-load-version]').forEach(b=>b.addEventListener('click',()=>loadServerVersion(b.dataset.loadVersion)));
    setServerStatus('Server bereit. '+(data.versions||[]).length+' Version(en).');
  }catch(err){console.warn(err);setServerStatus('Kein Server erreichbar. Lokal funktioniert die App weiter.')}
}
async function loadServerVersion(id){
  if(!id)return;
  try{
    const data=await serverFetch('/api/versions/'+encodeURIComponent(id));
    state=data.state||data;
    saveLocal();
    render();
    setServerStatus('Geladen: '+(data.filename||id));
  }catch(err){console.error(err);setServerStatus('Laden fehlgeschlagen: '+err.message);alert('Laden fehlgeschlagen: '+err.message)}
}
let playerClips=[];
function setPlayerStatus(text){let el=$('#playerStatus');if(el)el.textContent=text||''}
function currentTargetRow(){
  let r=state.rows.find(x=>x.id===state.activeRowId&&!x.isBlock);
  return r||state.rows.find(x=>!x.isBlock)||null;
}
function playerClipMedia(clip){
  return {
    name:clip.name||'Player-Video',
    type:clip.mime||'video/mp4',
    url:clip.url,
    remoteUrl:clip.url,
    thumb:clip.thumbnail||'',
    remote:true,
    isLoop:!!clip.isLoop,
    loop:!!clip.isLoop,
    relativePath:clip.relativePath||'',
    source:'player-playlist'
  };
}
function insertPlayerClip(index){
  const clip=playerClips[Number(index)];
  const row=currentTargetRow();
  const screen=state.screens&&state.screens[0];
  if(!clip||!row||!screen){alert('Bitte zuerst eine Regiezeile und eine Screen-Spalte anlegen.');return}
  if(!row.screens)row.screens={};
  if(!row.screens[screen.id])row.screens[screen.id]={text:'',media:null};
  const media=playerClipMedia(clip);
  row.screens[screen.id].media=media;
  row.screens[screen.id].text=(row.screens[screen.id].text||clip.name||media.name).trim();
  state.activeRowId=row.id;
  autoExpandMediaColumn('screen:'+screen.id,media,row.id);
  render();
  setPlayerStatus('Eingefuegt in aktive Zeile: '+media.name);
}
async function loadPlayerClips(){
  try{
    const data=await serverFetch('/api/player-playlist');
    playerClips=data.clips||[];
    const box=$('#playerClipList'); if(!box)return;
    box.innerHTML=playerClips.map((clip,i)=>`<div class="clipItem"><div><b>${esc(clip.name)}</b><span>${esc(clip.relativePath||clip.url)}${clip.isLoop?' · LOOP':''}</span></div><button class="mini" data-insert-player-clip="${i}">Einfügen</button></div>`).join('')||'<div class="help">Keine Videos in der Player-Playlist gefunden.</div>';
    $$('[data-insert-player-clip]').forEach(b=>b.addEventListener('click',()=>insertPlayerClip(b.dataset.insertPlayerClip)));
    setPlayerStatus(`${playerClips.length} Player-Video(s) geladen.`);
  }catch(err){console.warn(err);setPlayerStatus('Player-Playlist nicht erreichbar: '+err.message)}
}
function hasStoredLocalProject(){
  const keys=['regieplan_webapp_v36','regieplan_webapp_v35','regieplan_webapp_v34','regieplan_webapp_v33','regieplan_webapp_v32','regieplan_webapp_v31','regieplan_webapp_v30','regieplan_webapp_v29','regieplan_webapp_v28','regieplan_webapp_v27','regieplan_webapp_v26','regieplan_webapp_v25','regieplan_webapp_v24','regieplan_webapp_v23','regieplan_webapp_v22','regieplan_webapp_v21','regieplan_webapp_v20','regieplan_webapp_v19','regieplan_webapp_v18','regieplan_webapp_v17','regieplan_webapp_v16','regieplan_webapp_v15','regieplan_webapp_v14','regieplan_webapp_v13','regieplan_webapp_v12','regieplan_webapp_v11','regieplan_webapp_v10','regieplan_webapp_v9','regieplan_webapp_v8','regieplanV7'];
  try{return keys.some(k=>localStorage.getItem(k))}catch(e){return false}
}
async function loadDefaultProjectFromServer(force=true){
  if(!force&&hasStoredLocalProject())return;
  if(new URLSearchParams(location.search).get('local')==='1')return;
  let source='/api/default-project';
  try{
    let data;
    try{
      data=await serverFetch('/api/default-project');
    }catch(apiErr){
      source=DEFAULT_PROJECT_FILE;
      data=await fetchJsonFile(DEFAULT_PROJECT_FILE);
    }
    state=data.state||data;
    render();
    setServerStatus('Standard-Projekt geladen aus '+source+': '+(state.projectName||'Regieplan'));
  }catch(err){console.warn('Kein Standard-Projekt vom Server geladen',err);setServerStatus('Standard-Projekt nicht geladen: '+err.message)}
}
function saveLocal(){try{localStorage.setItem('regieplan_webapp_v36',JSON.stringify(exportableState()))}catch(e){console.warn('Lokales Speichern reduziert wegen Speicherlimit',e);try{let lite=exportableState();lite.rows?.forEach(r=>{Object.values(r.screens||{}).forEach(s=>{if(s.media){s.media.data=undefined;s.media.url=undefined;if((s.media.thumb||'').length>300000)s.media.thumb=''}});if(r.soundMedia){r.soundMedia.data=undefined;r.soundMedia.url=undefined;if((r.soundMedia.thumb||'').length>300000)r.soundMedia.thumb=''}});localStorage.setItem('regieplan_webapp_v36',JSON.stringify(lite))}catch(err){console.warn(err)}}}function loadLocal(){try{let s=localStorage.getItem('regieplan_webapp_v36')||localStorage.getItem('regieplan_webapp_v35')||localStorage.getItem('regieplan_webapp_v34')||localStorage.getItem('regieplan_webapp_v33')||localStorage.getItem('regieplan_webapp_v32')||localStorage.getItem('regieplan_webapp_v31')||localStorage.getItem('regieplan_webapp_v30')||localStorage.getItem('regieplan_webapp_v29')||localStorage.getItem('regieplan_webapp_v28')||localStorage.getItem('regieplan_webapp_v27')||localStorage.getItem('regieplan_webapp_v26')||localStorage.getItem('regieplan_webapp_v25')||localStorage.getItem('regieplan_webapp_v24')||localStorage.getItem('regieplan_webapp_v23')||localStorage.getItem('regieplan_webapp_v22')||localStorage.getItem('regieplan_webapp_v21')||localStorage.getItem('regieplan_webapp_v20')||localStorage.getItem('regieplan_webapp_v19')||localStorage.getItem('regieplan_webapp_v18')||localStorage.getItem('regieplan_webapp_v17')||localStorage.getItem('regieplan_webapp_v16')||localStorage.getItem('regieplan_webapp_v15')||localStorage.getItem('regieplan_webapp_v14')||localStorage.getItem('regieplan_webapp_v13')||localStorage.getItem('regieplan_webapp_v12')||localStorage.getItem('regieplan_webapp_v11')||localStorage.getItem('regieplan_webapp_v10')||localStorage.getItem('regieplan_webapp_v9')||localStorage.getItem('regieplan_webapp_v8')||localStorage.getItem('regieplanV7');if(s){state=JSON.parse(s);state.zoom=state.zoom||1;state.logoPos=state.logoPos||{x:50,y:50};state.colWidths=state.colWidths||{};state.rowHeights=state.rowHeights||{};state.activeRowId=state.activeRowId||null;state.showStartRowId=state.showStartRowId||null;state.presets=state.presets?.length?state.presets:JSON.parse(JSON.stringify(basePresets));state.cols=state.cols?.length?state.cols:JSON.parse(JSON.stringify(baseCols));mergeBaseColumns();state.screens=state.screens?.length?state.screens:[{id:'screen1',name:'LED Main',res:'1920x1080'}];state.columnOrder=Array.isArray(state.columnOrder)?state.columnOrder:null;state.rows=state.rows?.length?state.rows:[];state.rows.forEach(r=>{if(typeof r.soundMedia==='undefined')r.soundMedia=null});if(!state.rows.length)defaultRows()}}catch(e){console.warn(e)}}

function applyCleanColorDefaults(force=false){
  const clean=JSON.parse(JSON.stringify(basePresets));
  const oldIds=['video','talk','cue','warn'];
  const looksOld=state.presets && state.presets.some(p=>oldIds.includes(p.id)) && !state.presets.some(p=>p.id==='violet');
  if(force || looksOld){
    const keep=(state.presets||[]).filter(p=>String(p.id).startsWith('pre_'));
    state.presets=[...clean,...keep];
    state.rows.forEach(r=>{ if(r.preset==='video') r.preset='blue'; if(r.preset==='talk') r.preset='green'; if(['cue','warn'].includes(r.preset)) r.preset='lime'; if(!state.presets.find(p=>p.id===r.preset)) r.preset='neutral'; });
  }
  normalizePresetNames();
}
function normalizePresetNames(){
  const byId=Object.fromEntries(basePresets.map(p=>[p.id,p.name]));
  (state.presets||[]).forEach(p=>{ if(byId[p.id]) p.name=byId[p.id]; });
}

function fitToScreen(){
  const wrap=$('#tableWrap');
  if(!wrap)return;
  const visible=cols();
  if(!visible.length)return;
  const compactWidth=c=>{
    if(c.id==='handle')return 40;
    if(c.id==='cue')return 44;
    if(c.id==='color')return 78;
    if(['start','duration','end'].includes(c.id))return 86;
    if(c.id==='what')return 150;
    if(c.id==='detail')return 190;
    if(c.id==='people')return 150;
    if(c.type==='screen')return 620;
    if(c.id==='sound')return 160;
    return 110;
  };
  const actionWidth=86;
  const next=visible.map(c=>({c,w:compactWidth(c)}));
  const tableWidth=next.reduce((sum,x)=>sum+x.w,0)+actionWidth;
  const target=Math.max(260,wrap.clientWidth-8);
  state.zoom=Math.max(.35,Math.min(1,+(target/tableWidth).toFixed(3)));
  state.colWidths=state.colWidths||{};
  next.forEach(x=>state.colWidths[x.c.id]=Math.round(x.w));
  saveLocal(false);
  render();
  $('#tableWrap')?.classList.add('fitMode');
}

function colDeleteButton(c){return isDeletableCol(c)?`<button type="button" class="colDelete" data-delete-col="${esc(c.id)}" title="Spalte ausblenden/loeschen">X</button>`:''}
function rowActions(r){return `<td class="rowActionsCell"><div class="rowActions"><button type="button" class="rowActionBtn dim" data-toggle-row-muted="${r.id}" title="Zeile ausgrauen/einblenden">${r.muted?'ON':'OFF'}</button><button type="button" class="rowActionBtn delete" data-delete-row="${r.id}" title="Zeile loeschen">X</button></div></td>`}
function media(m,rowId,sid){
  if(!m)return'';
  let kind=mediaKind(m),av=((m.type||'').startsWith('video/')||(m.type||'').startsWith('audio/')),stored=!!m.mediaKey,remote=!!(m.remote||m.remoteUrl),missing=(!m.data&&!m.url&&!m.remoteUrl&&av&&!stored&&!remote);
  let audioClass=(m.type||'').startsWith('audio/')?' audioThumb':'';
  let title=missing?'Datei erneut auswaehlen':'Datei oeffnen';
  let src=m.url||m.remoteUrl||m.data||'';
  let thumb=mediaThumb(m);
  let thumbHtml=((m.type||'').startsWith('video/')&&src&&!m.thumb)?`<video data-src="${esc(src)}" muted playsinline preload="none"></video>`:`<img src="${thumb}" alt="${kind}">`;
  let label=missing?'FEHLT':kind;
  return `<div class="mediaPreview" data-open-media="${rowId}|${sid}" data-missing="${missing?1:0}" data-stored="${stored?1:0}" data-remote="${remote?1:0}" title="${title}"><div class="mediaThumbStack"><div class="mediaThumb${audioClass}">${thumbHtml}</div><div class="mediaLabelRow"><span class="mediaBadge">${label}</span><span class="mediaTitle">${esc(m.name||'Datei')}</span></div></div><div class="mediaMeta"></div><div class="mediaTools"><button class="mediaTool replace" type="button" title="Datei ersetzen" data-pick-media="${rowId}|${sid}">Reload</button><button class="mediaTool" type="button" title="Datei entfernen" data-clear-media="${rowId}|${sid}">X</button></div></div>`;
}
function renderRegiePreviewList(existing=null){
  const box=$('#regiePreviewList'),video=$('#regiePreviewVideo'),now=$('#regiePreviewNow');
  if(!box)return;
  const items=existing||regieVideoItems();
  if(!items.length){box.innerHTML='<div class="help">Keine Videos im Regieplan gefunden.</div>';if(now)now.textContent='Noch kein Video ausgewaehlt.';return}
  if(regiePreviewIndex>=items.length)regiePreviewIndex=0;
  box.innerHTML=items.map((item,i)=>`<div class="regiePreviewItem ${i===regiePreviewIndex?'active':''}"><div><b>${esc(item.name)}</b><span>${esc((item.loop?'LOOP - ':'')+(item.start?item.start+' - ':'')+(item.what||''))}</span></div><button class="regiePreviewBtn" type="button" title="Play/Pause" data-regie-preview-play="${i}">${i===regiePreviewIndex&&video&&!video.paused?'Pause':'Play'}</button><a class="regiePreviewBtn" title="Link oeffnen" href="${esc(item.url)}" target="_blank" rel="noopener">Link</a></div>`).join('');
  $$('[data-regie-preview-play]').forEach(b=>b.addEventListener('click',()=>toggleRegiePreview(b.dataset.regiePreviewPlay)));
}

$$('[data-action="add-row"]').forEach(b=>b.addEventListener('click',()=>addRow(false)));$$('[data-action="add-block"]').forEach(b=>b.addEventListener('click',()=>addRow(true)));$$('[data-action="recalc"]').forEach(b=>b.addEventListener('click',()=>recalc(0,true)));
$$('[data-tab]').forEach(b=>b.addEventListener('click',()=>{$$('[data-tab]').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.section').forEach(s=>s.classList.remove('active'));$('#sec-'+b.dataset.tab).classList.add('active')}));$$('[data-jump]').forEach(b=>b.addEventListener('click',()=>document.querySelector(`[data-tab="${b.dataset.jump}"]`).click()));
$('#projectName').addEventListener('input',e=>{state.projectName=e.target.value;$('#headline').textContent=state.projectName;saveLocal()});$('#projectVersion').addEventListener('focus',syncVersionField);$('#themeBtn').addEventListener('click',()=>{state.theme=state.theme==='light'?'dark':'light';render()});$('#search').addEventListener('input',renderTable);
$('#zoomIn').addEventListener('click',()=>{$('#tableWrap')?.classList.remove('fitMode');state.zoom=Math.min(2.0,+(state.zoom+.1).toFixed(2));render()});$('#zoomOut').addEventListener('click',()=>{$('#tableWrap')?.classList.remove('fitMode');state.zoom=Math.max(.25,+(state.zoom-.1).toFixed(2));render()});$('#zoomFit').addEventListener('click',()=>{fitToScreen()});
$('#saveScreen').addEventListener('click',()=>{let name=$('#screenName').value.trim()||'Screen '+(state.screens.length+1),res=$('#screenRes').value.trim()||'1920x1080',id='screen_'+uid();state.screens.push({id,name,res});ensureColumnOrder();state.columnOrder.push('screen:'+id);state.rows.forEach(r=>{if(!r.screens)r.screens={};r.screens[id]={text:'',media:null}});$('#screenName').value='';$('#screenRes').value='';render()});
$('#saveColumn').addEventListener('click',()=>{let name=$('#columnName').value.trim();if(!name)return;let id='col_'+uid();state.cols.push({id,name,show:true,type:'text'});ensureColumnOrder();state.columnOrder.push(id);state.rows.forEach(r=>r[id]='');$('#columnName').value='';render()});
$('#savePreset').addEventListener('click',()=>{let name=$('#presetName').value.trim()||'Preset',dark=$('#presetDark').value,light=$('#presetLight').value,id='pre_'+uid();state.presets.push({id,name,dark,light});selectedPresetId=id;$('#presetName').value='';render()});
$('#savePerson').addEventListener('click',async()=>{let name=$('#personName').value.trim();if(!name)return;let file=$('#personImage').files[0],img=file?(await readMedia(file)).data:null;state.people.push({id:'person_'+uid(),name,role:$('#personRole').value.trim(),img});$('#personName').value='';$('#personRole').value='';$('#personImage').value='';render()});
function downloadLocalJson(){
  saveLocal();
  try{
    syncVersionField();
    const safe=(state.projectName||'Regieplan').replace(/[^a-z0-9äöüß_-]+/gi,'_');
    const ver=versionText();
    const blob=new Blob([JSON.stringify(exportableState(),null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=`${ver}_${safe}.json`;
    a.style.display='none';
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{URL.revokeObjectURL(url);a.remove()},150);
    const b=$('#localSaveBtn');
    if(b){const old=b.textContent;b.textContent='JSON gespeichert';setTimeout(()=>b.textContent=old,1200)}
  }catch(err){
    console.error(err);
    alert('Lokales JSON-Speichern ist fehlgeschlagen: '+err.message);
  }
}
$('#localSaveBtn')?.addEventListener('click',downloadLocalJson);$('#serverSaveBtnSide')?.addEventListener('click',saveServerVersion);$('#serverRefreshBtn')?.addEventListener('click',loadServerVersions);
$('#playerRefreshBtn')?.addEventListener('click',loadPlayerClips);
$('#exportBtn').addEventListener('click',()=>{try{bumpVersion();syncVersionField();let safe=(state.projectName||'Regieplan').replace(/[^a-z0-9äöüß_-]+/gi,'_');let ver=versionText();let blob=new Blob([JSON.stringify(exportableState(),null,2)],{type:'application/json'});let url=URL.createObjectURL(blob);let a=document.createElement('a');a.href=url;a.download=`${ver}_${safe}.json`;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove();render()},150)}catch(err){console.error(err);alert('Export ist fehlgeschlagen: '+err.message)}});$('#importBtn').addEventListener('click',()=>$('#jsonFile').click());$('#jsonFile').addEventListener('change',e=>{let f=e.target.files[0];if(!f)return;let fr=new FileReader();fr.onload=()=>{try{state=JSON.parse(fr.result);render()}catch(err){alert('JSON konnte nicht geladen werden.')}};fr.readAsText(f)});
function setLogo(file){let fr=new FileReader();fr.onload=()=>{state.logo=fr.result;state.logoMode=state.logoMode||'contain';state.logoPos={x:50,y:50};render()};fr.readAsDataURL(file)}$('#logoInput').addEventListener('change',e=>e.target.files[0]&&setLogo(e.target.files[0]));$('#logoFrame').addEventListener('click',e=>{if(e.target.id==='logoInput')return; if(!state.logo)$('#logoInput').click()});$('#logoFrame').addEventListener('dblclick',e=>{e.preventDefault();e.stopPropagation();$('#logoInput').click()});$('#logoFrame').addEventListener('dragover',e=>{e.preventDefault();$('#logoFrame').classList.add('dragOver')});$('#logoFrame').addEventListener('dragleave',()=>$('#logoFrame').classList.remove('dragOver'));$('#logoFrame').addEventListener('drop',e=>{e.preventDefault();$('#logoFrame').classList.remove('dragOver');let f=e.dataTransfer.files[0];if(f&&f.type.startsWith('image/'))setLogo(f)});let moving=false;$('#logoFrame').addEventListener('mousedown',e=>{if(!state.logo)return;moving=true;e.preventDefault()});window.addEventListener('mouseup',()=>moving=false);window.addEventListener('mousemove',e=>{if(!moving)return;let r=$('#logoFrame').getBoundingClientRect();state.logoPos={x:Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),y:Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))};renderLogo();saveLocal()});$('#logoFit').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();state.logoMode='contain';render()});$('#logoFill').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();state.logoMode='cover';render()});$('#logoClear').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();state.logo=null;render()});
$('#mediaModalClose')?.addEventListener('click',closeMediaModal);$('#mediaModal')?.addEventListener('click',e=>{if(e.target.id==='mediaModal')closeMediaModal()});window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMediaModal()});
$('#regiePreviewVideo')?.addEventListener('ended',()=>{const items=regieVideoItems();if(regiePreviewIndex<items.length-1)playRegiePreview(regiePreviewIndex+1);else renderRegiePreviewList(items)});
$('#regiePreviewVideo')?.addEventListener('play',()=>renderRegiePreviewList());
$('#regiePreviewVideo')?.addEventListener('pause',()=>renderRegiePreviewList());


/* V37: stabile Medien-Zellen: Sonderzeichen/Slash/volle Pfade brechen das Layout nicht mehr. Default-Groesse wie markierte blaue Zeile. */
(function(){
  const v37Style=document.createElement('style');
  v37Style.textContent=`
    .mediaDrop.hasMedia{
      min-height:150px!important;
      height:calc(var(--row-h,calc(170px * var(--zoom))) - calc(14px * var(--zoom)))!important;
      max-height:none!important;
      overflow:hidden!important;
      padding:8px 10px!important;
      background:#06100c!important;
      border-color:rgba(201,255,25,.72)!important;
    }
    .mediaPreview{
      width:100%!important;
      min-width:0!important;
      max-width:100%!important;
      height:100%!important;
      display:grid!important;
      grid-template-columns:minmax(0,1fr) auto!important;
      gap:10px!important;
      align-items:center!important;
      overflow:hidden!important;
      background:#06100c!important;
      border-radius:13px!important;
      padding:0!important;
    }
    .mediaThumbStack{
      min-width:0!important;
      width:100%!important;
      height:100%!important;
      display:flex!important;
      flex-direction:column!important;
      justify-content:center!important;
      gap:6px!important;
      overflow:hidden!important;
    }
    .mediaThumb{
      width:100%!important;
      min-width:0!important;
      max-width:100%!important;
      flex:1 1 auto!important;
      height:auto!important;
      min-height:86px!important;
      aspect-ratio:16/9!important;
      max-height:calc(var(--row-h,170px) - 46px)!important;
      border-radius:12px!important;
      overflow:hidden!important;
    }
    .mediaThumb img,.mediaThumb video{
      width:100%!important;
      height:100%!important;
      object-fit:cover!important;
      display:block!important;
    }
    .mediaLabelRow{
      display:flex!important;
      align-items:center!important;
      gap:7px!important;
      width:100%!important;
      min-width:0!important;
      max-width:100%!important;
      overflow:hidden!important;
    }
    .mediaBadge{
      flex:0 0 auto!important;
      height:22px!important;
      line-height:22px!important;
      padding:0 9px!important;
      font-size:10px!important;
    }
    .mediaTitle{
      flex:1 1 auto!important;
      min-width:0!important;
      max-width:100%!important;
      display:block!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      white-space:nowrap!important;
      overflow-wrap:normal!important;
      word-break:normal!important;
      font-size:14px!important;
      line-height:1.15!important;
      font-weight:900!important;
      direction:ltr!important;
      unicode-bidi:plaintext!important;
    }
    .mediaMeta{display:none!important;min-width:0!important;max-width:0!important;overflow:hidden!important;}
    .mediaTools{
      justify-self:end!important;
      align-self:center!important;
      display:flex!important;
      gap:8px!important;
      flex:0 0 auto!important;
      max-width:112px!important;
      overflow:hidden!important;
    }
    .mediaTool{
      width:38px!important;
      min-width:38px!important;
      height:38px!important;
      padding:0!important;
      border-radius:999px!important;
      font-size:15px!important;
      line-height:1!important;
      font-weight:900!important;
    }
    .mediaTool.replace{font-size:0!important;}
    .mediaTool.replace::before{content:'↻';font-size:19px!important;}
    .audioTonCol .mediaDrop.hasMedia{min-height:104px!important;}
    .audioTonCol .mediaThumb{min-height:54px!important;max-height:70px!important;}
    .audioTonCol .mediaTitle{font-size:12px!important;}
    @media(max-width:1200px){
      .mediaDrop.hasMedia{min-height:126px!important;}
      .mediaThumb{min-height:68px!important;}
      .mediaTitle{font-size:12px!important;}
    }
  `;
  document.head.appendChild(v37Style);

  window.cleanMediaName=function(name){
    let s=String(name||'Datei')
      .replace(/[\u0000-\u001f\u007f]/g,' ')
      .replace(/[\u202a-\u202e\u2066-\u2069]/g,'')
      .replace(/\s+/g,' ')
      .trim();
    const parts=s.split(/[\\/]+/).filter(Boolean);
    if(parts.length)s=parts[parts.length-1];
    return s || 'Datei';
  };

  const oldDefaultColumnWidth=window.defaultColumnWidth;
  window.defaultColumnWidth=function(c){
    if(!c)return 140;
    if(c.type==='screen')return 700;
    if(c.id==='sound')return 210;
    return oldDefaultColumnWidth?oldDefaultColumnWidth(c):140;
  };

  window.rowHeight=function(r){
    state.rowHeights=state.rowHeights||{};
    let def=r?.isBlock?52:(rowHasMedia(r)?170:64);
    return Math.max(36,Math.round(state.rowHeights[r.id]||def));
  };

  window.autoExpandMediaColumn=function(colId,media,rowId){
    let kind=mediaKind(media);
    let current=colWidth({id:colId,type:colId==='sound'?'text':'screen'});
    let target=(kind==='VIDEO'||kind==='BILD')?700:(kind==='AUDIO'?230:current);
    if(current<target)setColWidth(colId,target);
    if(rowId){
      let r=state.rows.find(x=>x.id===rowId);
      if(r){
        let rh=rowHeight(r);
        let targetH=(kind==='VIDEO'||kind==='BILD')?170:(kind==='AUDIO'?118:rh);
        if(rh<targetH)setRowHeight(rowId,targetH);
      }
    }
  };

  window.media=function(m,rowId,sid){
    if(!m)return'';
    let kind=mediaKind(m),av=((m.type||'').startsWith('video/')||(m.type||'').startsWith('audio/')),stored=!!m.mediaKey,remote=!!(m.remote||m.remoteUrl),missing=(!m.data&&!m.url&&!m.remoteUrl&&av&&!stored&&!remote);
    let audioClass=(m.type||'').startsWith('audio/')?' audioThumb':'';
    let title=missing?'Datei erneut auswaehlen':'Datei oeffnen';
    let src=m.url||m.remoteUrl||m.data||'';
    let thumb=mediaThumb(m);
    let thumbHtml=((m.type||'').startsWith('video/')&&src&&!m.thumb)?`<video data-src="${esc(src)}" muted playsinline preload="none"></video>`:`<img src="${thumb}" alt="${kind}">`;
    let label=missing?'FEHLT':(remote?'LINK':kind);
    let displayName=cleanMediaName(m.name||'Datei');
    let fullName=String(m.name||displayName);
    return `<div class="mediaPreview" data-open-media="${rowId}|${sid}" data-missing="${missing?1:0}" data-stored="${stored?1:0}" data-remote="${remote?1:0}" title="${esc(fullName)}"><div class="mediaThumbStack"><div class="mediaThumb${audioClass}">${thumbHtml}</div><div class="mediaLabelRow"><span class="mediaBadge">${label}</span><span class="mediaTitle">${esc(displayName)}</span></div></div><div class="mediaMeta"></div><div class="mediaTools"><button class="mediaTool replace" type="button" title="Datei ersetzen" data-pick-media="${rowId}|${sid}">Reload</button><button class="mediaTool" type="button" title="Datei entfernen" data-clear-media="${rowId}|${sid}">X</button></div></div>`;
  };
})();

/* ---- script block 47: V108 final responsive layer ---- */
(function(){
  const icons108={
    play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z"/></svg>',
    pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z"/></svg>',
    prev:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6V5Zm13 0v14l-10-7 10-7Z"/></svg>',
    next:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2V5ZM5 5l10 7-10 7V5Z"/></svg>',
    copy:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7V3h14v14h-4v4H3V7h4Zm2 0h8v8h2V5H9v2Zm6 2H5v10h10V9Z"/></svg>',
    close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 10.6 4.95-4.95 1.4 1.4L13.4 12l4.95 4.95-1.4 1.4L12 13.4l-4.95 4.95-1.4-1.4L10.6 12 5.65 7.05l1.4-1.4L12 10.6Z"/></svg>',
    eye:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c5.2 0 8.7 4.2 10 7-1.3 2.8-4.8 7-10 7S3.3 14.8 2 12c1.3-2.8 4.8-7 10-7Zm0 2c-3.7 0-6.5 2.6-7.8 5 1.3 2.4 4.1 5 7.8 5s6.5-2.6 7.8-5C18.5 9.6 15.7 7 12 7Zm0 2.5A2.5 2.5 0 1 1 12 14.5 2.5 2.5 0 0 1 12 9.5Z"/></svg>',
    eyeOff:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4.4 3 16.6 16.6-1.4 1.4-3-3A10.7 10.7 0 0 1 12 19c-5.2 0-8.7-4.2-10-7a14.5 14.5 0 0 1 4-4.8L3 4.4 4.4 3Zm3 5.6A12.2 12.2 0 0 0 4.2 12c1.3 2.4 4.1 5 7.8 5a8 8 0 0 0 3-.6l-2-2A2.5 2.5 0 0 1 9.6 11l-2.2-2.4ZM12 5c5.2 0 8.7 4.2 10 7a14 14 0 0 1-3 4.1l-1.4-1.4a12.1 12.1 0 0 0 2.2-2.7C18.5 9.6 15.7 7 12 7a7.9 7.9 0 0 0-2.2.3L8.2 5.7A10.5 10.5 0 0 1 12 5Z"/></svg>'
  };

  const style=document.createElement('style');
  style.textContent=`
    @media screen{
      .iconBtn108,.regiePreviewControlBtn.iconBtn108,.rowActionBtn.iconBtn108{
        display:inline-grid!important;place-items:center!important;
        width:26px!important;min-width:26px!important;height:26px!important;
        padding:0!important;line-height:1!important;font-size:0!important;
      }
      .regiePreviewControlBtn.main.iconBtn108{width:42px!important;min-width:42px!important;}
      .iconBtn108 svg{width:15px!important;height:15px!important;display:block!important;fill:currentColor!important;pointer-events:none!important;}
      .rowActionBtn.duplicate.iconBtn108{font-size:0!important;}
    }
  `;
  document.head.appendChild(style);

  function iconize108(btn,key,label){
    if(!btn)return;
    btn.classList.add('iconBtn103','iconBtn108');
    btn.innerHTML=icons108[key]||'';
    btn.setAttribute('aria-label',label);
    btn.setAttribute('title',label);
  }

  function applyIcons108(root=document){
    iconize108(root.querySelector?.('#regiePrevBtn'), 'prev', 'Vorheriges Medium');
    iconize108(root.querySelector?.('#regieNextBtn'), 'next', 'Naechstes Medium');
    const video=document.getElementById('regiePreviewVideo');
    iconize108(root.querySelector?.('#regiePlayPauseBtn'), video&&!video.paused?'pause':'play', video&&!video.paused?'Pause':'Play');
    root.querySelectorAll?.('.rowActionBtn.duplicate,[data-duplicate-row]').forEach(btn=>iconize108(btn,'copy','Zeile duplizieren'));
    root.querySelectorAll?.('.rowActionBtn.delete,[data-delete-row]').forEach(btn=>iconize108(btn,'close','Zeile loeschen'));
    root.querySelectorAll?.('.rowActionBtn.dim,[data-toggle-row-muted]').forEach(btn=>{
      const row=(state.rows||[]).find(r=>r.id===btn.dataset.toggleRowMuted);
      iconize108(btn,row?.muted?'eyeOff':'eye',row?.muted?'Zeile einblenden':'Zeile ausgrauen');
    });
  }

  const oldUpdate108=window.updateRegiePreviewControls;
  window.updateRegiePreviewControls=function(){
    if(typeof oldUpdate108==='function')oldUpdate108.apply(this,arguments);
    applyIcons108(document);
  };
  try{updateRegiePreviewControls=window.updateRegiePreviewControls;}catch(e){}

  function rowById108(id){return (state.rows||[]).find(r=>r&&r.id===id)}
  function slot108(row,sid){
    if(!row)return null;
    if(sid==='sound')return {media:row.soundMedia||null,set:m=>{row.soundMedia=m;row.sound=m?(row.sound||m.name||'').trim()||m.name||'':'';}};
    if(!row.screens)row.screens={};
    if(!row.screens[sid])row.screens[sid]={text:'',media:null};
    return {media:row.screens[sid].media||null,set:m=>{row.screens[sid].media=m;if(m)row.screens[sid].text=(row.screens[sid].text||m.name||'').trim()||m.name||'';}};
  }
  function isAudio108(m){
    const t=String(m?.type||m?.mime||'').toLowerCase(),n=String(m?.name||m?.url||m?.remoteUrl||'').toLowerCase();
    return t.startsWith('audio/')||/\.(mp3|wav|wave|m4a|aac|ogg|flac)(\?|#|$)/i.test(n);
  }
  function isVisual108(m){
    const t=String(m?.type||m?.mime||'').toLowerCase(),n=String(m?.name||m?.url||m?.remoteUrl||'').toLowerCase();
    return t.startsWith('video/')||t.startsWith('image/')||/\.(mp4|mov|m4v|webm|jpg|jpeg|png|gif|webp)(\?|#|$)/i.test(n);
  }
  function findDrop108(rowId,sid){
    const tr=document.querySelector(`#tbody tr[data-id="${CSS.escape(rowId)}"]`);
    if(!tr)return null;
    return sid==='sound'?tr.querySelector('.audioTonDrop'):tr.querySelector(`.mediaDrop[data-screen="${CSS.escape(sid)}"]`);
  }
  function ensureAddButton108(drop,rowId,sid){
    if(!drop||drop.querySelector('.mediaAdd'))return;
    const input=drop.querySelector('input.mediaFileInput');
    const wrap=document.createElement('span');
    wrap.innerHTML=sid==='sound'
      ?`<button type="button" class="mediaAdd" data-dynamic-media="1" data-pick-media="${esc(rowId)}|sound">+ MP3/WAV</button>`
      :`<button type="button" class="mediaAdd screenMediaAdd" data-dynamic-media="1" data-pick-media="${esc(rowId)}|${esc(sid)}">+ Video/Bild</button>`;
    drop.insertBefore(wrap.firstElementChild,input||null);
  }
  function paintMedia108(rowId,sid,m){
    const drop=findDrop108(rowId,sid);
    if(!drop)return false;
    drop.querySelector('.mediaPreview[data-open-media]')?.remove();
    drop.querySelectorAll('.mediaAdd').forEach(b=>b.remove());
    const input=drop.querySelector('input.mediaFileInput');
    if(m){
      const wrap=document.createElement('span');
      wrap.innerHTML=media(m,rowId,sid);
      drop.insertBefore(wrap.firstElementChild,input||null);
      drop.classList.add('hasMedia');
    }else{
      drop.classList.remove('hasMedia');
      ensureAddButton108(drop,rowId,sid);
    }
    try{primeVideoThumbs();}catch(e){}
    try{makeMediaDraggable104?.();}catch(e){}
    applyIcons108(drop);
    return true;
  }

  window.addEventListener('drop',e=>{
    const key=e.dataTransfer?.getData('application/x-regie-media')||e.dataTransfer?.getData('text/regie-media');
    if(!key)return;
    const drop=e.target.closest?.('.mediaDrop');
    if(!drop)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    document.querySelectorAll('.mediaMoveOver').forEach(el=>el.classList.remove('mediaMoveOver'));
    const [fromRid,fromSid]=key.split('|');
    const toRid=drop.closest('tr')?.dataset.id;
    const toSid=drop.dataset.audioTon||drop.dataset.screen||'';
    if(!fromRid||!fromSid||!toRid||!toSid||fromRid===toRid&&fromSid===toSid)return;
    const fromSlot=slot108(rowById108(fromRid),fromSid);
    const toSlot=slot108(rowById108(toRid),toSid);
    const m=fromSlot?.media;
    if(!m||!toSlot)return;
    if(toSid==='sound'&&!isAudio108(m)){alert('In Audio / Ton bitte nur Audiodateien legen.');return;}
    if(toSid!=='sound'&&!isVisual108(m)){alert('In LED / Screen bitte nur Video oder Bild legen.');return;}
    const copy=confirm('Medium duplizieren?\n\nOK = duplizieren\nAbbrechen = verschieben');
    const next=JSON.parse(JSON.stringify(m));
    toSlot.set(next);
    paintMedia108(toRid,toSid,next);
    if(!copy){
      fromSlot.set(null);
      paintMedia108(fromRid,fromSid,null);
    }
    if(toSid==='sound')autoExpandMediaColumn('sound',next,toRid);
    else autoExpandMediaColumn('screen:'+toSid,next,toRid);
    saveLocal(false);
    if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();
  },true);

  let resumeRenderBlockUntil=0;
  let pageWasHidden108=false;
  ['visibilitychange','pageshow','focus'].forEach(ev=>window.addEventListener(ev,()=>{
    if(ev==='visibilitychange'&&document.hidden){pageWasHidden108=true;return;}
    if(!pageWasHidden108)return;
    resumeRenderBlockUntil=Date.now()+900;
    applyIcons108(document);
  },true));
  const oldRender108=window.render||render;
  window.render=function(){
    if(Date.now()<resumeRenderBlockUntil)return;
    const result=oldRender108.apply(this,arguments);
    setTimeout(()=>applyIcons108(document),0);
    return result;
  };
  try{render=window.render;}catch(e){}
  const oldRenderTable108=window.renderTable||renderTable;
  window.renderTable=function(){
    if(Date.now()<resumeRenderBlockUntil)return;
    const result=oldRenderTable108.apply(this,arguments);
    setTimeout(()=>applyIcons108(document),0);
    return result;
  };
  try{renderTable=window.renderTable;}catch(e){}

  function startIconGuard108(){
    try{
      ['play','pause','loadedmetadata'].forEach(ev=>document.getElementById('regiePreviewVideo')?.addEventListener(ev,()=>applyIcons108(document)));
      applyIcons108(document);
    }catch(e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startIconGuard108,{once:true});
  else setTimeout(startIconGuard108,0);
})();

/* ---- script block 46: V107 responsive preview click + duplicate without full media reload ---- */
(function(){
  const icons107={
    copy:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7V3h14v14h-4v4H3V7h4Zm2 0h8v8h2V5H9v2Zm6 2H5v10h10V9Z"/></svg>',
    eye:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c5.2 0 8.7 4.2 10 7-1.3 2.8-4.8 7-10 7S3.3 14.8 2 12c1.3-2.8 4.8-7 10-7Zm0 2c-3.7 0-6.5 2.6-7.8 5 1.3 2.4 4.1 5 7.8 5s6.5-2.6 7.8-5C18.5 9.6 15.7 7 12 7Zm0 2.5A2.5 2.5 0 1 1 12 14.5 2.5 2.5 0 0 1 12 9.5Z"/></svg>',
    eyeOff:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4.4 3 16.6 16.6-1.4 1.4-3-3A10.7 10.7 0 0 1 12 19c-5.2 0-8.7-4.2-10-7a14.5 14.5 0 0 1 4-4.8L3 4.4 4.4 3Zm3 5.6A12.2 12.2 0 0 0 4.2 12c1.3 2.4 4.1 5 7.8 5a8 8 0 0 0 3-.6l-2-2A2.5 2.5 0 0 1 9.6 11l-2.2-2.4ZM12 5c5.2 0 8.7 4.2 10 7a14 14 0 0 1-3 4.1l-1.4-1.4a12.1 12.1 0 0 0 2.2-2.7C18.5 9.6 15.7 7 12 7a7.9 7.9 0 0 0-2.2.3L8.2 5.7A10.5 10.5 0 0 1 12 5Z"/></svg>',
    close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 10.6 4.95-4.95 1.4 1.4L13.4 12l4.95 4.95-1.4 1.4L12 13.4l-4.95 4.95-1.4-1.4L10.6 12 5.65 7.05l1.4-1.4L12 10.6Z"/></svg>'
  };

  function setIcon107(btn,key,label){
    if(!btn)return;
    btn.classList.add('iconBtn103');
    btn.innerHTML=icons107[key]||'';
    btn.setAttribute('aria-label',label);
    btn.setAttribute('title',label);
  }

  function applyRowIcons107(root=document){
    root.querySelectorAll?.('.rowActionBtn.duplicate,[data-duplicate-row]').forEach(btn=>setIcon107(btn,'copy','Zeile duplizieren'));
    root.querySelectorAll?.('.rowActionBtn.delete,[data-delete-row]').forEach(btn=>setIcon107(btn,'close','Zeile loeschen'));
    root.querySelectorAll?.('.rowActionBtn.dim,[data-toggle-row-muted]').forEach(btn=>{
      const row=(state.rows||[]).find(r=>r.id===btn.dataset.toggleRowMuted);
      setIcon107(btn,row?.muted?'eyeOff':'eye',row?.muted?'Zeile einblenden':'Zeile ausgrauen');
    });
  }

  function cloneRow107(row){
    const copy=JSON.parse(JSON.stringify(row));
    copy.id='row_'+Math.random().toString(36).slice(2,9);
    return copy;
  }

  function makeRow107(row){
    const c=cols();
    const p=preset(row.preset);
    const ct=colorsFor(p);
    const tr=document.createElement('tr');
    tr.dataset.id=row.id;
    tr.style.setProperty('--row-bg',ct.bg);
    tr.style.setProperty('--row-text',ct.tx);
    tr.style.cssText+=rowStyle(row);
    if(row.id===state.activeRowId)tr.classList.add('activeRow');
    if(row.muted)tr.classList.add('rowMuted');
    if(row.isBlock){
      tr.classList.add('blockSeparator');
      tr.innerHTML=`<td colspan="${c.length}"><div class="blockBar"><span class="grip" draggable="true" title="Trenner ziehen">::</span><div class="colorPill" data-color="${esc(row.id)}">${esc(preset(row.preset).name)}</div><input class="blockInput" data-field="what" value="${esc(row.what||'Abschnitt')}" placeholder="Abschnitt / Blocktitel"><span class="rowResize" data-resize-row="${esc(row.id)}" title="Zeilenhoehe ziehen"></span></div></td>${rowActions(row)}`;
    }else{
      tr.innerHTML=c.map(col=>cell(col,row,0,ct)).join('')+rowActions(row);
    }
    applyRowIcons107(tr);
    try{makeMediaDraggable104?.();}catch(e){}
    return tr;
  }

  function refreshCueCells107(){
    let cue=0;
    document.querySelectorAll('#tbody tr').forEach(tr=>{
      const row=(state.rows||[]).find(r=>r.id===tr.dataset.id);
      if(!row||row.isBlock)return;
      cue++;
      const cellEl=tr.querySelector('.cueCell');
      if(cellEl)cellEl.textContent=cue;
    });
  }

  function activateRow107(id){
    state.activeRowId=id;
    document.querySelectorAll('#tbody tr').forEach(tr=>tr.classList.toggle('activeRow',tr.dataset.id===id));
  }

  function duplicateFast107(btn,e){
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const id=btn.dataset.duplicateRow;
    const idx=(state.rows||[]).findIndex(r=>r.id===id);
    if(idx<0)return;
    const copy=cloneRow107(state.rows[idx]);
    state.rows.splice(idx+1,0,copy);
    activateRow107(copy.id);
    const source=document.querySelector(`#tbody tr[data-id="${CSS.escape(id)}"]`);
    const newRow=makeRow107(copy);
    if(source)source.after(newRow);
    else document.getElementById('tbody')?.appendChild(newRow);
    try{primeVideoThumbs();}catch(err){}
    recalc(Math.max(0,idx),false);
    syncTimeCells();
    refreshCueCells107();
    saveLocal(false);
    if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();
    requestAnimationFrame(()=>applyRowIcons107(newRow));
  }

  function startPreviewFrom107(el,e){
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const all=Array.from(document.querySelectorAll('#regiePreviewList .regiePreviewItem'));
    const idx=all.indexOf(el);
    if(idx>=0){
      try{regiePreviewIndex=idx;}catch(err){}
      window.regiePreviewIndex=idx;
    }
    const key=el.dataset.regiePreviewKey||el.dataset.previewKey||'';
    if(key&&typeof window.playRegiePreviewExact==='function')window.playRegiePreviewExact(key);
    else if(typeof playRegiePreview==='function')playRegiePreview(Math.max(0,idx));
    const video=document.getElementById('regiePreviewVideo');
    if(video)video.play().catch(()=>{});
    const audio=document.getElementById('regiePreviewAudio');
    if(audio&&audio.src)audio.play().catch(()=>{});
  }

  window.addEventListener('click',e=>{
    const dup=e.target.closest?.('[data-duplicate-row]');
    if(dup){duplicateFast107(dup,e);return;}
    const mute=e.target.closest?.('[data-toggle-row-muted]');
    if(mute){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const row=(state.rows||[]).find(r=>r.id===mute.dataset.toggleRowMuted);
      if(!row)return;
      row.muted=!row.muted;
      const tr=document.querySelector(`#tbody tr[data-id="${CSS.escape(row.id)}"]`);
      if(tr)tr.classList.toggle('rowMuted',!!row.muted);
      applyRowIcons107(document);
      saveLocal(false);
      return;
    }
    const del=e.target.closest?.('[data-delete-row]');
    if(del){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const id=del.dataset.deleteRow;
      const row=(state.rows||[]).find(r=>r.id===id);
      if(!row)return;
      if(!confirm((row.isBlock?'Trenner':'Zeile')+' wirklich loeschen?'))return;
      state.rows=state.rows.filter(r=>r.id!==id);
      if(state.activeRowId===id)state.activeRowId=null;
      if(state.showStartRowId===id)state.showStartRowId=null;
      document.querySelector(`#tbody tr[data-id="${CSS.escape(id)}"]`)?.remove();
      recalc(0,false);
      syncTimeCells();
      refreshCueCells107();
      saveLocal(false);
      if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();
      return;
    }
    const preview=e.target.closest?.('#regiePreviewList .regiePreviewItem');
    if(preview)startPreviewFrom107(preview,e);
  },true);

  window.addEventListener('dblclick',e=>{
    const preview=e.target.closest?.('#regiePreviewList .regiePreviewItem');
    if(preview)startPreviewFrom107(preview,e);
  },true);

  setInterval(()=>applyRowIcons107(document),1200);
  setTimeout(()=>applyRowIcons107(document),0);
})();

/* V38: Preview-Player Controls + Playlist ohne Play/Link */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .regiePreviewPlayerWrap{position:relative;display:grid;gap:8px;}
    .regiePreviewControls{display:grid;grid-template-columns:42px 1fr 42px;gap:8px;align-items:center;}
    .regiePreviewControlBtn{
      height:34px;border-radius:999px;border:1px solid rgba(255,255,255,.16);
      background:rgba(255,255,255,.07);color:var(--text);font-size:14px;font-weight:900;
      display:grid;place-items:center;padding:0 10px;line-height:1;
    }
    .regiePreviewControlBtn:hover{border-color:rgba(201,255,25,.70);background:rgba(201,255,25,.14)}
    .regiePreviewControlBtn.main{background:var(--lime);border-color:var(--lime);color:#071007;font-size:12px;letter-spacing:.04em;text-transform:uppercase;}
    .regiePreviewItem{grid-template-columns:minmax(0,1fr)!important;cursor:pointer;}
    .regiePreviewItem:hover{border-color:rgba(201,255,25,.55);background:rgba(201,255,25,.08)}
  `;
  document.head.appendChild(style);

  function ensureRegiePreviewControls(){
    const video=document.getElementById('regiePreviewVideo');
    if(!video || document.getElementById('regiePreviewControls'))return;
    const wrap=document.createElement('div');
    wrap.className='regiePreviewPlayerWrap';
    video.parentNode.insertBefore(wrap,video);
    wrap.appendChild(video);
    const controls=document.createElement('div');
    controls.id='regiePreviewControls';
    controls.className='regiePreviewControls';
    controls.innerHTML=`<button class="regiePreviewControlBtn" type="button" id="regiePrevBtn" title="Vorheriges Video">←</button><button class="regiePreviewControlBtn main" type="button" id="regiePlayPauseBtn" title="Play/Pause">Play</button><button class="regiePreviewControlBtn" type="button" id="regieNextBtn" title="Nächstes Video">→</button>`;
    wrap.appendChild(controls);
    document.getElementById('regiePrevBtn')?.addEventListener('click',()=>regiePreviewStep(-1));
    document.getElementById('regieNextBtn')?.addEventListener('click',()=>regiePreviewStep(1));
    document.getElementById('regiePlayPauseBtn')?.addEventListener('click',()=>toggleRegiePreview(regiePreviewIndex));
    video.addEventListener('play',updateRegiePreviewControls);
    video.addEventListener('pause',updateRegiePreviewControls);
    video.addEventListener('loadedmetadata',updateRegiePreviewControls);
    updateRegiePreviewControls();
  }

  window.updateRegiePreviewControls=function(){
    const video=document.getElementById('regiePreviewVideo');
    const play=document.getElementById('regiePlayPauseBtn');
    const prev=document.getElementById('regiePrevBtn');
    const next=document.getElementById('regieNextBtn');
    const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
    if(play)play.textContent=video && !video.paused ? 'Pause' : 'Play';
    if(prev)prev.disabled=!items.length || regiePreviewIndex<=0;
    if(next)next.disabled=!items.length || regiePreviewIndex>=items.length-1;
  };

  window.regiePreviewStep=function(dir){
    const items=regieVideoItems();
    if(!items.length)return;
    const next=Math.max(0,Math.min(items.length-1,(Number(regiePreviewIndex)||0)+dir));
    playRegiePreview(next);
    updateRegiePreviewControls();
  };

  window.renderRegiePreviewList=function(existing=null){
    ensureRegiePreviewControls();
    const box=$('#regiePreviewList'),video=$('#regiePreviewVideo'),now=$('#regiePreviewNow');
    if(!box)return;
    const items=existing||regieVideoItems();
    if(!items.length){
      box.innerHTML='<div class="help">Keine Videos im Regieplan gefunden.</div>';
      if(now)now.textContent='Noch kein Video ausgewaehlt.';
      updateRegiePreviewControls();
      return;
    }
    if(regiePreviewIndex>=items.length)regiePreviewIndex=0;
    box.innerHTML=items.map((item,i)=>`<div class="regiePreviewItem ${i===regiePreviewIndex?'active':''}" data-regie-preview-select="${i}" title="${esc(item.url||item.name||'')}"><div><b>${esc(item.name)}</b><span>${esc((item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||''))}</span></div></div>`).join('');
    $$('[data-regie-preview-select]').forEach(el=>el.addEventListener('click',()=>playRegiePreview(el.dataset.regiePreviewSelect)));
    updateRegiePreviewControls();
  };

  const oldPlayRegiePreview=window.playRegiePreview;
  window.playRegiePreview=function(index){
    oldPlayRegiePreview(index);
    ensureRegiePreviewControls();
    updateRegiePreviewControls();
  };

  const oldToggleRegiePreview=window.toggleRegiePreview;
  window.toggleRegiePreview=function(index){
    oldToggleRegiePreview(index);
    updateRegiePreviewControls();
  };

  ensureRegiePreviewControls();
})();

loadLocal();parseVersionMeta();applyCleanColorDefaults();render();loadServerVersions();loadPlayerClips();loadDefaultProjectFromServer(true);


/* V39: feste Audio-Links aus CONTENT/ALLGMEIN + Audio sauber in Audio/Ton einfügen */
(function(){
  const AUDIO_BASE='https://usa.derhacker.com/CONTENT/ALLGMEIN/';
  const STATIC_AUDIO=[
    {name:'Katja_B.mp3', mime:'audio/mpeg'},
    {name:'awards.mp3', mime:'audio/mpeg'},
    {name:'PLATZ_NEHMEN.wav', mime:'audio/wav'}
  ].map(a=>({
    name:a.name,
    mime:a.mime,
    type:a.mime,
    url:AUDIO_BASE+encodeURIComponent(a.name),
    relativePath:'CONTENT/ALLGMEIN/'+a.name,
    isLoop:false,
    source:'CONTENT/ALLGMEIN'
  }));

  function ext(name){return String(name||'').split('?')[0].split('#')[0].split('.').pop().toLowerCase()}
  function mimeFromName(name){
    const e=ext(name);
    if(e==='mp3')return'audio/mpeg';
    if(e==='wav'||e==='wave')return'audio/wav';
    if(e==='m4a')return'audio/mp4';
    if(e==='aac')return'audio/aac';
    if(e==='ogg')return'audio/ogg';
    if(e==='mp4'||e==='m4v'||e==='mov'||e==='webm')return e==='webm'?'video/webm':'video/mp4';
    return'application/octet-stream';
  }
  function isAudioClip(clip){
    const t=String(clip?.mime||clip?.type||mimeFromName(clip?.name||clip?.url||'')).toLowerCase();
    return t.startsWith('audio/')||['mp3','wav','wave','m4a','aac','ogg','flac'].includes(ext(clip?.name||clip?.url||''));
  }
  function clipUrl(clip){return String(clip?.url||clip?.remoteUrl||'')}
  function mergeStaticAudio(clips){
    const merged=[...(clips||[])];
    for(const a of STATIC_AUDIO){
      const exists=merged.some(c=>clipUrl(c).toLowerCase()===a.url.toLowerCase()||String(c.name||'').toLowerCase()===a.name.toLowerCase());
      if(!exists)merged.push(a);
    }
    return merged;
  }
  function renderPlayerClipListV39(){
    const box=document.getElementById('playerClipList');
    if(!box)return;
    box.innerHTML=(playerClips||[]).map((clip,i)=>{
      const audio=isAudioClip(clip);
      const label=audio?'Audio':'Video';
      const path=clip.relativePath||clip.url||'';
      return `<div class="clipItem ${audio?'audioClipItem':''}"><div><b>${esc(clip.name||'Medium')}</b><span>${label} · ${esc(path)}${clip.isLoop?' · LOOP':''}</span></div><button class="mini" data-insert-player-clip="${i}">Einfügen</button></div>`;
    }).join('')||'<div class="help">Keine Medien gefunden.</div>';
    $$('[data-insert-player-clip]').forEach(b=>b.addEventListener('click',()=>insertPlayerClip(b.dataset.insertPlayerClip)));
  }

  playerClipMedia=function(clip){
    const type=clip.mime||clip.type||mimeFromName(clip.name||clip.url||'');
    return {
      name:clip.name||'Medium',
      type:type,
      mime:type,
      url:clip.url,
      remoteUrl:clip.url,
      thumb:clip.thumbnail||'',
      remote:true,
      isLoop:!!clip.isLoop,
      loop:!!clip.isLoop,
      relativePath:clip.relativePath||'',
      source:clip.source||'player-playlist'
    };
  };

  insertPlayerClip=function(index){
    const clip=playerClips[Number(index)];
    const row=currentTargetRow();
    if(!clip||!row){alert('Bitte zuerst eine Regiezeile auswählen oder anlegen.');return}
    const media=playerClipMedia(clip);
    if(isAudioClip(clip)){
      row.soundMedia=media;
      row.sound=(row.sound||clip.name||media.name).trim()||media.name;
      state.activeRowId=row.id;
      autoExpandMediaColumn('sound',media,row.id);
      render();
      setPlayerStatus('Audio eingefügt in Audio / Ton: '+media.name);
      return;
    }
    const screen=state.screens&&state.screens[0];
    if(!screen){alert('Bitte zuerst eine Screen-Spalte anlegen.');return}
    if(!row.screens)row.screens={};
    if(!row.screens[screen.id])row.screens[screen.id]={text:'',media:null};
    row.screens[screen.id].media=media;
    row.screens[screen.id].text=(row.screens[screen.id].text||clip.name||media.name).trim()||media.name;
    state.activeRowId=row.id;
    autoExpandMediaColumn('screen:'+screen.id,media,row.id);
    render();
    setPlayerStatus('Video eingefügt in aktive Zeile: '+media.name);
  };

  loadPlayerClips=async function(){
    try{
      const data=await serverFetch('/api/player-playlist');
      playerClips=mergeStaticAudio(data.clips||[]);
      renderPlayerClipListV39();
      setPlayerStatus(`${playerClips.length} Player-Medien geladen, inklusive 3 Audio-Links aus CONTENT/ALLGMEIN.`);
    }catch(err){
      console.warn(err);
      playerClips=mergeStaticAudio([]);
      renderPlayerClipListV39();
      setPlayerStatus('Player-Playlist nicht erreichbar. 3 Audio-Dateien aus CONTENT/ALLGMEIN sind direkt verlinkt.');
    }
  };

  const h2=[...document.querySelectorAll('#sec-server h2')].find(x=>x.textContent.trim()==='Player-Videos');
  if(h2)h2.textContent='Player-Medien';
  const btn=document.getElementById('playerRefreshBtn');
  if(btn)btn.textContent='Player-Medien laden';
  const style=document.createElement('style');
  style.textContent=`.clipItem.audioClipItem{border-color:rgba(201,255,25,.24);background:rgba(201,255,25,.045)}.clipItem.audioClipItem .mini{border-color:rgba(201,255,25,.38);color:var(--lime)}`;
  document.head.appendChild(style);
})();


/* V40: Audio-Links wirklich abspielbar machen: absolute URLs, Audio-Modal mit Source/Fallback, Player-Medien nach Override neu laden */
(function(){
  const AUDIO_BASE='https://usa.derhacker.com/CONTENT/ALLGMEIN/';
  const AUDIO_FILES={
    'Katja_B.mp3':'audio/mpeg',
    'awards.mp3':'audio/mpeg',
    'PLATZ_NEHMEN.wav':'audio/wav'
  };
  function audioExt(name){return String(name||'').split('?')[0].split('#')[0].split('.').pop().toLowerCase()}
  function audioMime(name,type){
    const t=String(type||'').toLowerCase();
    if(t.startsWith('audio/'))return t;
    const e=audioExt(name);
    if(e==='mp3')return'audio/mpeg';
    if(e==='wav'||e==='wave')return'audio/wav';
    if(e==='m4a')return'audio/mp4';
    if(e==='aac')return'audio/aac';
    if(e==='ogg')return'audio/ogg';
    if(e==='flac')return'audio/flac';
    return'audio/mpeg';
  }
  function absAudioUrl(nameOrUrl){
    let s=String(nameOrUrl||'').trim();
    if(!s)return'';
    if(/^https?:\/\//i.test(s))return s;
    s=s.replace(/^\/+/, '');
    if(s.startsWith('CONTENT/ALLGMEIN/'))s=s.slice('CONTENT/ALLGMEIN/'.length);
    return AUDIO_BASE+s.split('/').map(encodeURIComponent).join('/');
  }
  function isKnownAudioName(name){return Object.keys(AUDIO_FILES).some(n=>n.toLowerCase()===String(name||'').toLowerCase())}
  function isAudioMedia(m){
    const t=String(m?.type||m?.mime||'').toLowerCase();
    return t.startsWith('audio/')||['mp3','wav','wave','m4a','aac','ogg','flac'].includes(audioExt(m?.name||m?.url||m?.remoteUrl||''));
  }
  function normalizeAudioMedia(m){
    if(!m||!isAudioMedia(m))return m;
    const name=(window.cleanMediaName?cleanMediaName(m.name):String(m.name||'Audio'));
    let src=m.remoteUrl||m.url||'';
    if(!src && (m.source==='CONTENT/ALLGMEIN'||String(m.relativePath||'').startsWith('CONTENT/ALLGMEIN/')||isKnownAudioName(name))){
      src=absAudioUrl(m.relativePath||name);
    }
    if(src && !/^data:/i.test(src) && !src.startsWith('blob:'))src=absAudioUrl(src);
    m.name=name;
    m.type=audioMime(name,m.type||m.mime);
    m.mime=m.type;
    if(src){m.url=src;m.remoteUrl=src;m.remote=true;m.source=m.source||'CONTENT/ALLGMEIN';}
    return m;
  }

  const prevHydrate=window.hydrateMediaSource;
  window.hydrateMediaSource=async function(m){
    normalizeAudioMedia(m);
    if(m&&isAudioMedia(m)&&(m.remoteUrl||m.url||m.data))return m.remoteUrl||m.url||m.data;
    return prevHydrate?await prevHydrate(m):'';
  };

  const prevPlayerClipMedia=window.playerClipMedia;
  window.playerClipMedia=function(clip){
    let m=prevPlayerClipMedia?prevPlayerClipMedia(clip):{
      name:clip?.name||'Audio',type:clip?.mime||clip?.type||audioMime(clip?.name),mime:clip?.mime||clip?.type||audioMime(clip?.name),url:clip?.url,remoteUrl:clip?.url,remote:true
    };
    return normalizeAudioMedia(m);
  };

  window.openMediaModal=async function(m,rowId=null,sid=null){
    normalizeAudioMedia(m);
    let modal=$('#mediaModal'),body=$('#mediaModalBody'),title=$('#mediaModalTitle');if(!modal||!body)return;
    title.textContent=m.name||'';
    let type=m.type||'',src=await hydrateMediaSource(m);
    if(!src&&(type.startsWith('video/')||type.startsWith('audio/'))){
      body.innerHTML=`<div class="mediaModalMissing"><b>${esc(m.name||'Mediendatei')}</b><div>Die Mediendatei wurde nicht gefunden. Wähle sie einmal neu aus oder prüfe den Serverpfad.</div><div class="mediaModalActions"><button class="btn primary" id="modalRelinkMedia">Datei wählen</button><button class="btn" id="modalCloseHint">Schließen</button></div></div>`;
      setTimeout(()=>{let rb=$('#modalRelinkMedia');if(rb)rb.onclick=()=>pickMediaFor(rowId,sid);let cb=$('#modalCloseHint');if(cb)cb.onclick=()=>closeMediaModal();},0);
    }else if(type.startsWith('video/')){
      body.innerHTML=`<video src="${esc(src)}" controls autoplay playsinline preload="auto"></video>`;
    }else if(type.startsWith('image/')){
      body.innerHTML=`<img src="${esc(src)}" alt="${esc(m.name)}">`;
    }else if(type.startsWith('audio/')){
      body.innerHTML=`<div class="audioModalBox"><audio id="modalAudioPlayer" controls autoplay preload="auto"><source src="${esc(src)}" type="${esc(type)}"></audio><div class="audioModalHint">${esc(m.name||'Audio')}<br><a href="${esc(src)}" target="_blank" rel="noopener">Audio direkt öffnen</a></div></div>`;
      setTimeout(()=>{const a=document.getElementById('modalAudioPlayer');if(a){a.removeAttribute('crossorigin');a.load();const p=a.play();if(p&&p.catch)p.catch(()=>{});a.addEventListener('error',()=>{const h=document.querySelector('.audioModalHint');if(h)h.insertAdjacentHTML('beforeend','<br><span style="color:#ffb84d">Browser kann die Datei nicht direkt laden. Link testweise direkt öffnen.</span>');},{once:true});}},0);
    }else body.innerHTML=`<div class="help">${esc(m.name||'Datei')}</div>`;
    modal.classList.add('show');
  };

  const style=document.createElement('style');
  style.textContent=`
    .audioModalBox{width:min(760px,82vw);display:grid;gap:12px;align-items:center;justify-items:stretch}
    .audioModalBox audio{width:100%!important;height:48px}
    .audioModalHint{font-size:12px;line-height:1.4;color:var(--muted);word-break:break-all}
    .audioModalHint a{color:var(--lime);text-decoration:none;font-weight:900}
  `;
  document.head.appendChild(style);

  function fixExistingAudioLinks(){
    (state.rows||[]).forEach(r=>{
      if(r.soundMedia)normalizeAudioMedia(r.soundMedia);
    });
  }
  fixExistingAudioLinks();
  try{render();}catch(e){}
  try{if(typeof loadPlayerClips==='function')loadPlayerClips();}catch(e){}
})();



/* V45: Druckansicht - Screen/Walls nur als Dateinamen, ohne Vorschaubilder */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    @media print{
      .col-screen .mediaDrop.hasMedia{
        min-height:0!important;
        height:auto!important;
        max-height:none!important;
        overflow:visible!important;
        padding:0!important;
        border:0!important;
        background:transparent!important;
        box-shadow:none!important;
      }
      .col-screen .mediaPreview{
        display:block!important;
        width:100%!important;
        min-width:0!important;
        height:auto!important;
        min-height:0!important;
        max-height:none!important;
        padding:0!important;
        margin:0!important;
        background:transparent!important;
        border:0!important;
        box-shadow:none!important;
        overflow:visible!important;
      }
      .col-screen .mediaThumb,
      .col-screen .mediaThumb img,
      .col-screen .mediaThumb video,
      .col-screen .mediaBadge,
      .col-screen .mediaTools,
      .col-screen .mediaMeta{
        display:none!important;
      }
      .col-screen .mediaThumbStack,
      .col-screen .mediaLabelRow{
        display:block!important;
        width:100%!important;
        min-width:0!important;
        height:auto!important;
        min-height:0!important;
        max-height:none!important;
        padding:0!important;
        margin:0!important;
        background:transparent!important;
        overflow:visible!important;
      }
      .col-screen .mediaTitle{
        display:block!important;
        width:100%!important;
        max-width:none!important;
        white-space:normal!important;
        overflow:visible!important;
        text-overflow:clip!important;
        word-break:break-word!important;
        overflow-wrap:anywhere!important;
        color:#000!important;
        font-size:9px!important;
        line-height:1.2!important;
        font-weight:700!important;
      }
      .col-screen .mediaDrop:not(.hasMedia) .mediaText{
        display:block!important;
        height:auto!important;
        max-height:none!important;
        white-space:normal!important;
        overflow:visible!important;
        color:#000!important;
      }
      .col-screen .mediaAdd,
      .col-screen .mediaFileInput{
        display:none!important;
      }
    }
  `;
  document.head.appendChild(style);
})();


/* V46: Vorschau-Bilder/Videos immer komplett anzeigen + Screen-Spalte automatisch breiter setzen */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .col-screen .mediaDrop.hasMedia{
      min-height:184px!important;
      height:calc(var(--row-h,calc(210px * var(--zoom))) - calc(14px * var(--zoom)))!important;
      max-height:none!important;
    }
    .col-screen .mediaPreview{
      grid-template-columns:minmax(0,1fr) auto!important;
    }
    .col-screen .mediaThumb{
      min-height:118px!important;
      max-height:calc(var(--row-h,210px) - 52px)!important;
      background:#020303!important;
      display:grid!important;
      place-items:center!important;
    }
    .col-screen .mediaThumb img,
    .col-screen .mediaThumb video{
      width:100%!important;
      height:100%!important;
      object-fit:contain!important;
      object-position:center center!important;
      background:#020303!important;
    }
    .col-screen .mediaTitle{
      max-width:100%!important;
    }
    @media(max-width:1200px){
      .col-screen .mediaDrop.hasMedia{min-height:158px!important;}
      .col-screen .mediaThumb{min-height:96px!important;}
    }
  `;
  document.head.appendChild(style);

  const previousReadMedia=window.readMedia || readMedia;
  window.readMedia=async function(file){
    const media=await previousReadMedia(file);
    try{
      if((media.type||'').startsWith('image/') && (media.data||media.thumb)){
        const img=new Image();
        const src=media.data||media.thumb;
        await new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;img.src=src;});
        if(img.naturalWidth&&img.naturalHeight){media.width=img.naturalWidth;media.height=img.naturalHeight;media.aspect=img.naturalWidth/img.naturalHeight;}
      }
      if((media.type||'').startsWith('video/') && media.url){
        const v=document.createElement('video');
        v.preload='metadata'; v.muted=true; v.playsInline=true; v.src=media.url;
        await new Promise(resolve=>{v.onloadedmetadata=resolve;v.onerror=resolve;setTimeout(resolve,1200);});
        if(v.videoWidth&&v.videoHeight){media.width=v.videoWidth;media.height=v.videoHeight;media.aspect=v.videoWidth/v.videoHeight;}
      }
    }catch(e){}
    return media;
  };

  const previousAutoExpand=window.autoExpandMediaColumn || autoExpandMediaColumn;
  window.autoExpandMediaColumn=function(colId,media,rowId){
    const kind=mediaKind(media);
    if(colId && String(colId).startsWith('screen:') && (kind==='VIDEO'||kind==='BILD')){
      const aspect=Math.max(0.45,Math.min(4.2,Number(media?.aspect||media?.width&&media?.height?media.width/media.height:16/9)||16/9));
      const targetH=210;
      const previewH=targetH-52;
      const fitWidth=Math.round(previewH*aspect+150);
      const targetW=Math.max(700,Math.min(980,fitWidth));
      if(colWidth({id:colId,type:'screen'})<targetW)setColWidth(colId,targetW);
      if(rowId){
        const r=state.rows.find(x=>x.id===rowId);
        if(r && rowHeight(r)<targetH)setRowHeight(rowId,targetH);
      }
      return;
    }
    return previousAutoExpand(colId,media,rowId);
  };
})();

/* ---- script block 2 ---- */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .col-screen .mediaDrop.hasMedia{
      min-height:142px!important;
      height:calc(var(--row-h,calc(162px * var(--zoom))) - calc(14px * var(--zoom)))!important;
      max-height:none!important;
    }
    .col-screen .mediaPreview{
      grid-template-columns:minmax(0,1fr) auto!important;
      gap:9px!important;
    }
    .col-screen .mediaThumb{
      min-height:76px!important;
      max-height:calc(var(--row-h,162px) - 50px)!important;
      aspect-ratio:16/9!important;
      width:100%!important;
      background:#020303!important;
      display:grid!important;
      place-items:center!important;
    }
    .col-screen .mediaThumb img,
    .col-screen .mediaThumb video{
      width:100%!important;
      height:100%!important;
      object-fit:contain!important;
      object-position:center center!important;
      background:#020303!important;
    }
    .col-screen .mediaTitle{
      max-width:100%!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
    }
    @media(max-width:1200px){
      .col-screen .mediaDrop.hasMedia{min-height:124px!important;}
      .col-screen .mediaThumb{min-height:64px!important;}
    }
  `;
  document.head.appendChild(style);

  function hasScreenMedia(row){
    return !!Object.values(row?.screens||{}).some(s=>s&&s.media);
  }
  function capScreenWidthsAndRows(){
    if(!window.state)return false;
    state.colWidths=state.colWidths||{};
    let changed=false;
    (state.screens||[]).forEach(s=>{
      const id='screen:'+s.id;
      if(!state.colWidths[id] || state.colWidths[id]>540){state.colWidths[id]=520;changed=true;}
    });
    state.rowHeights=state.rowHeights||{};
    (state.rows||[]).forEach(r=>{
      if(!r?.isBlock && hasScreenMedia(r) && (!state.rowHeights[r.id] || state.rowHeights[r.id]>178)){
        state.rowHeights[r.id]=162; changed=true;
      }
    });
    return changed;
  }

  const oldDefaultColumnWidth=window.defaultColumnWidth || defaultColumnWidth;
  window.defaultColumnWidth=function(c){
    if(c && c.type==='screen')return 520;
    return oldDefaultColumnWidth(c);
  };

  const oldAutoExpand=window.autoExpandMediaColumn || autoExpandMediaColumn;
  window.autoExpandMediaColumn=function(colId,media,rowId){
    const kind=mediaKind(media);
    if(colId && String(colId).startsWith('screen:') && (kind==='VIDEO'||kind==='BILD')){
      if(colWidth({id:colId,type:'screen'})<300)setColWidth(colId,300);
      if(rowId){
        const r=state.rows.find(x=>x.id===rowId);
        if(r && rowHeight(r)<162)setRowHeight(rowId,162);
      }
      return;
    }
    return oldAutoExpand(colId,media,rowId);
  };

  async function makeContainVideoThumb(src){
    return new Promise(resolve=>{
      try{
        const video=document.createElement('video');
        video.preload='metadata'; video.muted=true; video.playsInline=true; video.src=src;
        let done=false;
        const finish=v=>{if(done)return;done=true;resolve(v||'')};
        video.addEventListener('loadeddata',()=>{try{video.currentTime=Math.min(1,Math.max(.1,(video.duration||1)/3));}catch(e){finish('')}});
        video.addEventListener('seeked',()=>{
          try{
            const cw=320,ch=180, vw=video.videoWidth||cw, vh=video.videoHeight||ch;
            const canvas=document.createElement('canvas'); canvas.width=cw; canvas.height=ch;
            const ctx=canvas.getContext('2d'); ctx.fillStyle='#020303'; ctx.fillRect(0,0,cw,ch);
            const scale=Math.min(cw/vw,ch/vh); const dw=vw*scale, dh=vh*scale;
            ctx.drawImage(video,(cw-dw)/2,(ch-dh)/2,dw,dh);
            finish(canvas.toDataURL('image/jpeg',.82));
          }catch(e){finish('')}
        });
        video.addEventListener('error',()=>finish(''));
        setTimeout(()=>finish(''),2200);
      }catch(e){resolve('')}
    });
  }

  const oldReadMedia=window.readMedia || readMedia;
  window.readMedia=async function(file){
    const media=await oldReadMedia(file);
    try{
      if((media.type||'').startsWith('video/') && media.url){
        const thumb=await makeContainVideoThumb(media.url);
        if(thumb)media.thumb=thumb;
      }
    }catch(e){}
    return media;
  };

  setTimeout(()=>{if(capScreenWidthsAndRows()){try{render();}catch(e){}}},0);
})();

/* ---- script block 3 ---- */
(function(){
  const AUDIO_BASE='https://usa.derhacker.com/CONTENT/ALLGMEIN/';
  const STATIC_AUDIO=[
    {name:'Katja_B.mp3', mime:'audio/mpeg'},
    {name:'awards.mp3', mime:'audio/mpeg'},
    {name:'PLATZ_NEHMEN.wav', mime:'audio/wav'}
  ].map(a=>({
    name:a.name,
    mime:a.mime,
    type:a.mime,
    url:AUDIO_BASE+a.name.split('/').map(encodeURIComponent).join('/'),
    remoteUrl:AUDIO_BASE+a.name.split('/').map(encodeURIComponent).join('/'),
    relativePath:'CONTENT/ALLGMEIN/'+a.name,
    remote:true,
    source:'CONTENT/ALLGMEIN',
    isAudio:true
  }));

  const style=document.createElement('style');
  style.textContent=`
    .col-screen .mediaDrop.hasMedia{
      min-height:178px!important;
      height:calc(var(--row-h,calc(202px * var(--zoom))) - calc(14px * var(--zoom)))!important;
      max-height:none!important;
      overflow:hidden!important;
    }
    .col-screen .mediaPreview{
      grid-template-columns:minmax(0,1fr) auto!important;
      align-items:stretch!important;
      gap:9px!important;
      height:100%!important;
      min-height:0!important;
    }
    .col-screen .mediaThumbStack{
      display:grid!important;
      grid-template-rows:minmax(0,1fr) auto!important;
      gap:8px!important;
      min-height:0!important;
      overflow:hidden!important;
      width:100%!important;
    }
    .col-screen .mediaThumb{
      min-height:0!important;
      height:100%!important;
      max-height:none!important;
      aspect-ratio:auto!important;
      width:100%!important;
      display:grid!important;
      place-items:center!important;
      background:#020303!important;
      overflow:hidden!important;
    }
    .col-screen .mediaThumb img,
    .col-screen .mediaThumb video{
      width:100%!important;
      height:100%!important;
      object-fit:contain!important;
      object-position:center center!important;
      background:#020303!important;
      display:block!important;
    }
    .col-screen .mediaLabelRow{
      flex:0 0 auto!important;
      min-height:21px!important;
      height:auto!important;
      overflow:visible!important;
      align-items:center!important;
      padding-bottom:1px!important;
    }
    .col-screen .mediaTitle{
      display:block!important;
      white-space:nowrap!important;
      overflow:visible!important;
      text-overflow:clip!important;
      line-height:1.2!important;
      max-width:none!important;
    }
    .col-screen .mediaTools{align-self:center!important;}
    .regiePreviewAudio{display:none;width:100%;height:34px;}
    .regiePreviewItem{grid-template-columns:minmax(0,1fr)!important;}
    .regiePreviewAudioLine{margin-top:5px;padding-top:5px;border-top:1px solid rgba(201,255,25,.12);color:var(--muted);font-size:10px;line-height:1.25;display:flex;gap:6px;align-items:center;min-width:0;}
    .regiePreviewAudioLine b{font-size:9px;color:#071007;background:var(--lime);border-radius:999px;padding:2px 6px;line-height:1;flex:0 0 auto;}
    .regiePreviewAudioLine span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;}
    .clipGroupTitle{margin:8px 0 5px;color:var(--muted2);font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:900;}
    .clipItem.audioClipItem{border-color:rgba(201,255,25,.25)!important;background:rgba(201,255,25,.045)!important;}
    .clipItem.audioClipItem .mini{border-color:rgba(201,255,25,.42)!important;color:var(--lime)!important;}
    @media(max-width:1200px){
      .col-screen .mediaDrop.hasMedia{min-height:158px!important;}
    }
  `;
  document.head.appendChild(style);

  function ext(name){return String(name||'').split('?')[0].split('#')[0].split('.').pop().toLowerCase();}
  function mimeFromName(name,type){
    const t=String(type||'').toLowerCase();
    if(t.startsWith('audio/')||t.startsWith('video/')||t.startsWith('image/'))return t;
    const e=ext(name);
    if(e==='mp3')return'audio/mpeg';
    if(e==='wav'||e==='wave')return'audio/wav';
    if(e==='m4a')return'audio/mp4';
    if(e==='aac')return'audio/aac';
    if(e==='ogg')return'audio/ogg';
    if(e==='flac')return'audio/flac';
    if(e==='webm')return'video/webm';
    if(['mp4','m4v','mov'].includes(e))return'video/mp4';
    return'application/octet-stream';
  }
  function isAudioClip(clip){
    const type=String(clip?.mime||clip?.type||mimeFromName(clip?.name||clip?.url||'')).toLowerCase();
    return type.startsWith('audio/')||['mp3','wav','wave','m4a','aac','ogg','flac'].includes(ext(clip?.name||clip?.url||''));
  }
  function absAudioUrl(nameOrUrl){
    let s=String(nameOrUrl||'').trim();
    if(!s)return'';
    if(/^https?:\/\//i.test(s))return s;
    s=s.replace(/^\/+/, '');
    if(s.startsWith('CONTENT/ALLGMEIN/'))s=s.slice('CONTENT/ALLGMEIN/'.length);
    return AUDIO_BASE+s.split('/').map(encodeURIComponent).join('/');
  }
  function clipUrl(clip){return String(clip?.url||clip?.remoteUrl||'');}
  function mergeStaticAudio(clips){
    const merged=[...(clips||[])];
    for(const a of STATIC_AUDIO){
      const exists=merged.some(c=>clipUrl(c).toLowerCase()===a.url.toLowerCase()||String(c.name||'').toLowerCase()===a.name.toLowerCase());
      if(!exists)merged.push({...a});
    }
    return merged;
  }
  function normalizeAudioMedia(m){
    if(!m)return m;
    const type=mimeFromName(m.name||m.url||m.remoteUrl,m.type||m.mime);
    if(!type.startsWith('audio/'))return m;
    let src=m.remoteUrl||m.url||'';
    if(!src || (!/^https?:\/\//i.test(src)&&!/^data:/i.test(src)&&!/^blob:/i.test(src)))src=absAudioUrl(src||m.relativePath||m.name);
    m.name=(window.cleanMediaName?cleanMediaName(m.name):String(m.name||'Audio'));
    m.type=type;m.mime=type;m.url=src;m.remoteUrl=src;m.remote=true;m.source=m.source||'CONTENT/ALLGMEIN';
    return m;
  }
  function firstScreenVideoForRow(r){
    for(const s of (state.screens||[])){
      const m=r?.screens?.[s.id]?.media;
      if(m&&(m.type||'').startsWith('video/'))return {screen:s.id,media:m};
    }
    return null;
  }
  function audioForVideoItem(item){
    const r=(state.rows||[]).find(x=>x.id===item?.rowId);
    return normalizeAudioMedia(r?.soundMedia||null);
  }
  function hydrateSync(m){
    if(!m)return'';
    normalizeAudioMedia(m);
    return m.remoteUrl||m.url||m.data||'';
  }
  function ensurePreviewAudio(){
    const video=document.getElementById('regiePreviewVideo');
    if(!video)return null;
    let audio=document.getElementById('regiePreviewAudio');
    if(!audio){
      audio=document.createElement('audio');
      audio.id='regiePreviewAudio';
      audio.className='regiePreviewAudio';
      audio.preload='auto';
      audio.controls=false;
      audio.loop=false;
      video.insertAdjacentElement('afterend',audio);
      video.addEventListener('play',()=>{if(audio.src)audio.play().catch(()=>{});});
      video.addEventListener('pause',()=>{if(!audio.paused)audio.pause();});
      video.addEventListener('seeking',()=>{try{if(audio.src)audio.currentTime=video.currentTime||0;}catch(e){}});
      video.addEventListener('timeupdate',()=>{try{if(audio.src&&Math.abs((audio.currentTime||0)-(video.currentTime||0))>.45)audio.currentTime=video.currentTime||0;}catch(e){}});
      video.addEventListener('ended',()=>{if(!audio.paused)audio.pause();});
    }
    return audio;
  }
  function loadPreviewAudioForItem(item,autoplay){
    const audio=ensurePreviewAudio();
    if(!audio)return;
    const m=audioForVideoItem(item);
    const src=hydrateSync(m);
    if(src){
      if(audio.src!==src){audio.src=src;audio.load();}
      audio.loop=false;
      audio.style.display='block';
      try{audio.currentTime=0;}catch(e){}
      if(autoplay)audio.play().catch(()=>{});
    }else{
      if(!audio.paused)audio.pause();
      audio.removeAttribute('src');
      audio.style.display='none';
    }
  }

  window.regieVideoItems=function(){
    const items=[];
    let last='';
    (state.rows||[]).forEach((r,rowIndex)=>{
      if(r.isBlock)return;
      const found=firstScreenVideoForRow(r);
      if(!found)return;
      const m=found.media;
      const key=(window.normalizeMediaKey?normalizeMediaKey(m):String(m.remoteUrl||m.url||m.data||m.name||'').toLowerCase());
      if(!key||key===last)return;
      last=key;
      const audio=normalizeAudioMedia(r.soundMedia||null);
      items.push({rowId:r.id,rowIndex,name:m.name||'Video',url:m.remoteUrl||m.url||m.data||'',screen:found.screen,start:r.start||'',what:r.what||'',key,loop:!!(m.isLoop||m.loop),audioName:audio?.name||'',audioUrl:audio?.remoteUrl||audio?.url||audio?.data||''});
    });
    return items;
  };

  window.playRegiePreview=function(index){
    const items=regieVideoItems(),video=document.getElementById('regiePreviewVideo'),now=document.getElementById('regiePreviewNow');
    if(!video||!items.length)return;
    regiePreviewIndex=Math.max(0,Math.min(items.length-1,Number(index)||0));
    const item=items[regiePreviewIndex];
    if(video.src!==item.url)video.src=item.url;
    video.loop=!!item.loop;
    loadPreviewAudioForItem(item,true);
    video.play().catch(()=>{});
    if(now)now.textContent=(item.start?item.start+' · ':'')+item.name+(item.audioName?' + '+item.audioName:'');
    renderRegiePreviewList(items);
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };

  window.toggleRegiePreview=function(index){
    const video=document.getElementById('regiePreviewVideo');
    const items=regieVideoItems();
    if(!video)return;
    if(Number(index)!==regiePreviewIndex||!video.src){playRegiePreview(index);return;}
    const item=items[regiePreviewIndex];
    const audio=ensurePreviewAudio();
    if(video.paused){loadPreviewAudioForItem(item,true);video.play().catch(()=>{});}else{video.pause();if(audio&&!audio.paused)audio.pause();}
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };

  window.renderRegiePreviewList=function(existing=null){
    const box=document.getElementById('regiePreviewList'),video=document.getElementById('regiePreviewVideo'),now=document.getElementById('regiePreviewNow');
    if(!box)return;
    const items=existing||regieVideoItems();
    if(!items.length){
      box.innerHTML='<div class="help">Keine Videos im Regieplan gefunden.</div>';
      if(now)now.textContent='Noch kein Video ausgewählt.';
      if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
      return;
    }
    if(regiePreviewIndex>=items.length)regiePreviewIndex=0;
    box.innerHTML=items.map((item,i)=>{
      const audio=item.audioName?`<div class="regiePreviewAudioLine"><b>AUDIO</b><span>${esc(item.audioName)}</span></div>`:'';
      return `<div class="regiePreviewItem ${i===regiePreviewIndex?'active':''}" data-regie-preview-select="${i}" title="${esc(item.url||item.name||'')}"><div><b>${esc(item.name)}</b><span>${esc((item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||''))}</span>${audio}</div></div>`;
    }).join('');
    $$('[data-regie-preview-select]').forEach(el=>el.addEventListener('click',()=>playRegiePreview(el.dataset.regiePreviewSelect)));
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };

  const oldMedia=window.media || media;
  window.media=function(m,rowId,sid){
    if(!m)return'';
    const kind=mediaKind(m), type=String(m.type||'');
    const av=(type.startsWith('video/')||type.startsWith('audio/')),stored=!!m.mediaKey,remote=!!(m.remote||m.remoteUrl),missing=(!m.data&&!m.url&&!m.remoteUrl&&av&&!stored&&!remote);
    const audioClass=type.startsWith('audio/')?' audioThumb':'';
    const title=missing?'Datei erneut auswählen':'Datei öffnen';
    const src=m.remoteUrl||m.url||m.data||'';
    const label=missing?'FEHLT':(remote?'LINK':kind);
    let thumbHtml;
    if(type.startsWith('video/') && src){
      thumbHtml=`<video src="${esc(src)}" muted playsinline preload="metadata"></video>`;
    }else{
      thumbHtml=`<img src="${mediaThumb(m)}" alt="${kind}">`;
    }
    const fullName=String(m.name||'Datei');
    const displayName=(window.cleanMediaName?cleanMediaName(fullName):fullName);
    return `<div class="mediaPreview" data-open-media="${rowId}|${sid}" data-missing="${missing?1:0}" data-stored="${stored?1:0}" data-remote="${remote?1:0}" title="${esc(fullName)}"><div class="mediaThumbStack"><div class="mediaThumb${audioClass}">${thumbHtml}</div><div class="mediaLabelRow"><span class="mediaBadge">${label}</span><span class="mediaTitle">${esc(displayName)}</span></div></div><div class="mediaMeta"></div><div class="mediaTools"><button class="mediaTool replace" type="button" title="Datei ersetzen" data-pick-media="${rowId}|${sid}">Reload</button><button class="mediaTool" type="button" title="Datei entfernen" data-clear-media="${rowId}|${sid}">X</button></div></div>`;
  };

  const oldDefaultColumnWidth=window.defaultColumnWidth || defaultColumnWidth;
  window.defaultColumnWidth=function(c){if(c&&c.type==='screen')return 520;return oldDefaultColumnWidth(c);};
  const oldAutoExpand=window.autoExpandMediaColumn || autoExpandMediaColumn;
  window.autoExpandMediaColumn=function(colId,media,rowId){
    const kind=mediaKind(media);
    if(colId&&String(colId).startsWith('screen:')&&(kind==='VIDEO'||kind==='BILD')){
      if(colWidth({id:colId,type:'screen'})<300)setColWidth(colId,300);
      if(rowId){const r=state.rows.find(x=>x.id===rowId);if(r&&rowHeight(r)<202)setRowHeight(rowId,202);}
      return;
    }
    return oldAutoExpand(colId,media,rowId);
  };

  window.playerClipMedia=function(clip){
    const type=clip?.mime||clip?.type||mimeFromName(clip?.name||clip?.url||'');
    const m={name:clip?.name||'Medium',type,mime:type,url:clip?.url||clip?.remoteUrl||'',remoteUrl:clip?.remoteUrl||clip?.url||'',thumb:clip?.thumbnail||clip?.thumb||'',remote:true,isLoop:!!clip?.isLoop,loop:!!clip?.isLoop,relativePath:clip?.relativePath||'',source:clip?.source||'player-playlist'};
    return isAudioClip(clip)?normalizeAudioMedia(m):m;
  };
  window.insertPlayerClip=function(index){
    const clip=playerClips[Number(index)],row=currentTargetRow();
    if(!clip||!row){alert('Bitte zuerst eine Regiezeile auswählen oder anlegen.');return;}
    const media=playerClipMedia(clip);
    if(isAudioClip(clip)){
      row.soundMedia=normalizeAudioMedia(media);
      row.sound=(row.sound||media.name).trim()||media.name;
      state.activeRowId=row.id;
      autoExpandMediaColumn('sound',row.soundMedia,row.id);
      render();
      setPlayerStatus('Audio-Spur eingefügt: '+media.name);
      return;
    }
    const screen=state.screens&&state.screens[0];
    if(!screen){alert('Bitte zuerst eine Screen-Spalte anlegen.');return;}
    if(!row.screens)row.screens={};
    if(!row.screens[screen.id])row.screens[screen.id]={text:'',media:null};
    row.screens[screen.id].media=media;
    row.screens[screen.id].text=(row.screens[screen.id].text||media.name).trim()||media.name;
    state.activeRowId=row.id;
    autoExpandMediaColumn('screen:'+screen.id,media,row.id);
    render();
    setPlayerStatus('Video eingefügt: '+media.name);
  };
  function renderPlayerClipListV48(){
    const box=document.getElementById('playerClipList');if(!box)return;
    const videos=(playerClips||[]).map((c,i)=>({c,i})).filter(x=>!isAudioClip(x.c));
    const audios=(playerClips||[]).map((c,i)=>({c,i})).filter(x=>isAudioClip(x.c));
    const renderItem=({c,i},audio)=>{const sub=audio&&c.regieRowIndex?`Zeile ${c.regieRowIndex}${c.regieRowTitle?' · '+c.regieRowTitle:''}`:(c.relativePath||c.url||'');return `<div class="clipItem ${audio?'audioClipItem':''}"><div><b>${esc(c.name||'Medium')}</b><span>${audio?'Audio-Spur':'Video'} · ${esc(sub)}${c.isLoop?' · LOOP':''}</span></div><button class="mini" data-insert-player-clip="${i}">Einfügen</button></div>`;}
    box.innerHTML=(videos.length?'<div class="clipGroupTitle">Videos / Loops</div>'+videos.map(x=>renderItem(x,false)).join(''):'')+(audios.length?'<div class="clipGroupTitle">Audio-Spuren</div>'+audios.map(x=>renderItem(x,true)).join(''):'')||'<div class="help">Keine Medien gefunden.</div>';
    $$('[data-insert-player-clip]').forEach(b=>b.addEventListener('click',()=>insertPlayerClip(b.dataset.insertPlayerClip)));
  }
  window.loadPlayerClips=async function(){
    try{
      const data=await serverFetch('/api/player-playlist');
      playerClips=mergeStaticAudio(data.clips||[]);
      renderPlayerClipListV48();
      const v=playerClips.filter(c=>!isAudioClip(c)).length,a=playerClips.filter(isAudioClip).length;
      setPlayerStatus(`${v} Video(s), ${a} Audio-Spur(en) geladen.`);
    }catch(err){
      console.warn(err);
      playerClips=mergeStaticAudio([]);
      renderPlayerClipListV48();
      setPlayerStatus('Player-Playlist nicht erreichbar. Audio-Spuren aus CONTENT/ALLGMEIN sind direkt verlinkt.');
    }
  };

  function normalizeExisting(){
    let changed=false;
    (state.rows||[]).forEach(r=>{
      if(r.soundMedia){normalizeAudioMedia(r.soundMedia);changed=true;}
      if(!r.isBlock && Object.values(r.screens||{}).some(s=>s&&s.media)){
        state.rowHeights=state.rowHeights||{};
        if(!state.rowHeights[r.id]||state.rowHeights[r.id]<202){state.rowHeights[r.id]=202;changed=true;}
      }
    });
    state.colWidths=state.colWidths||{};
    (state.screens||[]).forEach(s=>{const id='screen:'+s.id;if(!state.colWidths[id]||state.colWidths[id]>560){state.colWidths[id]=520;changed=true;}});
    return changed;
  }

  setTimeout(()=>{try{normalizeExisting();render();renderRegiePreviewList();loadPlayerClips();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 4 ---- */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    /* Nur Bildschirmansicht: Preview-Bild mittelgroß, vollständig sichtbar, Dateiname bleibt lesbar */
    @media screen{
      .col-screen .mediaDrop.hasMedia{
        min-height:142px!important;
        height:calc(var(--row-h,calc(156px * var(--zoom))) - calc(14px * var(--zoom)))!important;
        max-height:none!important;
        overflow:hidden!important;
        padding:7px 9px!important;
      }
      .col-screen .mediaPreview{
        grid-template-columns:minmax(0,1fr) auto!important;
        align-items:center!important;
        gap:9px!important;
        height:100%!important;
        min-height:0!important;
      }
      .col-screen .mediaThumbStack{
        display:grid!important;
        grid-template-rows:minmax(0,1fr) auto!important;
        gap:5px!important;
        min-height:0!important;
        width:100%!important;
        overflow:hidden!important;
      }
      .col-screen .mediaThumb{
        width:100%!important;
        min-width:150px!important;
        max-width:220px!important;
        height:100%!important;
        min-height:44px!important;
        max-height:118px!important;
        aspect-ratio:16/9!important;
        display:grid!important;
        place-items:center!important;
        background:#020303!important;
        overflow:hidden!important;
      }
      .col-screen .mediaThumb img,
      .col-screen .mediaThumb video{
        width:100%!important;
        height:100%!important;
        object-fit:contain!important;
        object-position:center center!important;
        background:#020303!important;
        display:block!important;
      }
      .col-screen .mediaLabelRow{
        min-height:21px!important;
        height:21px!important;
        overflow:hidden!important;
        align-items:center!important;
        width:100%!important;
      }
      .col-screen .mediaTitle{
        display:block!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important;
        line-height:1.15!important;
        max-width:100%!important;
        font-size:13px!important;
      }
      .col-screen .mediaTools{align-self:center!important;}
      @media(max-width:1200px){
        .col-screen .mediaDrop.hasMedia{min-height:124px!important;}
        .col-screen .mediaThumb{min-width:130px!important;max-width:200px!important;max-height:96px!important;}
      }
    }
  `;
  document.head.appendChild(style);

  function hasScreenMedia(row){
    return !!Object.values(row?.screens||{}).some(s=>s&&s.media);
  }
  function compactExistingScreenRows(){
    if(!window.state)return false;
    state.rowHeights=state.rowHeights||{};
    state.colWidths=state.colWidths||{};
    let changed=false;
    (state.rows||[]).forEach(r=>{
      if(!r?.isBlock && hasScreenMedia(r) && (!state.rowHeights[r.id] || state.rowHeights[r.id]>162)){
        state.rowHeights[r.id]=156;
        changed=true;
      }
    });
    (state.screens||[]).forEach(s=>{
      const id='screen:'+s.id;
      if(!state.colWidths[id] || state.colWidths[id]>320){state.colWidths[id]=300;changed=true;}
    });
    return changed;
  }

  const oldAutoExpand=window.autoExpandMediaColumn || autoExpandMediaColumn;
  window.autoExpandMediaColumn=function(colId,media,rowId){
    const kind=mediaKind(media);
    if(colId&&String(colId).startsWith('screen:')&&(kind==='VIDEO'||kind==='BILD')){
      if(colWidth({id:colId,type:'screen'})<300)setColWidth(colId,300);
      if(rowId){
        const r=state.rows.find(x=>x.id===rowId);
        if(r&&rowHeight(r)<156)setRowHeight(rowId,156);
      }
      return;
    }
    return oldAutoExpand(colId,media,rowId);
  };

  setTimeout(()=>{try{if(compactExistingScreenRows())render();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 5 ---- */
(function(){
  const AUDIO_BASE='https://usa.derhacker.com/CONTENT/ALLGMEIN/';
  const KNOWN_AUDIO={
    'katja_b.mp3':{name:'Katja_B.mp3',type:'audio/mpeg'},
    'awards.mp3':{name:'awards.mp3',type:'audio/mpeg'},
    'platz_nehmen.wav':{name:'PLATZ_NEHMEN.wav',type:'audio/wav'}
  };
  function audioKey(name){return String(name||'').split('/').pop().trim().toLowerCase();}
  function audioUrl(name){return AUDIO_BASE+String(name||'').split('/').pop().split('/').map(encodeURIComponent).join('/');}
  function normalizeKnownAudio(m){
    if(!m)return null;
    const key=audioKey(m.name||m.url||m.remoteUrl||m.relativePath);
    const known=KNOWN_AUDIO[key];
    if(!known)return m;
    const url=audioUrl(known.name);
    m.name=known.name; m.type=known.type; m.mime=known.type; m.url=url; m.remoteUrl=url; m.remote=true; m.localOnly=false; m.source='CONTENT/ALLGMEIN';
    return m;
  }
  function mediaFromKnownName(name){
    const known=KNOWN_AUDIO[audioKey(name)];
    if(!known)return null;
    const url=audioUrl(known.name);
    return {name:known.name,type:known.type,mime:known.type,url,remoteUrl:url,remote:true,localOnly:false,thumb:'',source:'CONTENT/ALLGMEIN'};
  }
  function dedupeAwardsPerCategory(){
    // V51: keine Audio-Deduplizierung mehr. Alle Audio-Einträge bleiben wie im importierten Regieplan.
    if(!window.state||!Array.isArray(state.rows))return false;
    let changed=false;
    state.rows.forEach(r=>{
      if(!r)return;
      if(r.soundMedia){normalizeKnownAudio(r.soundMedia);changed=true;}
      if(!r.soundMedia && /(Katja_B\.mp3|awards\.mp3|PLATZ_NEHMEN\.wav)/i.test(String(r.sound||''))){
        const m=mediaFromKnownName(String(r.sound||'').trim());
        if(m){r.soundMedia=m; changed=true;}
      }
    });
    return changed;
  }
    function audioClipsFromRegieplan(){
    const out=[];
    (state.rows||[]).forEach((r,idx)=>{
      if(!r||r.isBlock)return;
      let m=normalizeKnownAudio(r.soundMedia);
      if(!m && /(Katja_B\.mp3|awards\.mp3|PLATZ_NEHMEN\.wav)/i.test(String(r.sound||''))){
        m=mediaFromKnownName(String(r.sound||'').trim());
      }
      if(!m)return;
      const name=m.name||String(m.url||m.remoteUrl||'').split('/').pop()||'Audio';
      const url=m.remoteUrl||m.url||audioUrl(name);
      out.push({
        name:name,
        type:m.type||m.mime||mimeFromName(name)||'audio/mpeg',
        mime:m.mime||m.type||mimeFromName(name)||'audio/mpeg',
        url:url,
        remoteUrl:url,
        relativePath:'CONTENT/ALLGMEIN/'+name,
        remote:true,
        source:'Regieplan',
        isAudio:true,
        regieRowId:r.id,
        regieRowIndex:idx+1,
        regieRowTitle:String(r.what||'').trim()
      });
    });
    return out;
  }
    function mergeRegieplanAudios(clips){
    // V51: nicht deduplizieren; alle Audio-Einträge aus dem Regieplan anzeigen.
    const base=(clips||[]).filter(c=>c&&c.source!=='Regieplan');
    return base.concat(audioClipsFromRegieplan());
  }
    const oldLoad=window.loadPlayerClips;
  if(typeof oldLoad==='function'){
    window.loadPlayerClips=async function(){
      await oldLoad.apply(this,arguments);
      try{
        playerClips=mergeRegieplanAudios(playerClips);
        if(typeof renderPlayerClipListV50==='function')renderPlayerClipListV50();
        else if(typeof renderPlayerClipListV48==='function')renderPlayerClipListV48();
      }catch(e){console.warn(e);}
    };
  }
  window.renderPlayerClipListV50=function(){
    const box=document.getElementById('playerClipList'); if(!box)return;
    playerClips=mergeRegieplanAudios(playerClips||[]);
    const isA=c=>String(c?.type||c?.mime||'').startsWith('audio/')||['mp3','wav','wave','m4a','aac','ogg','flac'].includes(audioKey(c?.name||c?.url||'').split('.').pop());
    const videos=(playerClips||[]).map((c,i)=>({c,i})).filter(x=>!isA(x.c));
    const audios=(playerClips||[]).map((c,i)=>({c,i})).filter(x=>isA(x.c));
    const renderItem=({c,i},audio)=>{const sub=audio&&c.regieRowIndex?`Zeile ${c.regieRowIndex}${c.regieRowTitle?' · '+c.regieRowTitle:''}`:(c.relativePath||c.url||'');return `<div class="clipItem ${audio?'audioClipItem':''}"><div><b>${esc(c.name||'Medium')}</b><span>${audio?'Audio-Spur':'Video'} · ${esc(sub)}${c.isLoop?' · LOOP':''}</span></div><button class="mini" data-insert-player-clip="${i}">Einfügen</button></div>`;}
    box.innerHTML=(videos.length?'<div class="clipGroupTitle">Videos / Loops</div>'+videos.map(x=>renderItem(x,false)).join(''):'')+(audios.length?'<div class="clipGroupTitle">Audio-Spuren aus Regieplan · alle</div>'+audios.map(x=>renderItem(x,true)).join(''):'')||'<div class="help">Keine Medien gefunden.</div>';
    $$('[data-insert-player-clip]').forEach(b=>b.addEventListener('click',()=>insertPlayerClip(b.dataset.insertPlayerClip)));
  };
  const oldEnsure=window.ensurePreviewAudio;
  window.ensurePreviewAudio=function(){
    const audio=oldEnsure?oldEnsure():document.getElementById('regiePreviewAudio');
    if(audio)audio.loop=false;
    return audio;
  };
  const oldLoadAudio=window.loadPreviewAudioForItem;
  if(typeof oldLoadAudio==='function'){
    window.loadPreviewAudioForItem=function(item,autoplay){
      oldLoadAudio(item,autoplay);
      const a=document.getElementById('regiePreviewAudio');
      if(a)a.loop=false;
    };
  }
  const style=document.createElement('style');
  style.textContent=`
    .rowActionsHead,.rowActionsCell{width:calc(126px * var(--zoom))!important;min-width:calc(126px * var(--zoom))!important;max-width:calc(126px * var(--zoom))!important;}
    .rowActions{gap:5px!important;}
    .rowActionBtn.duplicate:hover{border-color:rgba(201,255,25,.75);background:rgba(201,255,25,.18);color:var(--lime);}
  `;
  document.head.appendChild(style);
  window.rowActions=function(r){return `<td class="rowActionsCell"><div class="rowActions"><button type="button" class="rowActionBtn duplicate" data-duplicate-row="${r.id}" title="Zeile duplizieren">DUP</button><button type="button" class="rowActionBtn dim" data-toggle-row-muted="${r.id}" title="Zeile ausgrauen/einblenden">${r.muted?'ON':'OFF'}</button><button type="button" class="rowActionBtn delete" data-delete-row="${r.id}" title="Zeile löschen">X</button></div></td>`};
  function cloneRow(row){
    const copy=JSON.parse(JSON.stringify(row));
    copy.id='row_'+(Math.random().toString(36).slice(2,9));
    if(copy.what)copy.what=copy.what;
    return copy;
  }
  document.addEventListener('click',function(e){
    const b=e.target.closest('[data-duplicate-row]');
    if(!b)return;
    e.preventDefault(); e.stopPropagation();
    const id=b.dataset.duplicateRow;
    const idx=state.rows.findIndex(r=>r.id===id);
    if(idx<0)return;
    const copy=cloneRow(state.rows[idx]);
    state.rows.splice(idx+1,0,copy);
    state.activeRowId=copy.id;
    recalc(Math.max(0,idx),true);
  },true);
  setTimeout(()=>{
    try{
      const changed=dedupeAwardsPerCategory();
      if(changed)saveLocal(false);
      if(changed)render(); else renderTable();
      try{playerClips=mergeRegieplanAudios(playerClips||[]);renderPlayerClipListV50();}catch(e){}
      const a=document.getElementById('regiePreviewAudio'); if(a)a.loop=false;
    }catch(e){console.warn(e);}
  },0);
})();

/* ---- script block 6 ---- */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    @media screen{
      .audioTonCol .mediaDrop.hasMedia{
        min-height:122px!important;
        height:auto!important;
        max-height:none!important;
        overflow:visible!important;
      }
      .audioTonCol .mediaPreview{
        grid-template-columns:minmax(0,1fr) auto!important;
        align-items:center!important;
        overflow:visible!important;
      }
      .audioTonCol .mediaThumbStack{
        overflow:visible!important;
        min-width:0!important;
      }
      .audioTonCol .mediaLabelRow{
        height:auto!important;
        min-height:22px!important;
        overflow:visible!important;
        align-items:flex-start!important;
      }
      .audioTonCol .mediaTitle{
        white-space:normal!important;
        overflow:visible!important;
        text-overflow:clip!important;
        display:block!important;
        -webkit-line-clamp:unset!important;
        -webkit-box-orient:initial!important;
        word-break:break-word!important;
        line-height:1.15!important;
        max-width:100%!important;
      }
      .col-screen .mediaPreview{
        grid-template-columns:minmax(0,1fr) auto!important;
      }
      .col-screen .mediaThumb{
        width:100%!important;
        min-width:130px!important;
        max-width:220px!important;
      }
    }
  `;
  document.head.appendChild(style);

  function shrinkScreenColumns(){
    if(!window.state)return false;
    state.colWidths=state.colWidths||{};
    let changed=false;
    (state.screens||[]).forEach(s=>{
      const id='screen:'+s.id;
      if(!state.colWidths[id] || state.colWidths[id]>320){
        state.colWidths[id]=300;
        changed=true;
      }
    });
    return changed;
  }
  setTimeout(()=>{try{if(shrinkScreenColumns())render();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 7 ---- */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    @media screen{
      .audioTonCol .mediaDrop.hasMedia{
        min-height:96px!important;
        height:auto!important;
        max-height:none!important;
        overflow:visible!important;
      }
      .audioTonCol .mediaPreview{
        display:grid!important;
        grid-template-columns:minmax(0,1fr) auto!important;
        grid-template-areas:"thumb tools" "name name"!important;
        gap:6px 8px!important;
        align-items:center!important;
        overflow:visible!important;
      }
      .audioTonCol .mediaThumbStack{
        grid-area:thumb!important;
        min-width:0!important;
        overflow:hidden!important;
        display:flex!important;
        align-items:center!important;
        gap:8px!important;
      }
      .audioTonCol .mediaThumb{
        width:74px!important;
        min-width:74px!important;
        max-width:74px!important;
        height:42px!important;
        min-height:42px!important;
        max-height:42px!important;
        aspect-ratio:auto!important;
      }
      .audioTonCol .mediaBadge{
        flex:0 0 auto!important;
        margin:0!important;
      }
      .audioTonCol .mediaLabelRow{
        grid-area:name!important;
        display:block!important;
        min-width:0!important;
        width:100%!important;
        height:auto!important;
        min-height:18px!important;
        overflow:visible!important;
      }
      .audioTonCol .mediaLabelRow .mediaBadge{display:none!important;}
      .audioTonCol .mediaTitle{
        display:block!important;
        white-space:nowrap!important;
        overflow:visible!important;
        text-overflow:clip!important;
        word-break:normal!important;
        line-height:1.2!important;
        font-size:12px!important;
        max-width:none!important;
      }
      .audioTonCol .mediaTools{
        grid-area:tools!important;
        display:flex!important;
        flex-direction:row!important;
        align-items:center!important;
        justify-content:flex-end!important;
        gap:6px!important;
        white-space:nowrap!important;
      }
      .audioTonCol .mediaTool{
        width:auto!important;
        min-width:30px!important;
        height:28px!important;
        padding:0 8px!important;
        white-space:nowrap!important;
        line-height:28px!important;
      }
      .audioTonCol .mediaTool.replace{
        min-width:70px!important;
      }
    }
  `;
  document.head.appendChild(style);

  const oldMedia=window.media || media;
  window.media=function(m,rowId,sid){
    const html=oldMedia(m,rowId,sid);
    if(!m || sid!=='sound')return html;
    return html.replace(/>Reload<\/button>/g,'>Ersetzen<\/button>');
  };
  setTimeout(()=>{try{renderTable();}catch(e){}},0);
})();

/* ---- script block 8 ---- */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    @media screen{
      .col-screen .mediaDrop.hasMedia{
        justify-content:flex-start!important;
        align-items:flex-start!important;
        padding:5px 6px!important;
      }
      .col-screen .mediaPreview{
        display:grid!important;
        grid-template-columns:minmax(0,1fr)!important;
        grid-template-areas:"thumb" "name" "tools"!important;
        justify-items:start!important;
        align-items:start!important;
        justify-content:start!important;
        gap:4px!important;
        width:100%!important;
        padding:4px!important;
        margin:0!important;
        text-align:left!important;
      }
      .col-screen .mediaThumbStack{
        grid-area:thumb!important;
        justify-self:start!important;
        align-self:start!important;
        width:100%!important;
        max-width:100%!important;
        min-width:0!important;
        display:block!important;
      }
      .col-screen .mediaThumb{
        justify-self:start!important;
        margin-left:0!important;
        width:100%!important;
        min-width:0!important;
        max-width:150px!important;
        height:auto!important;
        aspect-ratio:16/9!important;
        max-height:86px!important;
      }
      .col-screen .mediaThumb img,
      .col-screen .mediaThumb video{
        object-fit:contain!important;
        object-position:left center!important;
      }
      .col-screen .mediaLabelRow{
        grid-area:name!important;
        justify-self:start!important;
        width:100%!important;
        max-width:100%!important;
        text-align:left!important;
      }
      .col-screen .mediaTitle{
        text-align:left!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important;
        max-width:100%!important;
      }
      .col-screen .mediaTools{
        grid-area:tools!important;
        justify-self:start!important;
        align-self:start!important;
        display:flex!important;
        gap:5px!important;
        margin:0!important;
      }
      .rowActions{
        flex-direction:column!important;
        gap:4px!important;
      }
      .rowActionsHead,
      .rowActionsCell{
        width:calc(48px * var(--zoom))!important;
        min-width:calc(48px * var(--zoom))!important;
        max-width:calc(48px * var(--zoom))!important;
      }
      .rowActionBtn{
        width:28px!important;
        height:24px!important;
        min-width:28px!important;
        font-size:11px!important;
        line-height:1!important;
      }
    }
  `;
  document.head.appendChild(style);

  function shrinkScreenColumnsV54(){
    if(!window.state)return false;
    state.colWidths=state.colWidths||{};
    let changed=false;
    (state.screens||[]).forEach(s=>{
      const id='screen:'+s.id;
      if(!state.colWidths[id] || state.colWidths[id]>170){
        state.colWidths[id]=150;
        changed=true;
      }
    });
    return changed;
  }

  const prevAutoExpand=window.autoExpandMediaColumn || autoExpandMediaColumn;
  window.autoExpandMediaColumn=function(colId,media,rowId){
    const kind=mediaKind(media);
    if(colId&&String(colId).startsWith('screen:')&&(kind==='VIDEO'||kind==='BILD')){
      if(colWidth({id:colId,type:'screen'})>170 || !state.colWidths?.[colId])setColWidth(colId,150);
      if(rowId){
        const r=state.rows.find(x=>x.id===rowId);
        if(r&&rowHeight(r)<130)setRowHeight(rowId,130);
      }
      return;
    }
    return prevAutoExpand(colId,media,rowId);
  };

  setTimeout(()=>{try{if(shrinkScreenColumnsV54())render();else renderTable();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 9 ---- */
/* V55: Schriftgröße für Trenner/Headlines und Ablauftexte */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    :root{
      --ablauf-head-font:15px;
      --ablauf-body-font:13px;
    }
    .blockInput{
      font-size:calc(var(--ablauf-head-font) * var(--zoom))!important;
    }
    .blockBar .colorPill{
      font-size:calc((var(--ablauf-head-font) - 3px) * var(--zoom))!important;
    }
    tbody .cellText,
    tbody .cellInput,
    tbody .mediaText,
    tbody .peopleCell,
    tbody .personToken,
    tbody .mediaTitle,
    tbody .mediaName,
    tbody .cueCell{
      font-size:calc(var(--ablauf-body-font) * var(--zoom))!important;
    }
    .fontSizePanel .fontSizeRow{
      display:grid;
      grid-template-columns:minmax(0,1fr) auto;
      gap:8px;
      align-items:center;
      border:1px solid var(--line);
      border-radius:14px;
      background:rgba(255,255,255,.035);
      padding:8px;
      margin-top:8px;
    }
    .fontSizePanel .fontSizeRow b{
      display:block;
      font-size:12px;
      margin-bottom:2px;
    }
    .fontSizePanel .fontSizeRow span{
      display:block;
      font-size:10px;
      color:var(--muted);
    }
    .fontSizePanel .fontSizeTools{
      display:flex;
      align-items:center;
      gap:5px;
    }
    .fontSizePanel .fontSizeTools button{
      width:28px;
      height:26px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.14);
      background:rgba(255,255,255,.06);
      color:var(--text);
      font-weight:900;
      padding:0;
    }
    .fontSizePanel .fontSizeTools button:hover{
      border-color:rgba(201,255,25,.65);
      background:rgba(201,255,25,.12);
    }
    .fontSizePanel .fontSizeValue{
      min-width:36px;
      text-align:center;
      font-size:11px;
      color:var(--muted);
      font-weight:900;
    }
  `;
  document.head.appendChild(style);

  function ensureFontSizes(){
    if(typeof state==='undefined')return;
    state.fontSizes=state.fontSizes||{};
    
    if(!state.fontSizesDefaultV64 && (state.fontSizes.headline==null || state.fontSizesDefaultV58 || parseInt(state.fontSizes.headline,10)===18)){state.fontSizes.headline=15;state.fontSizesDefaultV64=true;}
    state.fontSizes.headline=Math.max(9,Math.min(28,parseInt(state.fontSizes.headline,10)||15));
    state.fontSizes.body=Math.max(9,Math.min(24,parseInt(state.fontSizes.body,10)||13));
  }
  function applyFontSizes(){
    if(typeof state==='undefined')return;
    ensureFontSizes();
    document.documentElement.style.setProperty('--ablauf-head-font',state.fontSizes.headline+'px');
    document.documentElement.style.setProperty('--ablauf-body-font',state.fontSizes.body+'px');
    const head=$('#fontSizeHeadValue'),body=$('#fontSizeBodyValue');
    if(head)head.textContent=state.fontSizes.headline+' px';
    if(body)body.textContent=state.fontSizes.body+' px';
  }
  function changeFontSize(kind,delta){
    ensureFontSizes();
    const key=kind==='head'?'headline':'body';
    const max=kind==='head'?28:24;
    state.fontSizes[key]=Math.max(9,Math.min(max,(parseInt(state.fontSizes[key],10)||(kind==='head'?15:13))+delta));
    applyFontSizes();
    saveLocal(false);
    renderTable();
  }
  function installFontPanel(){
    const sec=$('#sec-add');
    if(!sec||$('#fontSizePanel'))return;
    const panel=document.createElement('div');
    panel.className='panel fontSizePanel';
    panel.id='fontSizePanel';
    panel.innerHTML=`
      <h2>Schriftgröße</h2>
      <div class="fontSizeRow">
        <div><b>Headlines / Trenner</b><span>Abschnittszeilen im Ablauf</span></div>
        <div class="fontSizeTools"><button type="button" data-font-size="head:-1">−</button><span class="fontSizeValue" id="fontSizeHeadValue">15 px</span><button type="button" data-font-size="head:1">+</button></div>
      </div>
      <div class="fontSizeRow">
        <div><b>Ablauftexte</b><span>alle normalen Texte in der Mitte</span></div>
        <div class="fontSizeTools"><button type="button" data-font-size="body:-1">−</button><span class="fontSizeValue" id="fontSizeBodyValue">13 px</span><button type="button" data-font-size="body:1">+</button></div>
      </div>`;
    const first=sec.querySelector('.panel');
    if(first&&first.nextSibling)sec.insertBefore(panel,first.nextSibling);else sec.appendChild(panel);
    panel.querySelectorAll('[data-font-size]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const [kind,delta]=btn.dataset.fontSize.split(':');
        changeFontSize(kind,parseInt(delta,10)||0);
      });
    });
    applyFontSizes();
  }
  const oldRender=render;
  render=function(){
    ensureFontSizes();
    oldRender.apply(this,arguments);
    installFontPanel();
    applyFontSizes();
  };
  setTimeout(()=>{try{installFontPanel();applyFontSizes();}catch(e){console.warn(e)}},0);
})();

/* ---- script block 10 ---- */
(function(){
  function cleanName73(v){
    try{return decodeURIComponent(String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'').trim();}
    catch(e){return String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'';}
  }
  function ensureCurrentBox73(){
    const now=document.getElementById('regiePreviewNow');
    if(!now)return null;
    let box=document.getElementById('regiePreviewCurrentFiles');
    if(!box){
      box=document.createElement('div');
      box.id='regiePreviewCurrentFiles';
      box.className='regiePreviewCurrentFiles';
      now.insertAdjacentElement('afterend',box);
    }
    return box;
  }
  function currentItem73(){
    const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
    if(!items.length)return null;
    const idx=Math.max(0,Math.min(items.length-1,Number(window.regiePreviewIndex ?? regiePreviewIndex)||0));
    return {item:items[idx],items,idx};
  }
  window.updateRegieNowPlaying=function(){
    const box=ensureCurrentBox73();
    const video=document.getElementById('regiePreviewVideo');
    const audio=document.getElementById('regiePreviewAudio');
    const cur=currentItem73();
    if(!box||!cur){if(box)box.innerHTML='';return;}
    const item=cur.item;
    const videoPlaying=!!(video&&video.src&&!video.paused&&!video.ended);
    const audioPlaying=!!(audio&&audio.src&&!audio.paused&&!audio.ended);
    const rows=[];
    if(item.kind==='audio'){
      const videoName=cleanName73(video?.currentSrc||video?.src||'');
      rows.push(`<div class="nowLine ${audioPlaying?'playing':'selected'}"><b>${audioPlaying?'SPIELT AUDIO':'AUDIO AUSGEWÄHLT'}</b><span>${esc(item.name||'Audio')}</span></div>`);
      if(videoName)rows.push(`<div class="nowLine videoCarry"><b>VIDEO BLEIBT</b><span>${esc(videoName)}</span></div>`);
    }else{
      rows.push(`<div class="nowLine ${videoPlaying?'playing':'selected'}"><b>${videoPlaying?'SPIELT VIDEO':'VIDEO AUSGEWÄHLT'}</b><span>${esc(item.name||'Video')}</span></div>`);
      if(item.audioName||audioPlaying){
        const aName=item.audioName||cleanName73(audio?.currentSrc||audio?.src||'');
        rows.push(`<div class="nowLine ${audioPlaying?'audioPlaying':'selected'}"><b>${audioPlaying?'SPIELT AUDIO':'AUDIO'}</b><span>${esc(aName||'—')}</span></div>`);
      }
    }
    box.innerHTML=rows.join('');
    document.querySelectorAll('.regiePreviewItem .nowPlayingBadge').forEach(el=>el.remove());
    const active=document.querySelector('.regiePreviewItem.active > div');
    if(active){
      const badge=document.createElement('em');
      badge.className='nowPlayingBadge '+((videoPlaying||audioPlaying)?'isPlaying':'isSelected');
      badge.textContent=(videoPlaying||audioPlaying)?'SPIELT':'AUSGEWÄHLT';
      active.insertBefore(badge,active.firstChild);
      const activeItem=document.querySelector('.regiePreviewItem.active');
      if(activeItem)activeItem.scrollIntoView({block:'nearest',inline:'nearest'});
    }
  };
  const oldRender=window.renderRegiePreviewList;
  if(typeof oldRender==='function'){
    window.renderRegiePreviewList=function(){
      const res=oldRender.apply(this,arguments);
      setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},0);
      return res;
    };
  }
  const oldPlay=window.playRegiePreview;
  if(typeof oldPlay==='function'){
    window.playRegiePreview=function(){
      const res=oldPlay.apply(this,arguments);
      setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},80);
      return res;
    };
  }
  const oldToggle=window.toggleRegiePreview;
  if(typeof oldToggle==='function'){
    window.toggleRegiePreview=function(){
      const res=oldToggle.apply(this,arguments);
      setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},80);
      return res;
    };
  }
  const style=document.createElement('style');
  style.textContent=`
    .regiePreviewCurrentFiles{display:grid;gap:5px;margin:-2px 0 2px;padding:8px;border:1px solid rgba(201,255,25,.18);border-radius:12px;background:rgba(255,255,255,.035);font-size:11px;line-height:1.25;}
    .regiePreviewCurrentFiles .nowLine{display:flex;gap:7px;align-items:center;min-width:0;}
    .regiePreviewCurrentFiles .nowLine b{flex:0 0 auto;border-radius:999px;padding:3px 7px;font-size:9px;line-height:1;background:rgba(255,255,255,.16);color:var(--muted);}
    .regiePreviewCurrentFiles .nowLine.playing b{background:var(--lime);color:#071007;}
    .regiePreviewCurrentFiles .nowLine.audioPlaying b{background:#ff5858;color:#fff;}
    .regiePreviewCurrentFiles .nowLine.videoCarry b{background:rgba(201,255,25,.14);color:var(--lime);}
    .regiePreviewCurrentFiles .nowLine span{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text);font-weight:800;}
    .nowPlayingBadge{display:inline-flex;margin:0 0 5px 0;border-radius:999px;padding:3px 7px;font-size:9px;line-height:1;font-style:normal;font-weight:900;letter-spacing:.04em;}
    .nowPlayingBadge.isPlaying{background:var(--lime);color:#071007;}
    .regiePreviewAudioOnly .nowPlayingBadge.isPlaying{background:#ff5858;color:#fff;}
    .nowPlayingBadge.isSelected{background:rgba(255,255,255,.16);color:var(--muted);}
  `;
  document.head.appendChild(style);
  ['play','pause','ended','loadedmetadata'].forEach(ev=>{
    setTimeout(()=>{
      document.getElementById('regiePreviewVideo')?.addEventListener(ev,()=>setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},30));
      document.getElementById('regiePreviewAudio')?.addEventListener(ev,()=>setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},30));
    },300);
  });
  setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},500);
})();

/* ---- script block 11 ---- */
(function(){
  function esc76(s){return (typeof esc==='function')?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function itemKey76(item,index){return [item?.kind||'', item?.rowId||'', item?.rowIndex??'', item?.url||'', item?.name||'', index??''].join('||');}
  function findIndexByKey76(key){
    const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
    let idx=items.findIndex((item,i)=>itemKey76(item,i)===key);
    if(idx<0)idx=Number(String(key||'').split('||').pop());
    if(!Number.isFinite(idx))idx=0;
    return Math.max(0,Math.min(items.length-1,idx));
  }
  window.playRegiePreviewExact=function(key){
    const idx=findIndexByKey76(key);
    if(typeof playRegiePreview==='function')playRegiePreview(idx);
  };
  window.updateRegieNowPlaying=function(){
    const box=document.getElementById('regiePreviewCurrentFiles');
    if(box)box.remove();
    const now=document.getElementById('regiePreviewNow');
    if(now)now.textContent='';
  };
  window.renderRegiePreviewList=function(existing=null){
    const box=document.getElementById('regiePreviewList');
    const now=document.getElementById('regiePreviewNow');
    if(!box)return;
    const items=existing||((typeof regieVideoItems==='function')?regieVideoItems():[]);
    if(!items.length){
      box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';
      if(now)now.textContent='';
      if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
      return;
    }
    if(window.regiePreviewIndex>=items.length)window.regiePreviewIndex=0;
    box.innerHTML=items.map((item,i)=>{
      const active=i===window.regiePreviewIndex;
      const key=itemKey76(item,i);
      const cue=item.cue?`<em class="regieCueBadge">CUE ${esc76(item.cue)}</em>`:'';
      if(item.kind==='audio'){
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active playingOutline':''}" data-regie-preview-key="${esc76(key)}" title="${esc76(item.url||item.name||'')}"><div><div class="regiePreviewTopLine">${cue}<b>${esc76(item.what||'Audio')}</b></div><span>${esc76(item.start||'')}</span><div class="regiePreviewAudioFileLine"><b>AUDIO FILE</b><span>${esc76(item.name)}</span></div></div></div>`;
      }
      const audioLine=`<div class="regiePreviewAudioLine ${item.audioName?'':'noAudio'}"><b>AUDIO</b><span>${esc76(item.audioName||'—')}</span></div>`;
      return `<div class="regiePreviewItem ${active?'active playingOutline':''}" data-regie-preview-key="${esc76(key)}" title="${esc76(item.url||item.name||'')}"><div><div class="regiePreviewTopLine">${cue}<b>${esc76(item.name)}</b></div><span>${esc76((item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||''))}</span>${audioLine}</div></div>`;
    }).join('');
    document.querySelectorAll('[data-regie-preview-key]').forEach(el=>{
      el.addEventListener('click',()=>window.playRegiePreviewExact(el.dataset.regiePreviewKey));
      el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();window.playRegiePreviewExact(el.dataset.regiePreviewKey);}});
      el.setAttribute('tabindex','0');
      el.setAttribute('role','button');
    });
    if(now)now.textContent='';
    const old=document.getElementById('regiePreviewCurrentFiles');
    if(old)old.remove();
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };
  const style=document.createElement('style');
  style.textContent=`
    #regiePreviewNow{display:none!important;}
    #regiePreviewCurrentFiles{display:none!important;}
    .regiePreviewItem .nowPlayingBadge{display:none!important;}
    .regiePreviewItem.active,.regiePreviewItem.playingOutline{
      outline:2px solid var(--lime)!important;
      outline-offset:2px!important;
      border-color:var(--lime)!important;
      box-shadow:0 0 0 1px rgba(201,255,25,.28),0 0 18px rgba(201,255,25,.16)!important;
    }
    .regiePreviewAudioOnly.active,.regiePreviewAudioOnly.playingOutline{
      outline-color:#ff5858!important;
      border-color:#ff5858!important;
      box-shadow:0 0 0 1px rgba(255,88,88,.28),0 0 18px rgba(255,88,88,.16)!important;
    }
  `;
  document.head.appendChild(style);
  setTimeout(()=>{try{renderRegiePreviewList();updateRegieNowPlaying();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 12 ---- */
(function(){
  function audioOn77(){
    const v=document.getElementById('regiePreviewVideo');
    if(!v)return;
    v.defaultMuted=false;
    v.muted=false;
    if(!Number.isFinite(v.volume)||v.volume===0)v.volume=1;
  }
  const oldPlay=window.playRegiePreview;
  if(typeof oldPlay==='function'){
    window.playRegiePreview=function(){
      audioOn77();
      const r=oldPlay.apply(this,arguments);
      setTimeout(audioOn77,0);
      setTimeout(audioOn77,80);
      return r;
    };
  }
  ['DOMContentLoaded','load'].forEach(ev=>window.addEventListener(ev,audioOn77));
  setTimeout(audioOn77,0);
  setTimeout(audioOn77,300);
})();

/* ---- script block 13 ---- */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    @media screen{
      .col-screen .mediaDrop.hasMedia{
        min-height:82px!important;
        height:auto!important;
        max-height:none!important;
        padding:5px 7px!important;
        justify-content:flex-start!important;
        align-items:center!important;
        background:#07100c!important;
      }
      .col-screen .mediaPreview{
        display:grid!important;
        grid-template-columns:minmax(160px,220px) minmax(0,1fr) auto!important;
        grid-template-areas:"thumb name tools"!important;
        align-items:center!important;
        justify-items:stretch!important;
        gap:8px!important;
        width:100%!important;
        min-width:0!important;
        padding:4px!important;
        margin:0!important;
        text-align:left!important;
      }
      .col-screen .mediaThumbStack{
        grid-area:thumb!important;
        width:100%!important;
        min-width:0!important;
        max-width:220px!important;
        display:block!important;
      }
      .col-screen .mediaThumb{
        width:100%!important;
        min-width:160px!important;
        max-width:220px!important;
        height:auto!important;
        aspect-ratio:16/9!important;
        max-height:124px!important;
        margin:0!important;
      }
      .col-screen .mediaThumb img,
      .col-screen .mediaThumb video{
        object-fit:contain!important;
        object-position:left center!important;
      }
      .col-screen .mediaLabelRow{
        grid-area:name!important;
        width:100%!important;
        min-width:0!important;
        display:flex!important;
        align-items:center!important;
        gap:7px!important;
        overflow:hidden!important;
      }
      .col-screen .mediaTitle{
        display:block!important;
        min-width:0!important;
        max-width:100%!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important;
        text-align:left!important;
        line-height:1.15!important;
      }
      .col-screen .mediaTools{
        grid-area:tools!important;
        align-self:center!important;
        justify-self:end!important;
        display:flex!important;
        flex-direction:row!important;
        gap:6px!important;
        margin:0!important;
        white-space:nowrap!important;
      }
      .col-screen .mediaTool{
        width:auto!important;
        min-width:30px!important;
        height:30px!important;
        padding:0 8px!important;
      }
    }
  `;
  document.head.appendChild(style);

  function fixScreenColumnsV56(){
    if(!window.state)return false;
    state.colWidths=state.colWidths||{};
    state.rowHeights=state.rowHeights||{};
    let changed=false;
    (state.screens||[]).forEach(s=>{
      const id='screen:'+s.id;
      if(!state.colWidths[id] || state.colWidths[id]<330 || state.colWidths[id]>420){
        state.colWidths[id]=360;
        changed=true;
      }
    });
    (state.rows||[]).forEach(r=>{
      if(!r||r.isBlock)return;
      const hasScreenMedia=Object.values(r.screens||{}).some(x=>x&&x.media);
      if(hasScreenMedia && (!state.rowHeights[r.id] || state.rowHeights[r.id]>130 || state.rowHeights[r.id]<96)){
        state.rowHeights[r.id]=108;
        changed=true;
      }
    });
    if(changed)saveLocal(false);
    return changed;
  }

  const prevAutoExpand=window.autoExpandMediaColumn || autoExpandMediaColumn;
  window.autoExpandMediaColumn=function(colId,media,rowId){
    const kind=mediaKind(media);
    if(colId&&String(colId).startsWith('screen:')&&(kind==='VIDEO'||kind==='BILD')){
      setColWidth(colId,360);
      if(rowId)setRowHeight(rowId,108);
      return;
    }
    return prevAutoExpand(colId,media,rowId);
  };

  setTimeout(()=>{try{if(fixScreenColumnsV56())render();else renderTable();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 14 ---- */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    thead th,
    thead .colBox,
    tbody .colorPill,
    tbody .cueCell,
    tbody .timeCell .cellInput,
    tbody .cellInput.duration,
    tbody .cellInput.endInput,
    tbody .showStartBtn,
    tbody .handleCell,
    tbody .grip,
    tbody .rowActionsCell,
    tbody .rowActionBtn{
      font-size:calc(var(--ablauf-head-font) * var(--zoom))!important;
    }
    thead th,
    thead .colBox{
      font-size:calc((var(--ablauf-head-font) - 2px) * var(--zoom))!important;
    }
    tbody .colorPill,
    tbody .showStartBtn{
      font-size:calc((var(--ablauf-head-font) - 3px) * var(--zoom))!important;
    }
    tbody .cellText,
    tbody .mediaText,
    tbody .peopleCell,
    tbody .personToken,
    tbody .mediaTitle,
    tbody .mediaName{
      font-size:calc(var(--ablauf-body-font) * var(--zoom))!important;
    }
  `;
  document.head.appendChild(style);
})();

/* ---- script block 15 ---- */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    @media screen{
      thead th,
      thead .colBox{
        font-size:calc(16px * var(--zoom))!important;
      }
      .col-screen .mediaDrop.hasMedia{
        min-height:76px!important;
        padding:5px 7px!important;
      }
      .col-screen .mediaPreview{
        grid-template-columns:minmax(120px,176px) minmax(0,1fr) auto!important;
        gap:7px!important;
      }
      .col-screen .mediaThumbStack{max-width:176px!important;}
      .col-screen .mediaThumb{
        min-width:120px!important;
        max-width:176px!important;
        max-height:99px!important;
      }
    }
    @media print{
      body{overflow:visible!important;background:#fff!important;color:#000!important;}
      .app,.main,.tableWrap{display:block!important;width:100%!important;height:auto!important;overflow:visible!important;box-shadow:none!important;border:0!important;background:#fff!important;}
      .side,.right,.toolbar,.topActions{display:none!important;}
      .top{display:block!important;height:auto!important;padding:0 0 8px 0!important;border:0!important;}
      .title h1{font-size:16px!important;color:#000!important;margin:0 0 4px!important;}
      .title p{display:none!important;}
      table{width:100%!important;min-width:0!important;max-width:100%!important;border-collapse:collapse!important;font-size:9px!important;table-layout:fixed!important;}
      thead th{position:static!important;background:#fff!important;color:#000!important;font-size:16px!important;height:auto!important;padding:4px!important;border:1px solid #999!important;white-space:normal!important;}
      thead .colBox{font-size:16px!important;min-height:0!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;color:#000!important;white-space:normal!important;}
      tbody tr,tbody tr td{height:auto!important;max-height:none!important;min-height:0!important;background:#fff!important;color:#000!important;opacity:1!important;filter:none!important;border:1px solid #999!important;padding:3px 4px!important;vertical-align:top!important;box-shadow:none!important;}
      .handleCell,.rowActionsHead,.rowActionsCell,.grip,.rowResize,.colResize,.colDelete,.rowActions,.rowActionBtn{display:none!important;}
      thead th:first-child,tbody td:first-child{display:none!important;}
      .showStartBtn{display:none!important;}
      .timeCell{display:block!important;}
      .cellInput,.cellText,textarea,input{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;border:0!important;background:transparent!important;color:#000!important;padding:0!important;box-shadow:none!important;white-space:nowrap!important;font-size:9px!important;line-height:1.2!important;}
      .cellText{white-space:pre-wrap!important;word-break:break-word!important;}
      .peopleCell,.mediaDrop{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;border:0!important;background:transparent!important;padding:0!important;}
      .mediaPreview{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;background:transparent!important;padding:0!important;margin:0!important;}
      .mediaThumb,.mediaThumbStack .mediaThumb,.mediaThumb img,.mediaThumb video,.mediaBadge,.mediaTools,.mediaMeta,.mediaAdd,.mediaFileInput,.mediaThumbStack svg,.audioThumb{display:none!important;}
      .mediaThumbStack,.mediaLabelRow{display:block!important;width:100%!important;max-width:none!important;min-width:0!important;height:auto!important;overflow:visible!important;}
      .mediaTitle,.mediaName{display:block!important;width:100%!important;max-width:none!important;height:auto!important;overflow:visible!important;white-space:normal!important;text-overflow:clip!important;color:#000!important;font-size:9px!important;line-height:1.2!important;font-weight:700!important;word-break:break-word!important;}
      .mediaText{display:block!important;width:100%!important;white-space:pre-wrap!important;overflow:visible!important;color:#000!important;font-size:9px!important;}
      .colorPill{height:auto!important;max-width:none!important;border:0!important;background:transparent!important;color:#000!important;padding:0!important;font-size:9px!important;box-shadow:none!important;white-space:normal!important;}
      .cueCell{font-size:9px!important;}
      .blockSeparator td{height:auto!important;max-height:none!important;background:#eee!important;color:#000!important;padding:4px!important;}
      .blockBar{display:block!important;min-height:0!important;background:#eee!important;color:#000!important;padding:0!important;text-align:left!important;box-shadow:none!important;}
      .blockBar .colorPill{display:none!important;}
      .blockInput{display:block!important;width:100%!important;max-width:none!important;text-align:left!important;background:transparent!important;color:#000!important;border:0!important;padding:0!important;font-size:16px!important;font-weight:900!important;white-space:normal!important;}
      .col-screen .mediaDrop.hasMedia,.audioTonCol .mediaDrop.hasMedia{height:auto!important;min-height:0!important;max-height:none!important;}
    }
  `;
  document.head.appendChild(style);

  function shrinkScreenColumnsV60(){
    try{
      if(typeof state==='undefined')return false;
      state.colWidths=state.colWidths||{};
      let changed=false;
      (state.screens||[]).forEach(s=>{
        const id='screen:'+s.id;
        const current=parseInt(state.colWidths[id]||0,10);
        if(!current || current>300 || current<250){state.colWidths[id]=288;changed=true;}
      });
      if(changed)saveLocal(false);
      return changed;
    }catch(e){console.warn(e);return false;}
  }

  try{
    const prevDefaultColumnWidthV60=defaultColumnWidth;
    defaultColumnWidth=function(c){
      if(c&&c.type==='screen')return 288;
      return prevDefaultColumnWidthV60(c);
    };
  }catch(e){console.warn(e);}

  try{
    const prevAutoExpandV60=autoExpandMediaColumn;
    autoExpandMediaColumn=function(colId,media,rowId){
      const kind=mediaKind(media);
      if(colId&&String(colId).startsWith('screen:')&&(kind==='VIDEO'||kind==='BILD')){
        setColWidth(colId,288);
        if(rowId)setRowHeight(rowId,96);
        return;
      }
      return prevAutoExpandV60(colId,media,rowId);
    };
  }catch(e){console.warn(e);}

  const oldRenderV60=render;
  render=function(){
    const changed=shrinkScreenColumnsV60();
    oldRenderV60.apply(this,arguments);
    if(changed)renderTable();
  };
  setTimeout(()=>{try{if(shrinkScreenColumnsV60())render();else renderTable();}catch(e){console.warn(e)}},0);
})();

/* ---- script block 16 ---- */
(function(){
  function applyColumnOrderV62(){
    try{
      if(typeof state==='undefined')return false;
      state.columnOrder=Array.isArray(state.columnOrder)?state.columnOrder:((typeof allDisplayCols==='function')?allDisplayCols().map(c=>c.id):[]);
      if(typeof ensureColumnOrder==='function')ensureColumnOrder();
      const wanted=['handle'];
      const existing=new Set(state.columnOrder||[]);
      const first=wanted.filter(id=>existing.has(id));
      const rest=(state.columnOrder||[]).filter(id=>!wanted.includes(id));
      const next=[...first,...rest];
      const changed=JSON.stringify(next)!==JSON.stringify(state.columnOrder);
      if(changed){state.columnOrder=next;if(typeof saveLocal==='function')saveLocal(false);}
      return changed;
    }catch(e){console.warn(e);return false;}
  }
  try{
    const prevRenderV62=render;
    render=function(){
      applyColumnOrderV62();
      return prevRenderV62.apply(this,arguments);
    };
  }catch(e){console.warn(e);}
  setTimeout(()=>{
    try{
      const changed=applyColumnOrderV62();
      if(typeof renderTable==='function')renderTable();
      if(changed&&typeof render==='function')render();
    }catch(e){console.warn(e);}
  },0);
})();

/* ---- script block 17 ---- */
(function(){
  function refreshRegiePreviewV65(){
    try{
      if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();
      if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
      const btn=document.getElementById('regieReloadBtn');
      if(btn){
        const old=btn.textContent;
        btn.textContent='Neu geladen';
        setTimeout(()=>{btn.textContent=old||'Reload';},900);
      }
    }catch(e){console.warn(e);}
  }
  function installRegieReloadV65(){
    const controls=document.getElementById('regiePreviewControls');
    if(!controls || document.getElementById('regieReloadBtn'))return;
    const btn=document.createElement('button');
    btn.className='regiePreviewControlBtn';
    btn.id='regieReloadBtn';
    btn.type='button';
    btn.title='Regie-Video-Preview neu aus dem Regieplan laden';
    btn.textContent='Reload';
    btn.addEventListener('click',refreshRegiePreviewV65);
    controls.appendChild(btn);
  }
  const oldRenderV65=window.render;
  if(typeof oldRenderV65==='function'){
    window.render=function(){
      const result=oldRenderV65.apply(this,arguments);
      setTimeout(installRegieReloadV65,0);
      return result;
    };
  }
  setTimeout(()=>{installRegieReloadV65();refreshRegiePreviewV65();},0);
})();

/* ---- script block 18 ---- */
(function(){
  function hasScreenMediaV66(r){
    try{return !!Object.values(r&&r.screens||{}).some(s=>s&&s.media);}catch(e){return false;}
  }
  function applyPreviewSizeV66(){
    try{
      if(typeof state==='undefined')return false;
      state.rowHeights=state.rowHeights||{};
      let changed=false;
      (state.rows||[]).forEach(r=>{
        if(r&&!r.isBlock&&hasScreenMediaV66(r)){
          const cur=parseInt(state.rowHeights[r.id]||0,10);
          if(!cur || cur<126){state.rowHeights[r.id]=126;changed=true;}
        }
      });
      if(changed&&typeof saveLocal==='function')saveLocal(false);
      return changed;
    }catch(e){console.warn(e);return false;}
  }
  try{
    const prevAutoExpandV66=autoExpandMediaColumn;
    autoExpandMediaColumn=function(colId,media,rowId){
      const kind=(typeof mediaKind==='function')?mediaKind(media):'';
      if(colId&&String(colId).startsWith('screen:')&&(kind==='VIDEO'||kind==='BILD')){
        if(typeof setRowHeight==='function'&&rowId)setRowHeight(rowId,126);
        if(typeof setColWidth==='function')setColWidth(colId,288);
        return;
      }
      return prevAutoExpandV66(colId,media,rowId);
    };
  }catch(e){console.warn(e);}
  setTimeout(()=>{try{if(applyPreviewSizeV66()&&typeof renderTable==='function')renderTable();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 19 ---- */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    @media print{
      table{
        border-collapse:collapse!important;
        border:2px solid #000!important;
      }
      thead tr,
      tbody tr{
        border-top:2px solid #000!important;
        border-bottom:2px solid #000!important;
        outline:1.5px solid #000!important;
        outline-offset:-1px!important;
        box-shadow:inset 0 1px 0 #000,inset 0 -1px 0 #000!important;
      }
      thead th,
      tbody td{
        border:1.5px solid #000!important;
      }
      tbody td{
        border-top:2px solid #000!important;
        border-bottom:2px solid #000!important;
      }
      .blockSeparator td{
        border-top:2px solid #000!important;
        border-bottom:2px solid #000!important;
        outline:1.5px solid #000!important;
        outline-offset:-1px!important;
      }
    }
  `;
  document.head.appendChild(style);
})();

/* ---- script block 20 ---- */
(function(){
  const AUDIO_BASE='https://usa.derhacker.com/CONTENT/ALLGMEIN/';
  const KNOWN_AUDIO={
    'katja_b.mp3':{name:'Katja_B.mp3',type:'audio/mpeg'},
    'awards.mp3':{name:'awards.mp3',type:'audio/mpeg'},
    'platz_nehmen.wav':{name:'PLATZ_NEHMEN.wav',type:'audio/wav'}
  };
  function extV69(s){return String(s||'').split('?')[0].split('#')[0].split('.').pop().toLowerCase();}
  function keyV69(s){return String(s||'').split('?')[0].split('#')[0].split('/').pop().trim().toLowerCase();}
  function mimeV69(name,type){
    const t=String(type||'').toLowerCase();
    if(t.startsWith('audio/')||t.startsWith('video/')||t.startsWith('image/'))return t;
    const e=extV69(name);
    if(e==='mp3')return'audio/mpeg';
    if(e==='wav'||e==='wave')return'audio/wav';
    if(e==='m4a')return'audio/mp4';
    if(e==='aac')return'audio/aac';
    if(e==='ogg')return'audio/ogg';
    if(e==='flac')return'audio/flac';
    if(e==='webm')return'video/webm';
    if(['mp4','m4v','mov'].includes(e))return'video/mp4';
    return'application/octet-stream';
  }
  function audioUrlV69(nameOrUrl){
    let s=String(nameOrUrl||'').trim();
    if(!s)return'';
    if(/^https?:\/\//i.test(s)||/^data:/i.test(s)||/^blob:/i.test(s))return s;
    s=s.replace(/^\/+/, '');
    if(s.startsWith('CONTENT/ALLGMEIN/'))s=s.slice('CONTENT/ALLGMEIN/'.length);
    return AUDIO_BASE+s.split('/').map(encodeURIComponent).join('/');
  }
  function normalizeAudioV69(m){
    if(!m)return null;
    const name=cleanMediaName?cleanMediaName(m.name||m.relativePath||m.url||m.remoteUrl||'Audio'):String(m.name||'Audio');
    let type=mimeV69(name,m.type||m.mime);
    if(!type.startsWith('audio/'))return null;
    let url=m.remoteUrl||m.url||m.data||'';
    if(!url)url=audioUrlV69(m.relativePath||name);
    else if(!/^https?:\/\//i.test(url)&&!/^data:/i.test(url)&&!/^blob:/i.test(url))url=audioUrlV69(url);
    const known=KNOWN_AUDIO[keyV69(name)]||KNOWN_AUDIO[keyV69(url)];
    if(known){type=known.type;url=audioUrlV69(known.name);return {...m,name:known.name,type,mime:type,url,remoteUrl:url,remote:true,isAudio:true};}
    return {...m,name,type,mime:type,url,remoteUrl:url,remote:!!url,isAudio:true};
  }
  function audioFromTextV69(txt){
    const s=String(txt||'');
    const hit=s.match(/(Katja_B\.mp3|awards\.mp3|PLATZ_NEHMEN\.wav|[^\s,;]+\.(?:mp3|wav|wave|m4a|aac|ogg|flac))/i);
    if(!hit)return null;
    const raw=hit[1];
    const known=KNOWN_AUDIO[keyV69(raw)];
    const name=known?known.name:raw.split('/').pop();
    const type=known?known.type:mimeV69(name);
    const url=audioUrlV69(raw);
    return {name,type,mime:type,url,remoteUrl:url,remote:true,isAudio:true,source:'Regieplan'};
  }
  function firstVideoForRowV69(r){
    for(const s of (state.screens||[])){
      const m=r?.screens?.[s.id]?.media;
      if(m&&String(m.type||m.mime||mimeV69(m.name||m.url||m.remoteUrl)).startsWith('video/'))return {screen:s.id,media:m};
    }
    return null;
  }
  function rowAudioV69(r){
    return normalizeAudioV69(r?.soundMedia)||audioFromTextV69(r?.sound)||null;
  }
  function srcV69(m){return m?.remoteUrl||m?.url||m?.data||'';}
  function ensureAudioV69(){
    if(typeof ensurePreviewAudio==='function'){
      const a=ensurePreviewAudio();
      if(a){a.loop=false;return a;}
    }
    const video=document.getElementById('regiePreviewVideo');
    if(!video)return null;
    let a=document.getElementById('regiePreviewAudio');
    if(!a){a=document.createElement('audio');a.id='regiePreviewAudio';a.preload='auto';a.controls=false;a.loop=false;video.insertAdjacentElement('afterend',a);}
    a.loop=false;
    return a;
  }
  function buildPreviewItemsV69(){
    const videos=[],audios=[];
    (state.rows||[]).forEach((r,rowIndex)=>{
      if(!r||r.isBlock)return;
      const audio=rowAudioV69(r);
      const found=firstVideoForRowV69(r);
      if(found){
        const m=found.media;
        videos.push({kind:'video',rowId:r.id,rowIndex,name:m.name||'Video',url:srcV69(m),screen:found.screen,start:r.start||'',what:r.what||'',loop:!!(m.isLoop||m.loop),audioName:audio?.name||'',audioUrl:audio?srcV69(audio):'',audioType:audio?.type||''});
      }
      if(audio){
        audios.push({kind:'audio',rowId:r.id,rowIndex,name:audio.name||'Audio',url:srcV69(audio),type:audio.type||audio.mime||mimeV69(audio.name),start:r.start||'',what:r.what||'',loop:false});
      }
    });
    return videos.concat(audios);
  }
  window.regieVideoItems=function(){return buildPreviewItemsV69();};

  window.playRegiePreview=function(index){
    const items=buildPreviewItemsV69(),video=document.getElementById('regiePreviewVideo'),now=document.getElementById('regiePreviewNow'),audio=ensureAudioV69();
    if(!items.length||!video)return;
    regiePreviewIndex=Math.max(0,Math.min(items.length-1,Number(index)||0));
    const item=items[regiePreviewIndex];
    if(item.kind==='audio'){
      try{video.pause();video.removeAttribute('src');video.load();}catch(e){}
      if(audio){
        if(audio.src!==item.url){audio.src=item.url;audio.load();}
        audio.loop=false;
        audio.style.display='block';
        try{audio.currentTime=0;}catch(e){}
        audio.play().catch(()=>{});
      }
      if(now)now.textContent=(item.start?item.start+' · ':'')+'AUDIO · '+item.name;
    }else{
      if(video.src!==item.url){video.src=item.url;video.load();}
      video.loop=!!item.loop;
      if(audio){
        if(item.audioUrl){
          if(audio.src!==item.audioUrl){audio.src=item.audioUrl;audio.load();}
          audio.loop=false;
          audio.style.display='block';
          try{audio.currentTime=0;}catch(e){}
          audio.play().catch(()=>{});
        }else{
          if(!audio.paused)audio.pause();
          audio.removeAttribute('src');
          audio.style.display='none';
        }
      }
      video.play().catch(()=>{});
      if(now)now.textContent=(item.start?item.start+' · ':'')+item.name+' · AUDIO '+(item.audioName||'—');
    }
    renderRegiePreviewList(items);
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };
  window.toggleRegiePreview=function(index){
    const items=buildPreviewItemsV69(),video=document.getElementById('regiePreviewVideo'),audio=ensureAudioV69();
    if(!items.length)return;
    if(Number(index)!==regiePreviewIndex){playRegiePreview(index);return;}
    const item=items[regiePreviewIndex];
    if(item.kind==='audio'){
      if(!audio)return;
      if(audio.paused)audio.play().catch(()=>{});else audio.pause();
    }else{
      if(!video)return;
      if(video.paused){video.play().catch(()=>{});if(audio&&audio.src)audio.play().catch(()=>{});}else{video.pause();if(audio&&!audio.paused)audio.pause();}
    }
    renderRegiePreviewList(items);
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };
  window.renderRegiePreviewList=function(existing=null){
    const box=document.getElementById('regiePreviewList'),video=document.getElementById('regiePreviewVideo'),now=document.getElementById('regiePreviewNow'),audio=document.getElementById('regiePreviewAudio');
    if(!box)return;
    const items=existing||buildPreviewItemsV69();
    if(!items.length){box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';if(now)now.textContent='Noch kein Medium ausgewählt.';return;}
    if(regiePreviewIndex>=items.length)regiePreviewIndex=0;
    box.innerHTML=items.map((item,i)=>{
      const active=i===regiePreviewIndex;
      if(item.kind==='audio'){
        const playing=active&&audio&&!audio.paused;
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active':''}" data-regie-preview-select="${i}" title="${esc(item.url||item.name||'')}"><div><b>${esc(item.name)}</b><span>${esc((item.start?item.start+' · ':'')+(item.what||''))}</span><div class="regiePreviewAudioFileLine"><b>${playing?'PLAY':'AUDIO FILE'}</b><span>${esc(item.name)}</span></div></div></div>`;
      }
      const audioLine=`<div class="regiePreviewAudioLine ${item.audioName?'':'noAudio'}"><b>AUDIO</b><span>${esc(item.audioName||'—')}</span></div>`;
      return `<div class="regiePreviewItem ${active?'active':''}" data-regie-preview-select="${i}" title="${esc(item.url||item.name||'')}"><div><b>${esc(item.name)}</b><span>${esc((item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||''))}</span>${audioLine}</div></div>`;
    }).join('');
    $$('[data-regie-preview-select]').forEach(el=>el.addEventListener('click',()=>playRegiePreview(el.dataset.regiePreviewSelect)));
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };
  const style=document.createElement('style');
  style.textContent=`
    .regiePreviewAudioLine b{background:var(--lime)!important;color:#071007!important;}
    .regiePreviewAudioLine.noAudio b{background:rgba(255,255,255,.18)!important;color:var(--muted)!important;}
    .regiePreviewAudioOnly{border-color:rgba(255,88,88,.55)!important;background:rgba(255,88,88,.10)!important;}
    .regiePreviewAudioOnly.active{border-color:#ff5858!important;background:rgba(255,88,88,.18)!important;}
    .regiePreviewAudioFileLine{margin-top:5px;padding-top:5px;border-top:1px solid rgba(255,88,88,.25);display:flex;gap:6px;align-items:center;min-width:0;color:#ffd6d6;font-size:10px;line-height:1.25;}
    .regiePreviewAudioFileLine b{font-size:9px;background:#ff5858;color:#fff;border-radius:999px;padding:2px 7px;line-height:1;flex:0 0 auto;}
    .regiePreviewAudioFileLine span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;}
  `;
  document.head.appendChild(style);
  setTimeout(()=>{try{renderRegiePreviewList();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 21 ---- */
(function(){
  const AUDIO_BASE_V70='https://usa.derhacker.com/CONTENT/ALLGMEIN/';
  const KNOWN_AUDIO_V70={
    'katja_b.mp3':{name:'Katja_B.mp3',type:'audio/mpeg'},
    'awards.mp3':{name:'awards.mp3',type:'audio/mpeg'},
    'platz_nehmen.wav':{name:'PLATZ_NEHMEN.wav',type:'audio/wav'}
  };
  function ext70(s){return String(s||'').split('?')[0].split('#')[0].split('.').pop().toLowerCase();}
  function base70(s){return String(s||'').split('?')[0].split('#')[0].split('/').pop().trim();}
  function key70(s){return base70(s).toLowerCase();}
  function mime70(name,type){
    const t=String(type||'').toLowerCase();
    if(t.startsWith('audio/')||t.startsWith('video/')||t.startsWith('image/'))return t;
    const e=ext70(name);
    if(e==='mp3')return'audio/mpeg';
    if(e==='wav'||e==='wave')return'audio/wav';
    if(e==='m4a')return'audio/mp4';
    if(e==='aac')return'audio/aac';
    if(e==='ogg')return'audio/ogg';
    if(e==='flac')return'audio/flac';
    if(e==='webm')return'video/webm';
    if(['mp4','m4v','mov'].includes(e))return'video/mp4';
    return'application/octet-stream';
  }
  function audioUrl70(nameOrUrl){
    let s=String(nameOrUrl||'').trim();
    if(!s)return'';
    if(/^https?:\/\//i.test(s)||/^data:/i.test(s)||/^blob:/i.test(s))return s;
    s=s.replace(/^\/+/, '');
    if(s.startsWith('CONTENT/ALLGMEIN/'))s=s.slice('CONTENT/ALLGMEIN/'.length);
    return AUDIO_BASE_V70+s.split('/').map(encodeURIComponent).join('/');
  }
  function clean70(s){return (typeof cleanMediaName==='function')?cleanMediaName(s):base70(s);}
  function normalizeAudio70(m){
    if(!m)return null;
    const rawName=m.name||m.relativePath||m.url||m.remoteUrl||m.data||'Audio';
    const known=KNOWN_AUDIO_V70[key70(rawName)]||KNOWN_AUDIO_V70[key70(m.url)]||KNOWN_AUDIO_V70[key70(m.remoteUrl)];
    const name=known?known.name:clean70(rawName);
    let type=known?known.type:mime70(name,m.type||m.mime);
    if(!type.startsWith('audio/'))return null;
    let url=known?audioUrl70(known.name):(m.remoteUrl||m.url||m.data||'');
    if(!url)url=audioUrl70(m.relativePath||name);
    else if(!/^https?:\/\//i.test(url)&&!/^data:/i.test(url)&&!/^blob:/i.test(url))url=audioUrl70(url);
    return {...m,name,type,mime:type,url,remoteUrl:url,remote:!!url,isAudio:true};
  }
  function audioFromText70(txt){
    const s=String(txt||'');
    const hit=s.match(/(Katja_B\.mp3|awards\.mp3|PLATZ_NEHMEN\.wav|[^\s,;]+\.(?:mp3|wav|wave|m4a|aac|ogg|flac))/i);
    if(!hit)return null;
    const raw=hit[1];
    const known=KNOWN_AUDIO_V70[key70(raw)];
    const name=known?known.name:base70(raw);
    const type=known?known.type:mime70(name);
    const url=audioUrl70(raw);
    return {name,type,mime:type,url,remoteUrl:url,remote:true,isAudio:true,source:'Regieplan'};
  }
  function firstVideo70(r){
    for(const s of (state.screens||[])){
      const m=r?.screens?.[s.id]?.media;
      const type=String(m?.type||m?.mime||mime70(m?.name||m?.url||m?.remoteUrl||'')).toLowerCase();
      if(m&&type.startsWith('video/'))return {screen:s.id,media:m};
    }
    return null;
  }
  function rowAudio70(r){return normalizeAudio70(r?.soundMedia)||audioFromText70(r?.sound)||null;}
  function src70(m){return m?.remoteUrl||m?.url||m?.data||'';}
  function videoKey70(m){return String(src70(m)||m?.name||'').split('?')[0].split('#')[0].toLowerCase();}
  function ensureAudio70(){
    const video=document.getElementById('regiePreviewVideo');
    if(!video)return null;
    let a=document.getElementById('regiePreviewAudio');
    if(!a){
      a=document.createElement('audio');
      a.id='regiePreviewAudio';
      a.preload='auto';
      a.controls=false;
      a.loop=false;
      video.insertAdjacentElement('afterend',a);
      video.addEventListener('play',()=>{if(a.src)a.play().catch(()=>{});});
      video.addEventListener('pause',()=>{if(!a.paused)a.pause();});
      video.addEventListener('seeking',()=>{try{if(a.src)a.currentTime=video.currentTime||0;}catch(e){}});
      video.addEventListener('timeupdate',()=>{try{if(a.src&&Math.abs((a.currentTime||0)-(video.currentTime||0))>.45)a.currentTime=video.currentTime||0;}catch(e){}});
      video.addEventListener('ended',()=>{if(!a.paused)a.pause();});
    }
    a.loop=false;
    return a;
  }
  function buildPreviewItems70(){
    const items=[];
    const seenVideos=new Set();
    (state.rows||[]).forEach((r,rowIndex)=>{
      if(!r||r.isBlock)return;
      const audio=rowAudio70(r);
      const found=firstVideo70(r);
      if(found){
        const m=found.media;
        const key=videoKey70(m);
        if(key&&!seenVideos.has(key)){
          seenVideos.add(key);
          items.push({kind:'video',rowId:r.id,rowIndex,name:m.name||'Video',url:src70(m),screen:found.screen,start:r.start||'',what:r.what||'',loop:!!(m.isLoop||m.loop),audioName:audio?.name||'',audioUrl:audio?src70(audio):'',audioType:audio?.type||''});
        }
        return;
      }
      if(audio){
        items.push({kind:'audio',rowId:r.id,rowIndex,name:audio.name||'Audio',url:src70(audio),type:audio.type||audio.mime||mime70(audio.name),start:r.start||'',what:r.what||'',loop:false});
      }
    });
    return items;
  }
  window.regieVideoItems=function(){return buildPreviewItems70();};
  window.playRegiePreview=function(index){
    const items=buildPreviewItems70(),video=document.getElementById('regiePreviewVideo'),now=document.getElementById('regiePreviewNow'),audio=ensureAudio70();
    if(!items.length||!video)return;
    regiePreviewIndex=Math.max(0,Math.min(items.length-1,Number(index)||0));
    const item=items[regiePreviewIndex];
    if(item.kind==='audio'){
      try{video.pause();video.removeAttribute('src');video.load();}catch(e){}
      if(audio){
        if(audio.src!==item.url){audio.src=item.url;audio.load();}
        audio.loop=false;
        audio.style.display='block';
        try{audio.currentTime=0;}catch(e){}
        audio.play().catch(()=>{});
      }
      if(now)now.textContent=(item.start?item.start+' · ':'')+(item.what?item.what+' · ':'')+item.name;
    }else{
      if(video.src!==item.url){video.src=item.url;video.load();}
      video.loop=!!item.loop;
      if(audio){
        if(item.audioUrl){
          if(audio.src!==item.audioUrl){audio.src=item.audioUrl;audio.load();}
          audio.loop=false;
          audio.style.display='block';
          try{audio.currentTime=0;}catch(e){}
          audio.play().catch(()=>{});
        }else{
          if(!audio.paused)audio.pause();
          audio.removeAttribute('src');
          audio.style.display='none';
        }
      }
      video.play().catch(()=>{});
      if(now)now.textContent=(item.start?item.start+' · ':'')+item.name+' · AUDIO '+(item.audioName||'—');
    }
    renderRegiePreviewList(items);
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };
  window.toggleRegiePreview=function(index){
    const items=buildPreviewItems70(),video=document.getElementById('regiePreviewVideo'),audio=ensureAudio70();
    if(!items.length)return;
    if(Number(index)!==regiePreviewIndex){playRegiePreview(index);return;}
    const item=items[regiePreviewIndex];
    if(item.kind==='audio'){
      if(!audio)return;
      if(audio.paused)audio.play().catch(()=>{});else audio.pause();
    }else{
      if(!video)return;
      if(video.paused){video.play().catch(()=>{});if(audio&&audio.src)audio.play().catch(()=>{});}else{video.pause();if(audio&&!audio.paused)audio.pause();}
    }
    renderRegiePreviewList(items);
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };
  window.renderRegiePreviewList=function(existing=null){
    const box=document.getElementById('regiePreviewList'),video=document.getElementById('regiePreviewVideo'),now=document.getElementById('regiePreviewNow'),audio=document.getElementById('regiePreviewAudio');
    if(!box)return;
    const items=existing||buildPreviewItems70();
    if(!items.length){box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';if(now)now.textContent='Noch kein Medium ausgewählt.';return;}
    if(regiePreviewIndex>=items.length)regiePreviewIndex=0;
    box.innerHTML=items.map((item,i)=>{
      const active=i===regiePreviewIndex;
      if(item.kind==='audio'){
        const playing=active&&audio&&!audio.paused;
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active':''}" data-regie-preview-select="${i}" title="${esc(item.url||item.name||'')}"><div><b>${esc(item.what||'Audio')}</b><span>${esc(item.start||'')}</span><div class="regiePreviewAudioFileLine"><b>${playing?'PLAY':'AUDIO FILE'}</b><span>${esc(item.name)}</span></div></div></div>`;
      }
      const audioLine=`<div class="regiePreviewAudioLine ${item.audioName?'':'noAudio'}"><b>AUDIO</b><span>${esc(item.audioName||'—')}</span></div>`;
      return `<div class="regiePreviewItem ${active?'active':''}" data-regie-preview-select="${i}" title="${esc(item.url||item.name||'')}"><div><b>${esc(item.name)}</b><span>${esc((item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||''))}</span>${audioLine}</div></div>`;
    }).join('');
    $$('[data-regie-preview-select]').forEach(el=>el.addEventListener('click',()=>playRegiePreview(el.dataset.regiePreviewSelect)));
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };
  const style=document.createElement('style');
  style.textContent=`
    .regiePreviewAudioOnly>div>b{color:#fff!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;}
    .regiePreviewAudioOnly>div>span{display:block;color:#ffd6d6!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important;}
    .regiePreviewAudioFileLine span{white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important;}
  `;
  document.head.appendChild(style);
  setTimeout(()=>{try{renderRegiePreviewList();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 22 ---- */
(function(){
  function ensureAudio71(){
    const video=document.getElementById('regiePreviewVideo');
    if(!video)return null;
    let a=document.getElementById('regiePreviewAudio');
    if(!a){
      a=document.createElement('audio');
      a.id='regiePreviewAudio';
      a.preload='auto';
      a.controls=false;
      a.loop=false;
      video.insertAdjacentElement('afterend',a);
    }
    a.loop=false;
    if(!a.dataset.v71Ended){
      a.dataset.v71Ended='1';
      a.addEventListener('ended',()=>{
        const items=regieVideoItems();
        const item=items[regiePreviewIndex];
        if(item && item.kind==='audio'){
          if(regiePreviewIndex<items.length-1)playRegiePreview(regiePreviewIndex+1);
          else renderRegiePreviewList(items);
        }
      });
    }
    return a;
  }
  function nearestPreviousVideo(items,index){
    for(let i=Math.min(index-1,items.length-1);i>=0;i--){
      if(items[i]&&items[i].kind==='video')return items[i];
    }
    for(let i=index+1;i<items.length;i++){
      if(items[i]&&items[i].kind==='video')return items[i];
    }
    return null;
  }
  function setVideoItem(video,item){
    if(!video||!item||!item.url)return;
    const current=(video.currentSrc||video.src||'');
    if(current!==item.url){
      video.src=item.url;
      video.load();
    }
    video.loop=!!item.loop;
  }
  window.playRegiePreview=function(index){
    const items=regieVideoItems(),video=document.getElementById('regiePreviewVideo'),now=document.getElementById('regiePreviewNow'),audio=ensureAudio71();
    if(!items.length||!video)return;
    regiePreviewIndex=Math.max(0,Math.min(items.length-1,Number(index)||0));
    const item=items[regiePreviewIndex];
    if(item.kind==='audio'){
      const currentVideoSrc=(video.currentSrc||video.src||'');
      if(!currentVideoSrc){
        const prev=nearestPreviousVideo(items,regiePreviewIndex);
        if(prev)setVideoItem(video,prev);
      }
      if(video.src){
        video.loop=true;
        video.play().catch(()=>{});
      }
      if(audio&&item.url){
        if((audio.currentSrc||audio.src||'')!==item.url){audio.src=item.url;audio.load();}
        audio.loop=false;
        audio.style.display='block';
        try{audio.currentTime=0;}catch(e){}
        audio.play().catch(()=>{});
      }
      if(now)now.textContent=(item.start?item.start+' · ':'')+(item.what?item.what+' · ':'')+item.name;
    }else{
      setVideoItem(video,item);
      if(audio){
        if(item.audioUrl){
          if((audio.currentSrc||audio.src||'')!==item.audioUrl){audio.src=item.audioUrl;audio.load();}
          audio.loop=false;
          audio.style.display='block';
          try{audio.currentTime=0;}catch(e){}
          audio.play().catch(()=>{});
        }else{
          if(!audio.paused)audio.pause();
          audio.removeAttribute('src');
          audio.style.display='none';
        }
      }
      video.play().catch(()=>{});
      if(now)now.textContent=(item.start?item.start+' · ':'')+item.name+' · AUDIO '+(item.audioName||'—');
    }
    renderRegiePreviewList(items);
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };
  window.toggleRegiePreview=function(index){
    const items=regieVideoItems(),video=document.getElementById('regiePreviewVideo'),audio=ensureAudio71();
    if(!items.length)return;
    if(Number(index)!==regiePreviewIndex){playRegiePreview(index);return;}
    const item=items[regiePreviewIndex];
    if(item.kind==='audio'){
      if(!audio)return;
      if(audio.paused){
        if(video&&video.src&&video.paused)video.play().catch(()=>{});
        audio.play().catch(()=>{});
      }else{
        audio.pause();
      }
    }else{
      if(!video)return;
      if(video.paused){video.play().catch(()=>{});if(audio&&audio.src)audio.play().catch(()=>{});}else{video.pause();if(audio&&!audio.paused)audio.pause();}
    }
    renderRegiePreviewList(items);
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };
  const oldStep=window.regiePreviewStep;
  window.regiePreviewStep=function(dir){
    const items=regieVideoItems();
    if(!items.length)return;
    const next=Math.max(0,Math.min(items.length-1,(Number(regiePreviewIndex)||0)+dir));
    playRegiePreview(next);
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
  };
  setTimeout(()=>{try{ensureAudio71();renderRegiePreviewList();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 23 ---- */
(function(){
  function base72(v){return String(v||'').split(/[\\/]/).pop().trim();}
  function clean72(v){return decodeURIComponent(base72(v).split('?')[0].split('#')[0]||'').trim();}
  function key72(v){return clean72(v).toLowerCase();}
  function mime72(name,type){
    const t=String(type||'').toLowerCase();
    if(t)return t;
    const e=clean72(name).split('.').pop().toLowerCase();
    if(e==='mp4'||e==='m4v')return 'video/mp4';
    if(e==='mov')return 'video/quicktime';
    if(e==='webm')return 'video/webm';
    if(e==='mp3')return 'audio/mpeg';
    if(e==='wav'||e==='wave')return 'audio/wav';
    if(['m4a','aac','ogg','flac'].includes(e))return 'audio/'+e;
    return '';
  }
  function source72(m){return m?.remoteUrl||m?.url||m?.data||'';}
  function knownAudioUrl72(name){return 'https://usa.derhacker.com/CONTENT/ALLGMEIN/'+encodeURIComponent(clean72(name));}
  function audioFromText72(txt){
    const s=String(txt||'');
    const hit=s.match(/(Katja_B\.mp3|awards\.mp3|PLATZ_NEHMEN\.wav|[^\s,;]+\.(?:mp3|wav|wave|m4a|aac|ogg|flac))/i);
    if(!hit)return null;
    const name=clean72(hit[1]);
    const type=mime72(name);
    return {name,type,mime:type,url:knownAudioUrl72(name),remoteUrl:knownAudioUrl72(name),remote:true,isAudio:true};
  }
  function normalizeAudio72(m){
    if(!m)return null;
    const name=clean72(m.name||m.relativePath||m.url||m.remoteUrl||'Audio');
    const type=mime72(name,m.type||m.mime);
    if(!type.startsWith('audio/'))return null;
    let url=source72(m)||knownAudioUrl72(name);
    if(!/^https?:\/\//i.test(url)&&!/^data:/i.test(url)&&!/^blob:/i.test(url))url=knownAudioUrl72(url);
    return {...m,name,type,mime:type,url,remoteUrl:url,remote:!!url,isAudio:true};
  }
  function rowAudio72(r){return normalizeAudio72(r?.soundMedia)||audioFromText72(r?.sound)||null;}
  function firstVideo72(r){
    for(const s of (state.screens||[])){
      const m=r?.screens?.[s.id]?.media;
      const type=mime72(m?.name||m?.url||m?.remoteUrl||'',m?.type||m?.mime);
      if(m&&type.startsWith('video/'))return {screen:s.id,media:m};
    }
    return null;
  }
  function mediaKey72(kind,m,url){
    return kind+'|'+String(url||source72(m)||m?.name||'').split('?')[0].split('#')[0].toLowerCase().trim();
  }
  window.regieVideoItems=function(){
    const items=[];
    let lastKey='';
    (state.rows||[]).forEach((r,rowIndex)=>{
      if(!r||r.isBlock)return;
      const audio=rowAudio72(r);
      const found=firstVideo72(r);
      if(found){
        const m=found.media;
        const url=source72(m);
        const key=mediaKey72('video',m,url);
        if(key&&key!==lastKey){
          items.push({kind:'video',rowId:r.id,rowIndex,name:m.name||'Video',url,screen:found.screen,start:r.start||'',what:r.what||'',loop:!!(m.isLoop||m.loop),audioName:audio?.name||'',audioUrl:audio?source72(audio):'',audioType:audio?.type||''});
        }
        lastKey=key;
        return;
      }
      if(audio){
        const url=source72(audio);
        const key=mediaKey72('audio',audio,url);
        if(key&&key!==lastKey){
          items.push({kind:'audio',rowId:r.id,rowIndex,name:audio.name||'Audio',url,type:audio.type||audio.mime||mime72(audio.name),start:r.start||'',what:r.what||'',loop:false});
        }
        lastKey=key;
        return;
      }
      lastKey='';
    });
    return items;
  };
  setTimeout(()=>{try{renderRegiePreviewList();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 24 ---- */
(function(){
  function cueMap74(){
    const map={};
    let cue=0;
    (window.state?.rows||[]).forEach(r=>{ if(!r||r.isBlock)return; cue++; map[r.id]=cue; });
    return map;
  }
  const baseItems74=window.regieVideoItems;
  if(typeof baseItems74==='function'){
    window.regieVideoItems=function(){
      const map=cueMap74();
      return (baseItems74.apply(this,arguments)||[]).map(item=>{
        const cue=item.cue||map[item.rowId]||'';
        return Object.assign({},item,{cue});
      });
    };
  }
  function esc74(s){return (typeof esc==='function')?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function clean74(v){
    try{return decodeURIComponent(String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'').trim();}
    catch(e){return String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'';}
  }
  window.renderRegiePreviewList=function(existing=null){
    const box=document.getElementById('regiePreviewList');
    const video=document.getElementById('regiePreviewVideo');
    const audio=document.getElementById('regiePreviewAudio');
    const now=document.getElementById('regiePreviewNow');
    if(!box)return;
    const items=existing||((typeof regieVideoItems==='function')?regieVideoItems():[]);
    if(!items.length){
      box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';
      if(now)now.textContent='Noch kein Medium ausgewählt.';
      if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
      return;
    }
    if(window.regiePreviewIndex>=items.length)window.regiePreviewIndex=0;
    box.innerHTML=items.map((item,i)=>{
      const active=i===window.regiePreviewIndex;
      const cue=item.cue?`<em class="regieCueBadge">CUE ${esc74(item.cue)}</em>`:'';
      if(item.kind==='audio'){
        const playing=active&&audio&&!audio.paused;
        const playBadge=active?`<em class="nowPlayingBadge ${playing?'isPlaying':'isSelected'}">${playing?'SPIELT':'AUSGEWÄHLT'}</em>`:'';
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active':''}" data-regie-preview-select="${i}" title="${esc74(item.url||item.name||'')}"><div>${playBadge}<div class="regiePreviewTopLine">${cue}<b>${esc74(item.what||'Audio')}</b></div><span>${esc74(item.start||'')}</span><div class="regiePreviewAudioFileLine"><b>AUDIO FILE</b><span>${esc74(item.name)}</span></div></div></div>`;
      }
      const videoPlaying=active&&video&&!video.paused;
      const playBadge=active?`<em class="nowPlayingBadge ${videoPlaying?'isPlaying':'isSelected'}">${videoPlaying?'SPIELT':'AUSGEWÄHLT'}</em>`:'';
      const audioLine=`<div class="regiePreviewAudioLine ${item.audioName?'':'noAudio'}"><b>AUDIO</b><span>${esc74(item.audioName||'—')}</span></div>`;
      return `<div class="regiePreviewItem ${active?'active':''}" data-regie-preview-select="${i}" title="${esc74(item.url||item.name||'')}"><div>${playBadge}<div class="regiePreviewTopLine">${cue}<b>${esc74(item.name)}</b></div><span>${esc74((item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||''))}</span>${audioLine}</div></div>`;
    }).join('');
    document.querySelectorAll('[data-regie-preview-select]').forEach(el=>el.addEventListener('click',()=>playRegiePreview(el.dataset.regiePreviewSelect)));
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
    if(typeof updateRegieNowPlaying==='function')setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},0);
  };
  window.updateRegieNowPlaying=function(){
    const now=document.getElementById('regiePreviewNow');
    if(!now)return;
    let box=document.getElementById('regiePreviewCurrentFiles');
    if(!box){box=document.createElement('div');box.id='regiePreviewCurrentFiles';box.className='regiePreviewCurrentFiles';now.insertAdjacentElement('afterend',box);}
    const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
    if(!items.length){box.innerHTML='';return;}
    const idx=Math.max(0,Math.min(items.length-1,Number(window.regiePreviewIndex||0)));
    const item=items[idx];
    const video=document.getElementById('regiePreviewVideo');
    const audio=document.getElementById('regiePreviewAudio');
    const videoPlaying=!!(video&&video.src&&!video.paused&&!video.ended);
    const audioPlaying=!!(audio&&audio.src&&!audio.paused&&!audio.ended);
    const cue=item.cue?`<i>CUE ${esc74(item.cue)}</i>`:'';
    const rows=[];
    if(item.kind==='audio'){
      rows.push(`<div class="nowLine ${audioPlaying?'audioPlaying':'selected'}">${cue}<b>${audioPlaying?'SPIELT AUDIO':'AUDIO AUSGEWÄHLT'}</b><span>${esc74(item.name||'Audio')}</span></div>`);
      const videoName=clean74(video?.currentSrc||video?.src||'');
      if(videoName)rows.push(`<div class="nowLine videoCarry"><b>VIDEO BLEIBT</b><span>${esc74(videoName)}</span></div>`);
    }else{
      rows.push(`<div class="nowLine ${videoPlaying?'playing':'selected'}">${cue}<b>${videoPlaying?'SPIELT VIDEO':'VIDEO AUSGEWÄHLT'}</b><span>${esc74(item.name||'Video')}</span></div>`);
      if(item.audioName||audioPlaying){
        const aName=item.audioName||clean74(audio?.currentSrc||audio?.src||'');
        rows.push(`<div class="nowLine ${audioPlaying?'audioPlaying':'selected'}"><b>${audioPlaying?'SPIELT AUDIO':'AUDIO'}</b><span>${esc74(aName||'—')}</span></div>`);
      }
    }
    box.innerHTML=rows.join('');
  };
  const style=document.createElement('style');
  style.textContent=`
    .regiePreviewTopLine{display:flex;align-items:center;gap:6px;min-width:0;}
    .regiePreviewTopLine>b{min-width:0;overflow:visible!important;text-overflow:clip!important;white-space:nowrap!important;}
    .regieCueBadge{flex:0 0 auto;display:inline-flex;align-items:center;border-radius:999px;padding:3px 7px;background:rgba(201,255,25,.16);color:var(--lime);font-size:9px;font-style:normal;font-weight:900;letter-spacing:.04em;line-height:1;}
    .regiePreviewAudioOnly .regieCueBadge{background:rgba(255,88,88,.18);color:#ff7b7b;}
    .regiePreviewCurrentFiles .nowLine i{flex:0 0 auto;display:inline-flex;border-radius:999px;padding:3px 7px;background:rgba(201,255,25,.16);color:var(--lime);font-size:9px;font-style:normal;font-weight:900;line-height:1;}
  `;
  document.head.appendChild(style);
  setTimeout(()=>{try{renderRegiePreviewList();updateRegieNowPlaying();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 25 ---- */
(function(){
  function esc75(s){return (typeof esc==='function')?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function itemKey75(item,index){
    return [item?.kind||'', item?.rowId||'', item?.rowIndex??'', item?.url||'', item?.name||'', index??''].join('||');
  }
  function findIndexByKey75(key){
    const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
    let idx=items.findIndex((item,i)=>itemKey75(item,i)===key);
    if(idx<0)idx=Number(String(key||'').split('||').pop());
    if(!Number.isFinite(idx))idx=0;
    return Math.max(0,Math.min(items.length-1,idx));
  }
  window.playRegiePreviewExact=function(key){
    const idx=findIndexByKey75(key);
    if(typeof playRegiePreview==='function')playRegiePreview(idx);
  };
  window.renderRegiePreviewList=function(existing=null){
    const box=document.getElementById('regiePreviewList');
    const video=document.getElementById('regiePreviewVideo');
    const audio=document.getElementById('regiePreviewAudio');
    const now=document.getElementById('regiePreviewNow');
    if(!box)return;
    const items=existing||((typeof regieVideoItems==='function')?regieVideoItems():[]);
    if(!items.length){
      box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';
      if(now)now.textContent='Noch kein Medium ausgewählt.';
      if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
      return;
    }
    if(window.regiePreviewIndex>=items.length)window.regiePreviewIndex=0;
    box.innerHTML=items.map((item,i)=>{
      const active=i===window.regiePreviewIndex;
      const key=itemKey75(item,i);
      const cue=item.cue?`<em class="regieCueBadge">CUE ${esc75(item.cue)}</em>`:'';
      if(item.kind==='audio'){
        const playing=active&&audio&&!audio.paused;
        const playBadge=active?`<em class="nowPlayingBadge ${playing?'isPlaying':'isSelected'}">${playing?'SPIELT':'AUSGEWÄHLT'}</em>`:'';
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active':''}" data-regie-preview-key="${esc75(key)}" title="${esc75(item.url||item.name||'')}"><div>${playBadge}<div class="regiePreviewTopLine">${cue}<b>${esc75(item.what||'Audio')}</b></div><span>${esc75(item.start||'')}</span><div class="regiePreviewAudioFileLine"><b>AUDIO FILE</b><span>${esc75(item.name)}</span></div></div></div>`;
      }
      const videoPlaying=active&&video&&!video.paused;
      const playBadge=active?`<em class="nowPlayingBadge ${videoPlaying?'isPlaying':'isSelected'}">${videoPlaying?'SPIELT':'AUSGEWÄHLT'}</em>`:'';
      const audioLine=`<div class="regiePreviewAudioLine ${item.audioName?'':'noAudio'}"><b>AUDIO</b><span>${esc75(item.audioName||'—')}</span></div>`;
      return `<div class="regiePreviewItem ${active?'active':''}" data-regie-preview-key="${esc75(key)}" title="${esc75(item.url||item.name||'')}"><div>${playBadge}<div class="regiePreviewTopLine">${cue}<b>${esc75(item.name)}</b></div><span>${esc75((item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||''))}</span>${audioLine}</div></div>`;
    }).join('');
    document.querySelectorAll('[data-regie-preview-key]').forEach(el=>{
      el.addEventListener('click',()=>window.playRegiePreviewExact(el.dataset.regiePreviewKey));
      el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();window.playRegiePreviewExact(el.dataset.regiePreviewKey);}});
      el.setAttribute('tabindex','0');
      el.setAttribute('role','button');
    });
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
    if(typeof updateRegieNowPlaying==='function')setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},0);
  };
  setTimeout(()=>{try{renderRegiePreviewList();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 26 ---- */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .regiePreviewAudioOnly .regiePreviewTopLine{display:flex!important;align-items:center!important;gap:6px!important;width:100%!important;}
    .regiePreviewAudioOnly .regiePreviewTopLine>b{order:1;min-width:0;}
    .regiePreviewAudioOnly .regiePreviewTopLine .regieCueBadge{order:3;margin-left:auto;flex:0 0 auto;}
    #undoBtn{border-color:rgba(201,255,25,.28);}
    #undoBtn:hover{border-color:rgba(201,255,25,.75);background:rgba(201,255,25,.14)}
  `;
  document.head.appendChild(style);

  const undoKey='regieplan_undo_history_v79';
  let undoBusy=false;
  function currentJson(){
    try{
      if(typeof exportableState==='function')return JSON.stringify(exportableState());
      return JSON.stringify(window.state||{});
    }catch(e){return '';}
  }
  function getHistory(){
    try{return JSON.parse(localStorage.getItem(undoKey)||'[]')||[];}catch(e){return [];}
  }
  function setHistory(h){
    try{localStorage.setItem(undoKey,JSON.stringify((h||[]).slice(-40)));}catch(e){}
  }
  function rememberPrevious(){
    if(undoBusy)return;
    try{
      const prev=localStorage.getItem('regieplan_webapp_v36');
      const now=currentJson();
      if(!prev || !now || prev===now)return;
      const hist=getHistory();
      if(hist[hist.length-1]!==prev)hist.push(prev);
      setHistory(hist);
    }catch(e){}
  }
  const originalSave=window.saveLocal;
  if(typeof originalSave==='function'){
    window.saveLocal=function(){
      rememberPrevious();
      return originalSave.apply(this,arguments);
    };
  }
  window.undoRegieplan=function(){
    const hist=getHistory();
    const prev=hist.pop();
    if(!prev){
      const btn=document.getElementById('undoBtn');
      if(btn){const old=btn.textContent;btn.textContent='Nichts zurück';setTimeout(()=>btn.textContent=old,900);}else alert('Kein vorheriger Stand vorhanden.');
      return;
    }
    setHistory(hist);
    try{
      undoBusy=true;
      localStorage.setItem('regieplan_webapp_v36',prev);
      window.location.reload();
    }catch(e){
      undoBusy=false;
      console.warn(e);
      alert('Zurück konnte nicht geladen werden.');
    }
  };
  function addUndoButton(){
    const bar=document.querySelector('.topActions');
    if(!bar || document.getElementById('undoBtn'))return;
    const btn=document.createElement('button');
    btn.className='btn';
    btn.id='undoBtn';
    btn.type='button';
    btn.textContent='Zurück';
    btn.title='Letzte Änderung rückgängig machen';
    btn.addEventListener('click',()=>window.undoRegieplan());
    const local=document.getElementById('serverSaveBtn');
    if(local&&local.parentNode===bar)bar.insertBefore(btn,local.nextSibling);else bar.insertBefore(btn,bar.firstChild);
  }
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&String(e.key).toLowerCase()==='z'){
      const tag=(document.activeElement?.tagName||'').toLowerCase();
      if(tag==='input'||tag==='textarea'||document.activeElement?.isContentEditable)return;
      e.preventDefault();
      window.undoRegieplan();
    }
  });
  ['DOMContentLoaded','load'].forEach(ev=>window.addEventListener(ev,addUndoButton));
  setTimeout(addUndoButton,0);
  setTimeout(addUndoButton,400);
})();

/* ---- script block 27 ---- */
(function(){
  function esc81(s){return (typeof esc==='function')?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function itemKey81(item,index){
    return [item?.kind||'', item?.rowId||'', item?.rowIndex??'', item?.url||'', item?.name||'', index??''].join('||');
  }
  window.renderRegiePreviewList=function(existing=null){
    const box=document.getElementById('regiePreviewList');
    const now=document.getElementById('regiePreviewNow');
    if(!box)return;
    const items=existing||((typeof regieVideoItems==='function')?regieVideoItems():[]);
    if(!items.length){
      box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';
      if(now)now.textContent='Noch kein Medium ausgewählt.';
      if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
      return;
    }
    if(window.regiePreviewIndex>=items.length)window.regiePreviewIndex=0;
    box.innerHTML=items.map((item,i)=>{
      const active=i===window.regiePreviewIndex;
      const key=itemKey81(item,i);
      const cue=item.cue?`<em class="regieCueRight">CUE ${esc81(item.cue)}</em>`:'';
      if(item.kind==='audio'){
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active':''}" data-regie-preview-key="${esc81(key)}" title="${esc81(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc81(item.what||'Audio')}</b></div><span>${esc81(item.start||'')}</span><div class="regiePreviewAudioFileLine"><b>AUDIO FILE</b><span>${esc81(item.name||'')}</span>${cue}</div></div></div>`;
      }
      const info=(item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||'');
      const audioLine=`<div class="regiePreviewAudioLine ${item.audioName?'':'noAudio'}"><b>AUDIO</b><span>${esc81(item.audioName||'—')}</span>${cue}</div>`;
      return `<div class="regiePreviewItem ${active?'active':''}" data-regie-preview-key="${esc81(key)}" title="${esc81(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc81(item.name||'')}</b></div><span>${esc81(info)}</span>${audioLine}</div></div>`;
    }).join('');
    document.querySelectorAll('[data-regie-preview-key]').forEach(el=>{
      el.addEventListener('click',()=>window.playRegiePreviewExact?window.playRegiePreviewExact(el.dataset.regiePreviewKey):(typeof playRegiePreview==='function'&&playRegiePreview(el.dataset.regiePreviewKey)));
      el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();window.playRegiePreviewExact?window.playRegiePreviewExact(el.dataset.regiePreviewKey):(typeof playRegiePreview==='function'&&playRegiePreview(el.dataset.regiePreviewKey));}});
      el.setAttribute('tabindex','0');
      el.setAttribute('role','button');
    });
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
    if(typeof updateRegieNowPlaying==='function')setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},0);
  };
  setTimeout(()=>{try{renderRegiePreviewList();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 28 ---- */
(function(){
  function esc82(s){return (typeof esc==='function')?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function itemKey82(item,index){return [item?.kind||'',item?.rowId||'',item?.rowIndex??'',item?.url||'',item?.name||'',index??''].join('||');}
  window.renderRegiePreviewList=function(existing=null){
    const box=document.getElementById('regiePreviewList');
    const now=document.getElementById('regiePreviewNow');
    if(!box)return;
    const items=existing||((typeof regieVideoItems==='function')?regieVideoItems():[]);
    if(!items.length){
      box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';
      if(now)now.textContent='Noch kein Medium ausgewählt.';
      if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
      return;
    }
    if(window.regiePreviewIndex>=items.length)window.regiePreviewIndex=0;
    box.innerHTML=items.map((item,i)=>{
      const active=i===window.regiePreviewIndex;
      const key=itemKey82(item,i);
      const cue=item.cue?`<em class="regieCueRight">CUE ${esc82(item.cue)}</em>`:'';
      if(item.kind==='audio'){
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active playingOutline':''}" data-regie-preview-key="${esc82(key)}" title="${esc82(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc82(item.what||'Audio')}</b></div><span>${esc82(item.start||'')}</span><div class="regiePreviewAudioFileLine"><b>AUDIO FILE</b><span>${esc82(item.name||'')}</span>${cue}</div></div></div>`;
      }
      const hasAudio=!!item.audioName;
      const info=(item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||'');
      const audioLine=`<div class="regiePreviewAudioLine ${hasAudio?'':'noAudio'}"><b>AUDIO</b><span>${esc82(hasAudio?item.audioName:'—')}</span>${cue}</div>`;
      return `<div class="regiePreviewItem ${hasAudio?'hasRegieAudio':'noRegieAudio'} ${active?'active playingOutline':''}" data-regie-preview-key="${esc82(key)}" title="${esc82(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc82(item.name||'')}</b></div><span>${esc82(info)}</span>${audioLine}</div></div>`;
    }).join('');
    document.querySelectorAll('[data-regie-preview-key]').forEach(el=>{
      el.addEventListener('click',()=>window.playRegiePreviewExact?window.playRegiePreviewExact(el.dataset.regiePreviewKey):(typeof playRegiePreview==='function'&&playRegiePreview(el.dataset.regiePreviewKey)));
      el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();window.playRegiePreviewExact?window.playRegiePreviewExact(el.dataset.regiePreviewKey):(typeof playRegiePreview==='function'&&playRegiePreview(el.dataset.regiePreviewKey));}});
      el.setAttribute('tabindex','0');
      el.setAttribute('role','button');
    });
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
    if(typeof updateRegieNowPlaying==='function')setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},0);
  };
  setTimeout(()=>{try{renderRegiePreviewList();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 29 ---- */
(function(){
  function esc83(s){return (typeof esc==='function')?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function itemKey83(item,index){return [item?.kind||'',item?.rowId||'',item?.rowIndex??'',item?.url||'',item?.name||'',index??''].join('||');}
  function cueNo83(item,i){return item?.cue || (Number.isFinite(Number(item?.rowIndex))?Number(item.rowIndex)+1:i+1);}
  function hasAudio83(item){
    const a=String(item?.audioName||'').trim();
    return !!(a && a!=='—' && a!=='-' && a.toLowerCase()!=='null' && a.toLowerCase()!=='undefined');
  }
  window.renderRegiePreviewList=function(existing=null){
    const box=document.getElementById('regiePreviewList');
    const now=document.getElementById('regiePreviewNow');
    if(!box)return;
    const items=existing||((typeof regieVideoItems==='function')?regieVideoItems():[]);
    if(!items.length){
      box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';
      if(now)now.textContent='Noch kein Medium ausgewählt.';
      if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
      return;
    }
    if(window.regiePreviewIndex>=items.length)window.regiePreviewIndex=0;
    box.innerHTML=items.map((item,i)=>{
      const active=i===window.regiePreviewIndex;
      const key=itemKey83(item,i);
      const cue=`<em class="regiePreviewCueNo">${esc83(cueNo83(item,i))}</em>`;
      if(item.kind==='audio'){
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active playingOutline':''}" data-regie-preview-key="${esc83(key)}" title="${esc83(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc83(item.what||'Audio')}</b></div><span>${esc83(item.start||'')}</span><div class="regiePreviewAudioFileLine"><b>AUDIO FILE</b><span>${esc83(item.name||'')}</span></div></div>${cue}</div>`;
      }
      const hasAudio=hasAudio83(item);
      const info=(item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||'');
      const audioLine=`<div class="regiePreviewAudioLine ${hasAudio?'':'noAudio'}"><b>AUDIO</b><span>${esc83(hasAudio?item.audioName:'—')}</span></div>`;
      return `<div class="regiePreviewItem ${hasAudio?'hasRegieAudio':'noRegieAudio'} ${active?'active playingOutline':''}" data-regie-preview-key="${esc83(key)}" title="${esc83(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc83(item.name||'')}</b></div><span>${esc83(info)}</span>${audioLine}</div>${cue}</div>`;
    }).join('');
    document.querySelectorAll('[data-regie-preview-key]').forEach(el=>{
      el.addEventListener('click',()=>window.playRegiePreviewExact?window.playRegiePreviewExact(el.dataset.regiePreviewKey):(typeof playRegiePreview==='function'&&playRegiePreview(el.dataset.regiePreviewKey)));
      el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();window.playRegiePreviewExact?window.playRegiePreviewExact(el.dataset.regiePreviewKey):(typeof playRegiePreview==='function'&&playRegiePreview(el.dataset.regiePreviewKey));}});
      el.setAttribute('tabindex','0');
      el.setAttribute('role','button');
    });
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
    if(typeof updateRegieNowPlaying==='function')setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},0);
  };
  setTimeout(()=>{try{renderRegiePreviewList();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 30 ---- */
(function(){
  function esc84(s){return (typeof esc==='function')?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function itemKey84(item,index){return [item?.kind||'',item?.rowId||'',item?.rowIndex??'',item?.url||'',item?.name||'',index??''].join('||');}
  function cueNo84(item,i){return item?.cue || (Number.isFinite(Number(item?.rowIndex))?Number(item.rowIndex)+1:i+1);}
  function validAudioName84(v){
    const a=String(v||'').trim();
    return !!(a && a!=='—' && a!=='-' && a.toLowerCase()!=='null' && a.toLowerCase()!=='undefined');
  }
  function linkedAudio84(items,i,item){
    if(validAudioName84(item?.audioName))return item.audioName;
    const next=items[i+1];
    if(next && next.kind==='audio' && validAudioName84(next.name))return next.name;
    return '';
  }
  window.renderRegiePreviewList=function(existing=null){
    const box=document.getElementById('regiePreviewList');
    const now=document.getElementById('regiePreviewNow');
    if(!box)return;
    const items=existing||((typeof regieVideoItems==='function')?regieVideoItems():[]);
    if(!items.length){
      box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';
      if(now)now.textContent='Noch kein Medium ausgewählt.';
      if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
      return;
    }
    if(window.regiePreviewIndex>=items.length)window.regiePreviewIndex=0;
    box.innerHTML=items.map((item,i)=>{
      const active=i===window.regiePreviewIndex;
      const key=itemKey84(item,i);
      const cue=`<em class="regiePreviewCueNo">${esc84(cueNo84(item,i))}</em>`;
      if(item.kind==='audio'){
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active playingOutline':''}" data-regie-preview-key="${esc84(key)}" title="${esc84(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc84(item.what||'Audio')}</b></div><span>${esc84(item.start||'')}</span><div class="regiePreviewAudioFileLine"><b>AUDIO FILE</b><span>${esc84(item.name||'')}</span></div></div>${cue}</div>`;
      }
      const linkedAudio=linkedAudio84(items,i,item);
      const hasAudio=validAudioName84(linkedAudio);
      const info=(item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||'');
      const audioLine=`<div class="regiePreviewAudioLine ${hasAudio?'':'noAudio'}"><b>AUDIO</b><span>${esc84(hasAudio?linkedAudio:'—')}</span></div>`;
      return `<div class="regiePreviewItem ${hasAudio?'hasRegieAudio':'noRegieAudio'} ${active?'active playingOutline':''}" data-regie-preview-key="${esc84(key)}" title="${esc84(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc84(item.name||'')}</b></div><span>${esc84(info)}</span>${audioLine}</div>${cue}</div>`;
    }).join('');
    document.querySelectorAll('[data-regie-preview-key]').forEach(el=>{
      el.addEventListener('click',()=>window.playRegiePreviewExact?window.playRegiePreviewExact(el.dataset.regiePreviewKey):(typeof playRegiePreview==='function'&&playRegiePreview(el.dataset.regiePreviewKey)));
      el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();window.playRegiePreviewExact?window.playRegiePreviewExact(el.dataset.regiePreviewKey):(typeof playRegiePreview==='function'&&playRegiePreview(el.dataset.regiePreviewKey));}});
      el.setAttribute('tabindex','0');
      el.setAttribute('role','button');
    });
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
    if(typeof updateRegieNowPlaying==='function')setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},0);
  };
  setTimeout(()=>{try{renderRegiePreviewList();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 31 ---- */
(function(){
  function markActivePreviewItemV85(){
    const idx=Number(window.regiePreviewIndex||0);
    document.querySelectorAll('.regiePreviewItem').forEach((el,i)=>{
      const isActive=i===idx;
      el.classList.toggle('active',isActive);
      el.classList.toggle('playingOutline',isActive);
      if(isActive)el.setAttribute('data-selected','1'); else el.removeAttribute('data-selected');
    });
  }
  const oldRender=window.renderRegiePreviewList;
  if(typeof oldRender==='function'){
    window.renderRegiePreviewList=function(){
      const result=oldRender.apply(this,arguments);
      setTimeout(markActivePreviewItemV85,0);
      return result;
    };
  }
  const oldPlay=window.playRegiePreview;
  if(typeof oldPlay==='function'){
    window.playRegiePreview=function(){
      const result=oldPlay.apply(this,arguments);
      setTimeout(markActivePreviewItemV85,0);
      setTimeout(markActivePreviewItemV85,80);
      return result;
    };
  }
  const oldExact=window.playRegiePreviewExact;
  if(typeof oldExact==='function'){
    window.playRegiePreviewExact=function(){
      const result=oldExact.apply(this,arguments);
      setTimeout(markActivePreviewItemV85,0);
      setTimeout(markActivePreviewItemV85,80);
      return result;
    };
  }
  ['DOMContentLoaded','load'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(markActivePreviewItemV85,0)));
  setTimeout(markActivePreviewItemV85,0);
  setInterval(markActivePreviewItemV85,700);
})();

/* ---- script block 32 ---- */
(function(){
  function clean86(v){
    try{return decodeURIComponent(String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'').trim();}
    catch(e){return String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'';}
  }
  function ext86(v){return clean86(v).split('.').pop().toLowerCase();}
  function isVideo86(v,type=''){
    const t=String(type||'').toLowerCase();
    const e=ext86(v);
    return t.startsWith('video/') || ['mp4','mov','m4v','webm'].includes(e);
  }
  function isAudio86(v,type=''){
    const t=String(type||'').toLowerCase();
    const e=ext86(v);
    return t.startsWith('audio/') || ['mp3','wav','wave','m4a','aac','ogg','flac'].includes(e);
  }
  function mime86(name,type=''){
    if(type)return type;
    const e=ext86(name);
    if(e==='mp3')return 'audio/mpeg';
    if(e==='wav'||e==='wave')return 'audio/wav';
    if(['m4a','aac','ogg','flac'].includes(e))return 'audio/'+e;
    if(['mp4','m4v'].includes(e))return 'video/mp4';
    if(e==='mov')return 'video/quicktime';
    if(e==='webm')return 'video/webm';
    return '';
  }
  function source86(m){return m?.remoteUrl||m?.url||m?.data||'';}
  function audioUrl86(name){return 'https://usa.derhacker.com/CONTENT/ALLGMEIN/'+encodeURIComponent(clean86(name));}
  function normalizeAudio86(m){
    if(!m)return null;
    const raw=m.name||m.relativePath||m.url||m.remoteUrl||'';
    const name=clean86(raw)||'Audio';
    const type=mime86(name,m.type||m.mime||'');
    if(!isAudio86(name,type))return null;
    let url=source86(m)||audioUrl86(name);
    if(!/^https?:\/\//i.test(url)&&!/^data:/i.test(url)&&!/^blob:/i.test(url))url=audioUrl86(url);
    return {name,type,mime:type,url,remoteUrl:url,remote:true,isAudio:true};
  }
  function audioFromText86(txt){
    const s=String(txt||'');
    const hit=s.match(/(Katja_B\.mp3|awards\.mp3|PLATZ_NEHMEN\.wav|[^\s,;]+\.(?:mp3|wav|wave|m4a|aac|ogg|flac))/i);
    if(!hit)return null;
    const name=clean86(hit[1]);
    return {name,type:mime86(name),mime:mime86(name),url:audioUrl86(name),remoteUrl:audioUrl86(name),remote:true,isAudio:true};
  }
  function rowAudio86(r){return normalizeAudio86(r?.soundMedia)||audioFromText86(r?.sound)||null;}
  function firstVideo86(r){
    for(const s of (window.state?.screens||[])){
      const m=r?.screens?.[s.id]?.media;
      if(!m)continue;
      const name=m.name||m.relativePath||m.url||m.remoteUrl||'';
      const type=m.type||m.mime||'';
      if(isVideo86(name,type))return {screen:s.id,media:m};
    }
    return null;
  }
  function key86(kind,m,url){
    return kind+'|'+String(url||source86(m)||m?.name||'').split('?')[0].split('#')[0].toLowerCase().trim();
  }
  function addAudioToItem86(item,a){
    if(!item||!a)return;
    item.audioNames=item.audioNames||[];
    const exists=item.audioNames.some(x=>String(x).toLowerCase()===String(a.name).toLowerCase());
    if(!exists)item.audioNames.push(a.name);
    item.audioName=item.audioNames.join(' + ');
    if(!item.audioUrl)item.audioUrl=a.url||a.remoteUrl||'';
    if(!item.audioType)item.audioType=a.type||a.mime||'';
  }
  window.regieVideoItems=function(){
    const items=[];
    let lastKey='';
    let lastItem=null;
    let cue=0;
    (window.state?.rows||[]).forEach((r,rowIndex)=>{
      if(!r||r.isBlock)return;
      cue++;
      const audio=rowAudio86(r);
      const found=firstVideo86(r);
      if(found){
        const m=found.media;
        const url=source86(m);
        const k=key86('video',m,url);
        if(k&&k===lastKey&&lastItem&&lastItem.kind==='video'){
          addAudioToItem86(lastItem,audio);
          lastItem.cues=lastItem.cues||[lastItem.cue].filter(Boolean);
          if(!lastItem.cues.includes(cue))lastItem.cues.push(cue);
          lastItem.lastCue=cue;
        }else{
          const item={kind:'video',rowId:r.id,rowIndex,name:m.name||clean86(url)||'Video',url,screen:found.screen,start:r.start||'',what:r.what||'',loop:!!(m.isLoop||m.loop),cue,firstCue:cue,lastCue:cue,audioName:'',audioNames:[],audioUrl:'',audioType:''};
          addAudioToItem86(item,audio);
          items.push(item);
          lastItem=item;
        }
        lastKey=k;
        return;
      }
      if(audio){
        const url=audio.url||audio.remoteUrl||'';
        const k=key86('audio',audio,url);
        if(k&&k===lastKey&&lastItem&&lastItem.kind==='audio'){
          lastItem.lastCue=cue;
          lastItem.cues=lastItem.cues||[lastItem.cue].filter(Boolean);
          if(!lastItem.cues.includes(cue))lastItem.cues.push(cue);
        }else{
          const item={kind:'audio',rowId:r.id,rowIndex,name:audio.name||'Audio',url,type:audio.type||audio.mime||mime86(audio.name),start:r.start||'',what:r.what||'',loop:false,cue,firstCue:cue,lastCue:cue};
          items.push(item);
          lastItem=item;
        }
        lastKey=k;
        return;
      }
      lastKey='';
      lastItem=null;
    });
    return items;
  };
  const style=document.createElement('style');
  style.textContent=`
    .regiePreviewItem.hasRegieAudio{opacity:1!important;border-color:rgba(201,255,25,.72)!important;background:rgba(201,255,25,.085)!important;}
    .regiePreviewItem.hasRegieAudio .regiePreviewAudioLine{opacity:1!important;}
    .regiePreviewItem.hasRegieAudio .regiePreviewAudioLine b{background:var(--lime)!important;color:#071007!important;}
    .regiePreviewItem.hasRegieAudio .regiePreviewAudioLine span{color:var(--text)!important;font-weight:900!important;}
  `;
  document.head.appendChild(style);
  setTimeout(()=>{try{if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 33 ---- */
(function(){
  function rows87(){try{return (typeof state!=='undefined' && state.rows)?state.rows:[];}catch(e){return [];}}
  function screens87(){try{return (typeof state!=='undefined' && state.screens)?state.screens:[];}catch(e){return [];}}
  function clean87(v){try{return decodeURIComponent(String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'').trim();}catch(e){return String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'';}}
  function ext87(v){return clean87(v).split('.').pop().toLowerCase();}
  function isVideo87(v,type=''){const t=String(type||'').toLowerCase();const e=ext87(v);return t.startsWith('video/')||['mp4','mov','m4v','webm'].includes(e);}
  function isAudio87(v,type=''){const t=String(type||'').toLowerCase();const e=ext87(v);return t.startsWith('audio/')||['mp3','wav','wave','m4a','aac','ogg','flac'].includes(e);}
  function mime87(name,type=''){
    if(type)return type;
    const e=ext87(name);
    if(e==='mp3')return 'audio/mpeg';
    if(e==='wav'||e==='wave')return 'audio/wav';
    if(['m4a','aac','ogg','flac'].includes(e))return 'audio/'+e;
    if(['mp4','m4v'].includes(e))return 'video/mp4';
    if(e==='mov')return 'video/quicktime';
    if(e==='webm')return 'video/webm';
    return '';
  }
  function src87(m){return m?.remoteUrl||m?.url||m?.data||'';}
  function audioUrl87(name){return 'https://usa.derhacker.com/CONTENT/ALLGMEIN/'+encodeURIComponent(clean87(name));}
  function normalizeAudio87(m){
    if(!m)return null;
    const raw=m.name||m.relativePath||m.url||m.remoteUrl||'';
    const name=clean87(raw)||'Audio';
    const type=mime87(name,m.type||m.mime||'');
    if(!isAudio87(name,type))return null;
    let url=src87(m)||audioUrl87(name);
    if(!/^https?:\/\//i.test(url)&&!/^data:/i.test(url)&&!/^blob:/i.test(url))url=audioUrl87(url);
    return {name,type,mime:type,url,remoteUrl:url,remote:true,isAudio:true};
  }
  function audioFromText87(txt){
    const s=String(txt||'');
    const hit=s.match(/(Katja_B\.mp3|awards\.mp3|PLATZ_NEHMEN\.wav|[^\s,;]+\.(?:mp3|wav|wave|m4a|aac|ogg|flac))/i);
    if(!hit)return null;
    const name=clean87(hit[1]);
    return {name,type:mime87(name),mime:mime87(name),url:audioUrl87(name),remoteUrl:audioUrl87(name),remote:true,isAudio:true};
  }
  function rowAudio87(r){return normalizeAudio87(r?.soundMedia)||audioFromText87(r?.sound)||null;}
  function firstVideo87(r){
    for(const s of screens87()){
      const m=r?.screens?.[s.id]?.media;
      if(!m)continue;
      const name=m.name||m.relativePath||m.url||m.remoteUrl||'';
      const type=m.type||m.mime||'';
      if(isVideo87(name,type))return {screen:s.id,media:m};
    }
    return null;
  }
  function key87(kind,m,url){return kind+'|'+String(url||src87(m)||m?.name||'').split('?')[0].split('#')[0].toLowerCase().trim();}
  function addAudio87(item,a){
    if(!item||!a)return;
    item.audioNames=item.audioNames||[];
    if(!item.audioNames.some(x=>String(x).toLowerCase()===String(a.name).toLowerCase()))item.audioNames.push(a.name);
    item.audioName=item.audioNames.join(' + ');
    if(!item.audioUrl)item.audioUrl=a.url||a.remoteUrl||'';
    if(!item.audioType)item.audioType=a.type||a.mime||'';
  }
  window.regieVideoItems=function(){
    const items=[];
    let lastKey='';
    let lastItem=null;
    let cue=0;
    rows87().forEach((r,rowIndex)=>{
      if(!r||r.isBlock)return;
      cue++;
      const audio=rowAudio87(r);
      const found=firstVideo87(r);
      if(found){
        const m=found.media;
        const url=src87(m);
        const k=key87('video',m,url);
        if(k&&k===lastKey&&lastItem&&lastItem.kind==='video'){
          addAudio87(lastItem,audio);
          lastItem.lastCue=cue;
          lastItem.cues=lastItem.cues||[lastItem.cue].filter(Boolean);
          if(!lastItem.cues.includes(cue))lastItem.cues.push(cue);
        }else{
          const item={kind:'video',rowId:r.id,rowIndex,name:m.name||clean87(url)||'Video',url,screen:found.screen,start:r.start||'',what:r.what||'',loop:!!(m.isLoop||m.loop),cue,firstCue:cue,lastCue:cue,audioName:'',audioNames:[],audioUrl:'',audioType:''};
          addAudio87(item,audio);
          items.push(item);
          lastItem=item;
        }
        lastKey=k;
        return;
      }
      if(audio){
        const url=audio.url||audio.remoteUrl||'';
        const k=key87('audio',audio,url);
        if(k&&k===lastKey&&lastItem&&lastItem.kind==='audio'){
          lastItem.lastCue=cue;
          lastItem.cues=lastItem.cues||[lastItem.cue].filter(Boolean);
          if(!lastItem.cues.includes(cue))lastItem.cues.push(cue);
        }else{
          const item={kind:'audio',rowId:r.id,rowIndex,name:audio.name||'Audio',url,type:audio.type||audio.mime||mime87(audio.name),start:r.start||'',what:r.what||'',loop:false,cue,firstCue:cue,lastCue:cue};
          items.push(item);
          lastItem=item;
        }
        lastKey=k;
        return;
      }
      lastKey='';
      lastItem=null;
    });
    return items;
  };
  setTimeout(()=>{try{if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();}catch(e){console.warn(e);}},0);
})();

/* ---- script block 34 ---- */
(function(){
  function esc89(s){return (typeof esc==='function')?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function itemKey89(item,index){return [item?.kind||'',item?.rowId||'',item?.rowIndex??'',item?.url||'',item?.name||'',index??''].join('||');}
  function validAudio89(v){const s=String(v||'').trim();return !!(s&&s!=='—'&&s!=='-'&&!/^null$/i.test(s)&&!/^undefined$/i.test(s));}
  function linkedAudio89(items,i,item){
    if(validAudio89(item?.audioName))return item.audioName;
    if(Array.isArray(item?.audioNames)&&item.audioNames.length)return item.audioNames.filter(validAudio89).join(' + ');
    const next=items[i+1];
    if(next&&next.kind==='audio'&&validAudio89(next.name))return next.name;
    return '';
  }
  function cueNo89(item,i){return item?.cue || item?.firstCue || (Number.isFinite(Number(item?.rowIndex))?Number(item.rowIndex)+1:i+1);}
  function clampIndex89(items){
    let idx=Number(window.regiePreviewIndex);
    if(!Number.isFinite(idx)||idx<0)idx=0;
    if(items.length&&idx>=items.length)idx=items.length-1;
    window.regiePreviewIndex=idx;
    return idx;
  }
  function render89(existing=null){
    const box=document.getElementById('regiePreviewList');
    const now=document.getElementById('regiePreviewNow');
    if(!box)return;
    const items=existing||((typeof regieVideoItems==='function')?regieVideoItems():[]);
    if(!items.length){
      box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';
      if(now)now.textContent='Noch kein Medium ausgewählt.';
      if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
      return;
    }
    const idx=clampIndex89(items);
    box.innerHTML=items.map((item,i)=>{
      const active=i===idx;
      const key=itemKey89(item,i);
      const cue=`<em class="regiePreviewCueNo">${esc89(cueNo89(item,i))}</em>`;
      if(item.kind==='audio'){
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active isPreviewSelected playingOutline':''}" data-regie-preview-key="${esc89(key)}" title="${esc89(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc89(item.what||'Audio')}</b></div><span>${esc89(item.start||'')}</span><div class="regiePreviewAudioFileLine"><b>AUDIO FILE</b><span>${esc89(item.name||'')}</span></div></div>${cue}</div>`;
      }
      const linkedAudio=linkedAudio89(items,i,item);
      const hasAudio=validAudio89(linkedAudio);
      const info=(item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||'');
      const audioLine=`<div class="regiePreviewAudioLine ${hasAudio?'':'noAudio'}"><b>AUDIO</b><span>${esc89(hasAudio?linkedAudio:'—')}</span></div>`;
      return `<div class="regiePreviewItem ${hasAudio?'hasRegieAudio':'noRegieAudio'} ${active?'active isPreviewSelected playingOutline':''}" data-regie-preview-key="${esc89(key)}" title="${esc89(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc89(item.name||'')}</b></div><span>${esc89(info)}</span>${audioLine}</div>${cue}</div>`;
    }).join('');
    document.querySelectorAll('[data-regie-preview-key]').forEach(el=>{
      el.addEventListener('click',()=>{
        const all=Array.from(document.querySelectorAll('#regiePreviewList .regiePreviewItem'));
        const idx=all.indexOf(el);
        if(idx>=0)window.regiePreviewIndex=idx;
        if(window.playRegiePreviewExact)window.playRegiePreviewExact(el.dataset.regiePreviewKey);
        else if(typeof playRegiePreview==='function')playRegiePreview(idx);
      });
      el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();el.click();}});
      el.setAttribute('tabindex','0');
      el.setAttribute('role','button');
    });
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
    if(typeof updateRegieNowPlaying==='function')setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},0);
  }
  window.renderRegiePreviewList=render89;

  const oldPlay=window.playRegiePreview;
  if(typeof oldPlay==='function'){
    window.playRegiePreview=function(index){
      const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
      let idx=Number(index);
      if(!Number.isFinite(idx))idx=Number(window.regiePreviewIndex)||0;
      idx=Math.max(0,Math.min(items.length-1,idx));
      window.regiePreviewIndex=idx;
      const ret=oldPlay.call(this,idx);
      setTimeout(()=>render89(),0);
      setTimeout(()=>render89(),120);
      return ret;
    };
  }
  window.playRegiePreviewExact=function(key){
    const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
    let idx=items.findIndex((item,i)=>itemKey89(item,i)===key);
    if(idx<0)idx=Number(String(key||'').split('||').pop());
    if(!Number.isFinite(idx))idx=0;
    idx=Math.max(0,Math.min(items.length-1,idx));
    window.regiePreviewIndex=idx;
    if(typeof window.playRegiePreview==='function')window.playRegiePreview(idx);
    else render89(items);
  };
  document.addEventListener('click',ev=>{
    const el=ev.target.closest?.('#regiePreviewList .regiePreviewItem');
    if(!el)return;
    const all=Array.from(document.querySelectorAll('#regiePreviewList .regiePreviewItem'));
    const idx=all.indexOf(el);
    if(idx>=0)window.regiePreviewIndex=idx;
  },true);
  setTimeout(()=>render89(),0);
  setTimeout(()=>render89(),400);
})();

/* ---- script block 35 ---- */
(function(){
  function esc90(s){return (typeof esc==='function')?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function clean90(v){try{return decodeURIComponent(String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'').trim();}catch(e){return String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'';}}
  function ext90(v){const m=clean90(v).toLowerCase().match(/\.([a-z0-9]+)$/);return m?m[1]:'';}
  function isAudioName90(v,type=''){
    const s=String(v||'').trim();
    if(!s||s==='—'||s==='-'||/^null$/i.test(s)||/^undefined$/i.test(s))return false;
    const t=String(type||'').toLowerCase();
    const e=ext90(s);
    return t.startsWith('audio/') || ['mp3','wav','wave','m4a','aac','ogg','flac'].includes(e);
  }
  function rowAudioName90(r){
    if(!r)return '';
    const m=r.soundMedia||null;
    if(m){
      const n=m.name||m.filename||m.fileName||clean90(m.remoteUrl||m.url||m.src||m.data||'');
      if(isAudioName90(n,m.type||m.mime))return n;
    }
    const txt=String(r.sound||'');
    const match=txt.match(/[\w .()\-]+\.(mp3|wav|wave|m4a|aac|ogg|flac)\b/i);
    if(match)return clean90(match[0]);
    return '';
  }
  function cueRows90(){
    const rows=[]; let cue=0;
    try{(state.rows||[]).forEach(r=>{ if(!r||r.isBlock)return; cue++; rows[cue]=r; });}catch(e){}
    return rows;
  }
  function itemKey90(item,index){return [item?.kind||'',item?.rowId||'',item?.rowIndex??'',item?.url||'',item?.name||'',index??''].join('||');}
  function cueNo90(item,i){return item?.cue || item?.firstCue || (Number.isFinite(Number(item?.rowIndex))?Number(item.rowIndex)+1:i+1);}
  function rangeAudio90(item){
    const rows=cueRows90();
    let a=[];
    const first=Number(item?.firstCue||item?.cue||0);
    const last=Number(item?.lastCue||item?.cue||first);
    if(Number.isFinite(first)&&first>0){
      for(let c=first;c<=Math.max(first,last);c++){
        const n=rowAudioName90(rows[c]);
        if(n&&!a.some(x=>x.toLowerCase()===n.toLowerCase()))a.push(n);
      }
    }
    if(item?.rowId){
      try{
        const r=(state.rows||[]).find(x=>x&&x.id===item.rowId);
        const n=rowAudioName90(r);
        if(n&&!a.some(x=>x.toLowerCase()===n.toLowerCase()))a.push(n);
      }catch(e){}
    }
    return a.join(' + ');
  }
  function linkedAudio90(items,i,item){
    const fromRange=rangeAudio90(item);
    if(isAudioName90(fromRange))return fromRange;
    if(isAudioName90(item?.audioName))return item.audioName;
    if(Array.isArray(item?.audioNames)&&item.audioNames.length){
      const list=item.audioNames.filter(x=>isAudioName90(x));
      if(list.length)return list.join(' + ');
    }
    const next=items[i+1];
    if(next&&next.kind==='audio'&&isAudioName90(next.name))return next.name;
    return '';
  }
  function clamp90(items){let idx=Number(window.regiePreviewIndex);if(!Number.isFinite(idx)||idx<0)idx=0;if(items.length&&idx>=items.length)idx=items.length-1;window.regiePreviewIndex=idx;return idx;}
  function render90(existing=null){
    const box=document.getElementById('regiePreviewList');
    const now=document.getElementById('regiePreviewNow');
    if(!box)return;
    const items=existing||((typeof regieVideoItems==='function')?regieVideoItems():[]);
    if(!items.length){box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';if(now)now.textContent='Noch kein Medium ausgewählt.';if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();return;}
    const idx=clamp90(items);
    box.innerHTML=items.map((item,i)=>{
      const active=i===idx;
      const key=itemKey90(item,i);
      const cue=`<em class="regiePreviewCueNo">${esc90(cueNo90(item,i))}</em>`;
      if(item.kind==='audio'){
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active isPreviewSelected playingOutline':''}" data-regie-preview-key="${esc90(key)}" title="${esc90(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc90(item.what||'Audio')}</b></div><span>${esc90(item.start||'')}</span><div class="regiePreviewAudioFileLine"><b>AUDIO FILE</b><span>${esc90(item.name||'')}</span></div></div>${cue}</div>`;
      }
      const linked=linkedAudio90(items,i,item);
      const hasAudio=!!linked;
      const info=(item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||'');
      const audioLine=`<div class="regiePreviewAudioLine ${hasAudio?'':'noAudio'}"><b>AUDIO</b><span>${esc90(hasAudio?linked:'—')}</span></div>`;
      return `<div class="regiePreviewItem ${hasAudio?'hasRegieAudio':'noRegieAudio'} ${active?'active isPreviewSelected playingOutline':''}" data-regie-preview-key="${esc90(key)}" title="${esc90(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc90(item.name||'')}</b></div><span>${esc90(info)}</span>${audioLine}</div>${cue}</div>`;
    }).join('');
    document.querySelectorAll('[data-regie-preview-key]').forEach(el=>{
      el.addEventListener('click',()=>{const all=Array.from(document.querySelectorAll('#regiePreviewList .regiePreviewItem'));const idx=all.indexOf(el);if(idx>=0)window.regiePreviewIndex=idx;if(window.playRegiePreviewExact)window.playRegiePreviewExact(el.dataset.regiePreviewKey);else if(typeof playRegiePreview==='function')playRegiePreview(idx);});
      el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();el.click();}});
      el.setAttribute('tabindex','0');el.setAttribute('role','button');
    });
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
    if(typeof updateRegieNowPlaying==='function')setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},0);
  }
  window.renderRegiePreviewList=render90;
  const oldPlay=window.playRegiePreview;
  if(typeof oldPlay==='function'){
    window.playRegiePreview=function(index){
      const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
      let idx=Number(index); if(!Number.isFinite(idx))idx=Number(window.regiePreviewIndex)||0; idx=Math.max(0,Math.min(items.length-1,idx)); window.regiePreviewIndex=idx;
      const ret=oldPlay.call(this,idx); setTimeout(()=>render90(),0); setTimeout(()=>render90(),120); return ret;
    };
  }
  window.playRegiePreviewExact=function(key){
    const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
    let idx=items.findIndex((item,i)=>itemKey90(item,i)===key);
    if(idx<0)idx=Number(String(key||'').split('||').pop());
    if(!Number.isFinite(idx))idx=0; idx=Math.max(0,Math.min(items.length-1,idx)); window.regiePreviewIndex=idx;
    if(typeof window.playRegiePreview==='function')window.playRegiePreview(idx); else render90(items);
  };
  setTimeout(()=>render90(),0);setTimeout(()=>render90(),400);setTimeout(()=>render90(),1000);
})();

/* ---- script block 36 ---- */
(function(){
  function esc91(s){return (typeof esc==='function')?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function clean91(v){try{return decodeURIComponent(String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'').trim();}catch(e){return String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'';}}
  function ext91(v){const m=clean91(v).toLowerCase().match(/\.([a-z0-9]+)$/);return m?m[1]:'';}
  function isAudioFile91(v,type=''){
    const s=String(v||'').trim();
    if(!s||s==='—'||s==='-'||/^null$/i.test(s)||/^undefined$/i.test(s))return false;
    const t=String(type||'').toLowerCase();
    return t.startsWith('audio/') || ['mp3','wav','wave','m4a','aac','ogg','flac'].includes(ext91(s));
  }
  function rowExternalAudio91(r){
    if(!r)return '';
    const m=r.soundMedia||null;
    if(m){
      const n=m.name||m.filename||m.fileName||clean91(m.remoteUrl||m.url||m.src||m.data||'');
      if(isAudioFile91(n,m.type||m.mime))return n;
    }
    const txt=String(r.sound||'');
    const match=txt.match(/[\w .()\-]+\.(mp3|wav|wave|m4a|aac|ogg|flac)\b/i);
    if(match)return clean91(match[0]);
    return '';
  }
  function stateRows91(){try{return (typeof state!=='undefined'&&state.rows)||window.state?.rows||[];}catch(e){return [];}}
  function itemRow91(item){const rows=stateRows91();return rows.find(r=>r&&r.id===item?.rowId)||null;}
  function itemKey91(item,index){return [item?.kind||'',item?.rowId||'',item?.rowIndex??'',item?.url||'',item?.name||'',index??''].join('||');}
  function cueNo91(item,i){return item?.cue || item?.firstCue || (Number.isFinite(Number(item?.rowIndex))?Number(item.rowIndex)+1:i+1);}
  function clamp91(items){let idx=Number(window.regiePreviewIndex);if(!Number.isFinite(idx)||idx<0)idx=0;if(items.length&&idx>=items.length)idx=items.length-1;window.regiePreviewIndex=idx;return idx;}
  function render91(existing=null){
    const box=document.getElementById('regiePreviewList');
    const now=document.getElementById('regiePreviewNow');
    if(!box)return;
    const items=existing||((typeof regieVideoItems==='function')?regieVideoItems():[]);
    if(!items.length){box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';if(now)now.textContent='Noch kein Medium ausgewählt.';if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();return;}
    const idx=clamp91(items);
    box.innerHTML=items.map((item,i)=>{
      const active=i===idx;
      const key=itemKey91(item,i);
      const cue=`<em class="regiePreviewCueNo">${esc91(cueNo91(item,i))}</em>`;
      if(item.kind==='audio'){
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active isPreviewSelected playingOutline':''}" data-regie-preview-key="${esc91(key)}" title="${esc91(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc91(item.what||'Audio')}</b></div><span>${esc91(item.start||'')}</span><div class="regiePreviewAudioFileLine"><b>AUDIO FILE</b><span>${esc91(item.name||'')}</span></div></div>${cue}</div>`;
      }
      const r=itemRow91(item);
      const external=rowExternalAudio91(r) || (isAudioFile91(item?.audioName)?item.audioName:'');
      const label=external?external:'Video-Ton';
      const info=(item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||'');
      const audioLine=`<div class="regiePreviewAudioLine"><b>AUDIO</b><span>${esc91(label)}</span></div>`;
      return `<div class="regiePreviewItem videoHasOwnAudio hasRegieAudio ${active?'active isPreviewSelected playingOutline':''}" data-regie-preview-key="${esc91(key)}" title="${esc91(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc91(item.name||'')}</b></div><span>${esc91(info)}</span>${audioLine}</div>${cue}</div>`;
    }).join('');
    document.querySelectorAll('[data-regie-preview-key]').forEach(el=>{
      el.addEventListener('click',()=>{const all=Array.from(document.querySelectorAll('#regiePreviewList .regiePreviewItem'));const idx=all.indexOf(el);if(idx>=0)window.regiePreviewIndex=idx;if(window.playRegiePreviewExact)window.playRegiePreviewExact(el.dataset.regiePreviewKey);else if(typeof playRegiePreview==='function')playRegiePreview(idx);});
      el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();el.click();}});
      el.setAttribute('tabindex','0');el.setAttribute('role','button');
    });
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
    if(typeof updateRegieNowPlaying==='function')setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},0);
  }
  window.renderRegiePreviewList=render91;
  const oldPlay=window.playRegiePreview;
  if(typeof oldPlay==='function'){
    window.playRegiePreview=function(index){
      const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
      let idx=Number(index);if(!Number.isFinite(idx))idx=Number(window.regiePreviewIndex)||0;idx=Math.max(0,Math.min(items.length-1,idx));window.regiePreviewIndex=idx;
      const ret=oldPlay.call(this,idx);setTimeout(()=>render91(),0);setTimeout(()=>render91(),120);return ret;
    };
  }
  window.playRegiePreviewExact=function(key){
    const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
    let idx=items.findIndex((item,i)=>itemKey91(item,i)===key);
    if(idx<0)idx=Number(String(key||'').split('||').pop());
    if(!Number.isFinite(idx))idx=0;idx=Math.max(0,Math.min(items.length-1,idx));window.regiePreviewIndex=idx;
    if(typeof window.playRegiePreview==='function')window.playRegiePreview(idx);else render91(items);
  };
  setTimeout(()=>render91(),0);setTimeout(()=>render91(),400);setTimeout(()=>render91(),1000);
})();

/* ---- script block 37 ---- */
(function(){
  function esc92(s){return (typeof esc==='function')?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function clean92(v){try{return decodeURIComponent(String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'').trim();}catch(e){return String(v||'').split(/[\\/]/).pop().split('?')[0].split('#')[0]||'';}}
  function itemKey92(item,index){return [item?.kind||'',item?.rowId||'',item?.rowIndex??'',item?.url||'',item?.name||'',index??''].join('||');}
  function cueNo92(item,i){return item?.cue || item?.firstCue || (Number.isFinite(Number(item?.rowIndex))?Number(item.rowIndex)+1:i+1);}
  function clamp92(items){let idx=Number(window.regiePreviewIndex);if(!Number.isFinite(idx)||idx<0)idx=0;if(items.length&&idx>=items.length)idx=items.length-1;window.regiePreviewIndex=idx;return idx;}
  function isLoopLike92(item){
    const n=String(item?.name||item?.url||'').toLowerCase();
    return !!(item?.loop || item?.isLoop || /(^|[_\-\s])loop([_\-\s.]|$)/i.test(n) || /logos?_loop/i.test(n));
  }
  function hasRealVideoAudio92(item){
    if(item?.hasVideoAudio===true || item?.videoHasAudio===true || item?.hasOwnAudio===true)return true;
    if(item?.hasVideoAudio===false || item?.videoHasAudio===false || item?.hasOwnAudio===false)return false;
    // Regie-Loops gelten als stumme Bild-/Screen-Loops, außer sie sind explizit als Video mit Ton markiert.
    if(isLoopLike92(item))return false;
    return true;
  }
  function render92(existing=null){
    const box=document.getElementById('regiePreviewList');
    const now=document.getElementById('regiePreviewNow');
    if(!box)return;
    const items=existing||((typeof regieVideoItems==='function')?regieVideoItems():[]);
    if(!items.length){box.innerHTML='<div class="help">Keine Videos oder Audio-Dateien im Regieplan gefunden.</div>';if(now)now.textContent='Noch kein Medium ausgewählt.';if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();return;}
    const idx=clamp92(items);
    box.innerHTML=items.map((item,i)=>{
      const active=i===idx;
      const key=itemKey92(item,i);
      const cue=`<em class="regiePreviewCueNo">${esc92(cueNo92(item,i))}</em>`;
      if(item.kind==='audio'){
        return `<div class="regiePreviewItem regiePreviewAudioOnly ${active?'active isPreviewSelected playingOutline':''}" data-regie-preview-key="${esc92(key)}" title="${esc92(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc92(item.what||'Audio')}</b></div><span>${esc92(item.start||'')}</span><div class="regiePreviewAudioFileLine"><b>AUDIO FILE</b><span>${esc92(item.name||'')}</span></div></div>${cue}</div>`;
      }
      const realAudio=hasRealVideoAudio92(item);
      const info=(item.loop?'LOOP · ':'')+(item.start?item.start+' · ':'')+(item.what||'');
      const audioLine=`<div class="regiePreviewAudioLine ${realAudio?'':'noAudio'}"><b>AUDIO</b><span>${esc92(realAudio?'Video-Ton':'—')}</span></div>`;
      return `<div class="regiePreviewItem ${realAudio?'videoRealAudio':'videoNoOwnAudio noRegieAudio'} ${active?'active isPreviewSelected playingOutline':''}" data-regie-preview-key="${esc92(key)}" title="${esc92(item.url||item.name||'')}"><div><div class="regiePreviewTopLine"><b>${esc92(clean92(item.name||'Video'))}</b></div><span>${esc92(info)}</span>${audioLine}</div>${cue}</div>`;
    }).join('');
    document.querySelectorAll('[data-regie-preview-key]').forEach(el=>{
      el.addEventListener('click',()=>{const all=Array.from(document.querySelectorAll('#regiePreviewList .regiePreviewItem'));const idx=all.indexOf(el);if(idx>=0)window.regiePreviewIndex=idx;if(window.playRegiePreviewExact)window.playRegiePreviewExact(el.dataset.regiePreviewKey);else if(typeof playRegiePreview==='function')playRegiePreview(idx);});
      el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();el.click();}});
      el.setAttribute('tabindex','0');el.setAttribute('role','button');
    });
    if(typeof updateRegiePreviewControls==='function')updateRegiePreviewControls();
    if(typeof updateRegieNowPlaying==='function')setTimeout(()=>{try{updateRegieNowPlaying();}catch(e){}},0);
  }
  window.renderRegiePreviewList=render92;
  const oldPlay=window.playRegiePreview;
  if(typeof oldPlay==='function'){
    window.playRegiePreview=function(index){
      const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
      let idx=Number(index);if(!Number.isFinite(idx))idx=Number(window.regiePreviewIndex)||0;idx=Math.max(0,Math.min(items.length-1,idx));window.regiePreviewIndex=idx;
      const ret=oldPlay.call(this,idx);setTimeout(()=>render92(),0);setTimeout(()=>render92(),120);return ret;
    };
  }
  window.playRegiePreviewExact=function(key){
    const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
    let idx=items.findIndex((item,i)=>itemKey92(item,i)===key);
    if(idx<0)idx=Number(String(key||'').split('||').pop());
    if(!Number.isFinite(idx))idx=0;idx=Math.max(0,Math.min(items.length-1,idx));window.regiePreviewIndex=idx;
    if(typeof window.playRegiePreview==='function')window.playRegiePreview(idx);else render92(items);
  };
  setTimeout(()=>render92(),0);setTimeout(()=>render92(),400);setTimeout(()=>render92(),1000);
})();

/* ---- script block 38 ---- */
(function(){
  function items93(){try{return (typeof regieVideoItems==='function')?(regieVideoItems()||[]):[];}catch(e){return [];}}
  function clamp93(idx,items){idx=Number(idx);if(!Number.isFinite(idx))idx=0;if(idx<0)idx=0;if(items.length&&idx>=items.length)idx=items.length-1;return idx;}
  function rowIdFor93(item){return item&&item.rowId?String(item.rowId):'';}
  function markSheet93(index,opts={}){
    const list=items93();
    if(!list.length)return;
    const idx=clamp93(index ?? window.regiePreviewIndex ?? 0,list);
    window.regiePreviewIndex=idx;
    const item=list[idx];
    const rowId=rowIdFor93(item);
    document.querySelectorAll('#tbody tr.regiePreviewSheetActive').forEach(tr=>tr.classList.remove('regiePreviewSheetActive'));
    if(!rowId)return;
    const tr=document.querySelector(`#tbody tr[data-id="${CSS.escape(rowId)}"]`);
    if(!tr)return;
    tr.classList.add('regiePreviewSheetActive');
    const doScroll=opts.scroll!==false;
    if(doScroll){
      requestAnimationFrame(()=>{
        try{tr.scrollIntoView({block:'center',inline:'nearest',behavior:opts.smooth?'smooth':'auto'});}catch(e){tr.scrollIntoView(false);}
      });
    }
  }
  function loadFirstFile93(){
    const list=items93();
    if(!list.length)return;
    window.regiePreviewIndex=0;
    const first=list[0];
    const video=document.getElementById('regiePreviewVideo');
    const audio=document.getElementById('regiePreviewAudio');
    try{
      if(first.kind==='audio'){
        if(audio&&first.url){audio.src=first.url;audio.loop=false;audio.load();}
      }else if(video&&first.url){
        const src=first.url;
        if(video.getAttribute('src')!==src && video.currentSrc!==src){video.src=src;}
        video.loop=!!first.loop;
        video.preload='metadata';
        video.load();
      }
    }catch(e){console.warn(e);}
    try{if(typeof renderRegiePreviewList==='function')renderRegiePreviewList(list);}catch(e){}
    markSheet93(0,{scroll:false});
  }
  window.markRegieSheetForPreview=markSheet93;
  const oldPlay=window.playRegiePreview;
  if(typeof oldPlay==='function'){
    window.playRegiePreview=function(index){
      const list=items93();
      const idx=clamp93(index ?? window.regiePreviewIndex ?? 0,list);
      window.regiePreviewIndex=idx;
      const ret=oldPlay.call(this,idx);
      setTimeout(()=>markSheet93(idx,{smooth:true}),0);
      setTimeout(()=>markSheet93(window.regiePreviewIndex,{smooth:true}),160);
      return ret;
    };
  }
  const oldExact=window.playRegiePreviewExact;
  if(typeof oldExact==='function'){
    window.playRegiePreviewExact=function(key){
      const list=items93();
      let idx=Number(String(key||'').split('||').pop());
      if(!Number.isFinite(idx)){
        idx=list.findIndex((it,i)=>[it?.kind||'',it?.rowId||'',it?.rowIndex??'',it?.url||'',it?.name||'',i].join('||')===key);
      }
      idx=clamp93(idx,list);
      window.regiePreviewIndex=idx;
      const ret=oldExact.call(this,key);
      setTimeout(()=>markSheet93(idx,{smooth:true}),0);
      setTimeout(()=>markSheet93(window.regiePreviewIndex,{smooth:true}),160);
      return ret;
    };
  }
  const oldRender=window.render;
  if(typeof oldRender==='function'){
    window.render=function(){
      const ret=oldRender.apply(this,arguments);
      setTimeout(()=>markSheet93(window.regiePreviewIndex,{scroll:false}),0);
      return ret;
    };
  }
  ['ended','play','pause','loadedmetadata'].forEach(ev=>{
    document.getElementById('regiePreviewVideo')?.addEventListener(ev,()=>setTimeout(()=>markSheet93(window.regiePreviewIndex,{scroll:false}),20));
  });
  document.addEventListener('click',ev=>{
    const el=ev.target.closest?.('#regiePreviewList .regiePreviewItem');
    if(!el)return;
    const all=Array.from(document.querySelectorAll('#regiePreviewList .regiePreviewItem'));
    const idx=all.indexOf(el);
    if(idx>=0)setTimeout(()=>markSheet93(idx,{smooth:true}),30);
  },true);
  ['DOMContentLoaded','load'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(loadFirstFile93,80)));
  setTimeout(loadFirstFile93,250);
  setTimeout(loadFirstFile93,900);
})();

/* ---- script block 39 ---- */
(function(){
  function isAudio97(m){
    const t=String(m?.type||m?.mime||'').toLowerCase();
    const n=String(m?.name||m?.filename||m?.fileName||m?.url||m?.remoteUrl||'').toLowerCase();
    return t.startsWith('audio/') || /\.(mp3|wav|wave|m4a|aac|ogg|flac)(\?|#|$)/i.test(n);
  }
  function isVisual97(m){
    const t=String(m?.type||m?.mime||'').toLowerCase();
    const n=String(m?.name||m?.filename||m?.fileName||m?.url||m?.remoteUrl||'').toLowerCase();
    return t.startsWith('video/') || t.startsWith('image/') || /\.(mp4|mov|m4v|webm|jpg|jpeg|png|gif|webp)(\?|#|$)/i.test(n);
  }
  function normalizeMediaColumns97(){
    try{
      if(typeof state==='undefined'||!Array.isArray(state.rows))return;
      (state.rows||[]).forEach(r=>{
        if(!r||r.isBlock)return;
        // Screen/LED-Spalten sind nur Video/Bild. Audiodateien dort werden entfernt, wenn sie irrtümlich hineingeraten sind.
        Object.keys(r.screens||{}).forEach(sid=>{
          const slot=r.screens[sid];
          if(slot&&slot.media&&isAudio97(slot.media)){
            if(!r.soundMedia){
              r.soundMedia=slot.media;
              r.sound=(r.sound||slot.media.name||'').trim()||slot.media.name||'';
            }
            slot.media=null;
          }
        });
        // Audio/Ton-Spalte ist nur Audio. Video/Bild dort wird nicht als Audio behandelt.
        if(r.soundMedia && !isAudio97(r.soundMedia) && isVisual97(r.soundMedia)){
          r.soundMedia=null;
        }
      });
    }catch(e){console.warn(e);}
  }
  const oldRender97=window.render;
  if(typeof oldRender97==='function'){
    window.render=function(){normalizeMediaColumns97();return oldRender97.apply(this,arguments);};
  }
  setTimeout(()=>{normalizeMediaColumns97();try{if(typeof render==='function')render();}catch(e){}},0);
})();

/* ---- script block 41: V100 final winning layer ---- */
(function(){
  function fileNameV100(value){
    let s=String(value||'').trim();
    if(!s)return '';
    try{s=decodeURIComponent(s.split('#')[0].split('?')[0]);}catch(e){s=s.split('#')[0].split('?')[0];}
    return s.split('/').filter(Boolean).pop()||s;
  }
  function mediaTitleV100(item){
    return fileNameV100(item?.name||item?.fileName||item?.filename||item?.relativePath||item?.url||item?.remoteUrl)||'Datei';
  }
  function badgeForV100(m,kind,missing,remote){
    if(missing)return 'FEHLT';
    const type=String(m?.type||m?.mime||'').toLowerCase();
    const name=String(m?.name||m?.url||m?.remoteUrl||'').toLowerCase();
    if(type.startsWith('video/')||/\.(mp4|mov|m4v|webm)$/i.test(name))return 'VIDEO';
    if(type.startsWith('image/')||/\.(jpg|jpeg|png|gif|webp)$/i.test(name))return 'BILD';
    if(type.startsWith('audio/')||/\.(mp3|wav|wave|m4a|aac|ogg|flac)$/i.test(name))return 'AUDIO';
    return remote&&kind==='LINK'?'DATEI':kind;
  }
  window.media=function(m,rowId,sid){
    if(!m)return '';
    const kind=mediaKind(m),type=String(m.type||m.mime||''),stored=!!m.mediaKey,remote=!!(m.remote||m.remoteUrl);
    const av=type.startsWith('video/')||type.startsWith('audio/');
    const missing=!m.data&&!m.url&&!m.remoteUrl&&av&&!stored&&!remote;
    const src=m.remoteUrl||m.url||m.data||'';
    const audioClass=type.startsWith('audio/')?' audioThumb':'';
    const label=badgeForV100(m,kind,missing,remote);
    const fullName=mediaTitleV100(m);
    const displayName=(window.cleanMediaName?cleanMediaName(fullName):fullName);
    const thumbHtml=(type.startsWith('video/')&&src)?`<video src="${esc(src)}" muted playsinline preload="metadata"></video>`:`<img src="${mediaThumb(m)}" alt="${esc(label)}">`;
    return `<div class="mediaPreview" data-open-media="${esc(rowId)}|${esc(sid)}" data-missing="${missing?1:0}" data-stored="${stored?1:0}" data-remote="${remote?1:0}" title="${esc(fullName)}"><div class="mediaThumbStack"><div class="mediaThumb${audioClass}">${thumbHtml}</div><div class="mediaLabelRow"><span class="mediaBadge">${esc(label)}</span><span class="mediaTitle">${esc(displayName)}</span></div></div><div class="mediaMeta"></div><div class="mediaTools"><button class="mediaTool replace" type="button" title="Datei neu laden/ersetzen" aria-label="Datei neu laden/ersetzen" data-pick-media="${esc(rowId)}|${esc(sid)}">↻</button><button class="mediaTool remove" type="button" title="Datei entfernen" aria-label="Datei entfernen" data-clear-media="${esc(rowId)}|${esc(sid)}">×</button></div></div>`;
  };
  window.rowActions=function(r){
    return `<td class="rowActionsCell"><div class="rowActions"><button type="button" class="rowActionBtn duplicate" data-duplicate-row="${esc(r.id)}" title="Zeile duplizieren" aria-label="Zeile duplizieren">⧉</button><button type="button" class="rowActionBtn dim" data-toggle-row-muted="${esc(r.id)}" title="Zeile ausgrauen/einblenden" aria-label="Zeile ausgrauen/einblenden">${r.muted?'◐':'○'}</button><button type="button" class="rowActionBtn delete" data-delete-row="${esc(r.id)}" title="Zeile löschen" aria-label="Zeile löschen">×</button></div></td>`;
  };
  try{media=window.media;rowActions=window.rowActions;}catch(e){}
  function fixPreviewTitlesV100(){
    const items=(typeof regieVideoItems==='function')?(regieVideoItems()||[]):[];
    document.querySelectorAll('#regiePreviewList .regiePreviewItem').forEach((el,i)=>{
      const item=items[i];
      const label=item?mediaTitleV100(item):(el.querySelector('b')?.textContent||'Datei');
      el.setAttribute('title',label);
    });
  }
  const oldRenderPreview=window.renderRegiePreviewList||renderRegiePreviewList;
  window.renderRegiePreviewList=function(){
    const result=oldRenderPreview.apply(this,arguments);
    setTimeout(fixPreviewTitlesV100,0);
    return result;
  };
  try{renderRegiePreviewList=window.renderRegiePreviewList;}catch(e){}
  const oldRender=window.render||render;
  window.render=function(){
    const result=oldRender.apply(this,arguments);
    setTimeout(fixPreviewTitlesV100,0);
    return result;
  };
  try{render=window.render;}catch(e){}
  setTimeout(()=>{try{render();fixPreviewTitlesV100();}catch(e){}},0);
})();

/* ---- script block 42: V101 visible cleanup after legacy renderers ---- */
(function(){
  function visibleFileName101(value){
    let s=String(value||'').trim();
    try{s=decodeURIComponent(s.split('#')[0].split('?')[0]);}catch(e){s=s.split('#')[0].split('?')[0];}
    return s.split('/').filter(Boolean).pop()||s||'Datei';
  }
  function cleanupVisibleControls101(){
    document.querySelectorAll('.mediaPreview').forEach(preview=>{
      const title=visibleFileName101(preview.getAttribute('title')||preview.querySelector('.mediaTitle')?.textContent||preview.querySelector('.mediaName')?.textContent);
      preview.setAttribute('title',title);
      const text=(title+' '+preview.innerText).toLowerCase();
      const badge=preview.querySelector('.mediaBadge');
      if(badge&&badge.textContent.trim().toUpperCase()==='LINK'){
        badge.textContent=/\.(mp3|wav|wave|m4a|aac|ogg|flac)$/i.test(text)?'AUDIO':(/\.(jpg|jpeg|png|gif|webp)$/i.test(text)?'BILD':'VIDEO');
      }
      const replace=preview.querySelector('.mediaTool.replace');
      if(replace){replace.textContent='↻';replace.setAttribute('aria-label','Datei neu laden/ersetzen');replace.setAttribute('title','Datei neu laden/ersetzen');}
      preview.querySelectorAll('.mediaTool:not(.replace)').forEach(btn=>{if((btn.textContent||'').trim().toUpperCase()==='X')btn.textContent='×';});
    });
    document.querySelectorAll('.rowActionBtn.duplicate').forEach(btn=>{btn.textContent='⧉';});
    document.querySelectorAll('.rowActionBtn.dim').forEach(btn=>{let t=(btn.textContent||'').trim().toUpperCase();if(t==='ON')btn.textContent='◐';if(t==='OFF')btn.textContent='○';});
    document.querySelectorAll('.rowActionBtn.delete,.colDelete,.mediaModalClose').forEach(btn=>{if((btn.textContent||'').trim().toUpperCase()==='X')btn.textContent='×';});
    const items=(typeof regieVideoItems==='function')?(regieVideoItems()||[]):[];
    document.querySelectorAll('#regiePreviewList .regiePreviewItem').forEach((el,i)=>{
      const item=items[i];
      el.setAttribute('title',visibleFileName101(item?.name||item?.url||el.querySelector('b')?.textContent));
    });
  }
  const oldRender101=window.render||render;
  window.render=function(){
    const result=oldRender101.apply(this,arguments);
    setTimeout(cleanupVisibleControls101,0);
    return result;
  };
  try{render=window.render;}catch(e){}
  const oldRenderTable101=window.renderTable||renderTable;
  window.renderTable=function(){
    const result=oldRenderTable101.apply(this,arguments);
    setTimeout(cleanupVisibleControls101,0);
    return result;
  };
  try{renderTable=window.renderTable;}catch(e){}
  const oldPreview101=window.renderRegiePreviewList||renderRegiePreviewList;
  window.renderRegiePreviewList=function(){
    const result=oldPreview101.apply(this,arguments);
    setTimeout(cleanupVisibleControls101,0);
    return result;
  };
  try{renderRegiePreviewList=window.renderRegiePreviewList;}catch(e){}
  document.addEventListener('DOMContentLoaded',()=>setTimeout(cleanupVisibleControls101,100));
  setTimeout(()=>{try{cleanupVisibleControls101();render();}catch(e){}},0);
  setInterval(cleanupVisibleControls101,1200);
})();

/* ---- script block 43: V103 sharp icon controls ---- */
(function(){
  const icons103={
    refresh:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 7v5h-5l1.9-1.9A5.2 5.2 0 0 0 7 13.8l-2 .7A7.2 7.2 0 0 1 17.3 8.7L19 7Zm-14 10v-5h5l-1.9 1.9A5.2 5.2 0 0 0 17 10.2l2-.7A7.2 7.2 0 0 1 6.7 15.3L5 17Z"/></svg>',
    close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 10.6 4.95-4.95 1.4 1.4L13.4 12l4.95 4.95-1.4 1.4L12 13.4l-4.95 4.95-1.4-1.4L10.6 12 5.65 7.05l1.4-1.4L12 10.6Z"/></svg>',
    copy:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7V3h14v14h-4v4H3V7h4Zm2 0h8v8h2V5H9v2Zm6 2H5v10h10V9Z"/></svg>',
    eye:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c5.2 0 8.7 4.2 10 7-1.3 2.8-4.8 7-10 7S3.3 14.8 2 12c1.3-2.8 4.8-7 10-7Zm0 2c-3.7 0-6.5 2.6-7.8 5 1.3 2.4 4.1 5 7.8 5s6.5-2.6 7.8-5C18.5 9.6 15.7 7 12 7Zm0 2.5A2.5 2.5 0 1 1 12 14.5 2.5 2.5 0 0 1 12 9.5Z"/></svg>',
    eyeOff:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4.4 3 16.6 16.6-1.4 1.4-3-3A10.7 10.7 0 0 1 12 19c-5.2 0-8.7-4.2-10-7a14.5 14.5 0 0 1 4-4.8L3 4.4 4.4 3Zm3 5.6A12.2 12.2 0 0 0 4.2 12c1.3 2.4 4.1 5 7.8 5a8 8 0 0 0 3-.6l-2-2A2.5 2.5 0 0 1 9.6 11l-2.2-2.4ZM12 5c5.2 0 8.7 4.2 10 7a14 14 0 0 1-3 4.1l-1.4-1.4a12.1 12.1 0 0 0 2.2-2.7C18.5 9.6 15.7 7 12 7a7.9 7.9 0 0 0-2.2.3L8.2 5.7A10.5 10.5 0 0 1 12 5Z"/></svg>'
  };
  function setIcon103(btn,key,label){
    if(!btn)return;
    btn.classList.add('iconBtn103');
    btn.innerHTML=icons103[key]||'';
    btn.setAttribute('aria-label',label);
    btn.setAttribute('title',label);
  }
  function applyIcons103(){
    document.querySelectorAll('.mediaTool.replace').forEach(btn=>setIcon103(btn,'refresh','Datei neu laden/ersetzen'));
    document.querySelectorAll('[data-clear-media],.rowActionBtn.delete,.colDelete,#mediaModalClose').forEach(btn=>setIcon103(btn,'close',btn.classList.contains('colDelete')?'Spalte entfernen':'Entfernen'));
    document.querySelectorAll('.rowActionBtn.duplicate,[data-duplicate-row]').forEach(btn=>setIcon103(btn,'copy','Zeile duplizieren'));
    document.querySelectorAll('.rowActionBtn.dim,[data-toggle-row-muted]').forEach(btn=>{
      const id=btn.dataset.toggleRowMuted;
      const row=(typeof state!=='undefined'&&Array.isArray(state.rows))?state.rows.find(r=>r.id===id):null;
      setIcon103(btn,row?.muted?'eyeOff':'eye',row?.muted?'Zeile einblenden':'Zeile ausgrauen');
    });
  }
  const oldRender103=window.render||render;
  window.render=function(){
    const result=oldRender103.apply(this,arguments);
    setTimeout(applyIcons103,0);
    return result;
  };
  try{render=window.render;}catch(e){}
  const oldRenderTable103=window.renderTable||renderTable;
  window.renderTable=function(){
    const result=oldRenderTable103.apply(this,arguments);
    setTimeout(applyIcons103,0);
    return result;
  };
  try{renderTable=window.renderTable;}catch(e){}
  document.addEventListener('DOMContentLoaded',()=>setTimeout(applyIcons103,80));
  setTimeout(()=>{try{applyIcons103();render();}catch(e){}},0);
  setInterval(applyIcons103,1000);
})();

/* ---- script block 44: V104 fast mute + media drag between rows ---- */
(function(){
  function rowById104(id){return (state.rows||[]).find(r=>r&&r.id===id)}
  function slot104(row,sid){
    if(!row)return null;
    if(sid==='sound')return {media:row.soundMedia||null,set:m=>{row.soundMedia=m;row.sound=m?(row.sound||m.name||'').trim()||m.name||'':'';}};
    if(!row.screens)row.screens={};
    if(!row.screens[sid])row.screens[sid]={text:'',media:null};
    return {media:row.screens[sid].media||null,set:m=>{row.screens[sid].media=m;if(m)row.screens[sid].text=(row.screens[sid].text||m.name||'').trim()||m.name||'';}};
  }
  function isAudio104(m){
    const t=String(m?.type||m?.mime||'').toLowerCase(),n=String(m?.name||m?.url||m?.remoteUrl||'').toLowerCase();
    return t.startsWith('audio/')||/\.(mp3|wav|wave|m4a|aac|ogg|flac)(\?|#|$)/i.test(n);
  }
  function isVisual104(m){
    const t=String(m?.type||m?.mime||'').toLowerCase(),n=String(m?.name||m?.url||m?.remoteUrl||'').toLowerCase();
    return t.startsWith('video/')||t.startsWith('image/')||/\.(mp4|mov|m4v|webm|jpg|jpeg|png|gif|webp)(\?|#|$)/i.test(n);
  }
  function findDrop104(rowId,sid){
    const tr=document.querySelector(`#tbody tr[data-id="${CSS.escape(rowId)}"]`);
    if(!tr)return null;
    return sid==='sound'?tr.querySelector('.audioTonDrop'):tr.querySelector(`.mediaDrop[data-screen="${CSS.escape(sid)}"]`);
  }
  function addButtonHtml104(rowId,sid){
    return sid==='sound'
      ?`<button type="button" class="mediaAdd" data-dynamic-media="1" data-pick-media="${esc(rowId)}|sound">+ MP3/WAV</button>`
      :`<button type="button" class="mediaAdd screenMediaAdd" data-dynamic-media="1" data-pick-media="${esc(rowId)}|${esc(sid)}">+ Video/Bild</button>`;
  }
  function ensureAddButton104(drop,rowId,sid){
    if(!drop||drop.querySelector('.mediaAdd'))return;
    const input=drop.querySelector('input.mediaFileInput');
    const wrap=document.createElement('span');
    wrap.innerHTML=addButtonHtml104(rowId,sid);
    drop.insertBefore(wrap.firstElementChild,input||null);
  }
  function updateMediaMoveDom104(fromRid,fromSid,toRid,toSid){
    const fromDrop=findDrop104(fromRid,fromSid),toDrop=findDrop104(toRid,toSid);
    if(!fromDrop||!toDrop)return false;
    const moving=fromDrop.querySelector('.mediaPreview[data-open-media]');
    if(!moving)return false;
    const oldTarget=toDrop.querySelector('.mediaPreview[data-open-media]');
    if(oldTarget&&oldTarget!==moving)oldTarget.remove();
    toDrop.querySelectorAll('.mediaAdd').forEach(b=>b.remove());
    moving.dataset.openMedia=`${toRid}|${toSid}`;
    moving.querySelectorAll('[data-pick-media]').forEach(b=>b.dataset.pickMedia=`${toRid}|${toSid}`);
    moving.querySelectorAll('[data-clear-media]').forEach(b=>b.dataset.clearMedia=`${toRid}|${toSid}`);
    toDrop.insertBefore(moving,toDrop.querySelector('input.mediaFileInput')||null);
    toDrop.classList.add('hasMedia');
    fromDrop.classList.remove('hasMedia');
    ensureAddButton104(fromDrop,fromRid,fromSid);
    if(fromSid==='sound'){
      const t=fromDrop.querySelector('[data-audio-text]');
      if(t)t.textContent='';
    }
    if(typeof applyIcons103==='function')setTimeout(applyIcons103,0);
    setTimeout(makeMediaDraggable104,0);
    return true;
  }
  function refreshMutedButton104(btn,row){
    if(!btn||!row)return;
    btn.title=row.muted?'Zeile einblenden':'Zeile ausgrauen';
    btn.setAttribute('aria-label',btn.title);
    if(typeof applyIcons103==='function')setTimeout(applyIcons103,0);
  }
  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('[data-toggle-row-muted]');
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const row=rowById104(btn.dataset.toggleRowMuted);
    if(!row)return;
    row.muted=!row.muted;
    const tr=document.querySelector(`#tbody tr[data-id="${CSS.escape(row.id)}"]`);
    if(tr)tr.classList.toggle('rowMuted',!!row.muted);
    refreshMutedButton104(btn,row);
    saveLocal(false);
  },true);

  document.addEventListener('dragstart',e=>{
    if(e.target.closest?.('.mediaTool,.mediaAdd,.rowActionBtn,.colDelete'))return;
    const mediaEl=e.target.closest?.('.mediaPreview[data-open-media]');
    if(mediaEl){
      const key=mediaEl.dataset.openMedia||'';
      e.dataTransfer.setData('application/x-regie-media',key);
      e.dataTransfer.setData('text/regie-media',key);
      e.dataTransfer.effectAllowed='move';
      mediaEl.classList.add('mediaDragging');
      document.body.classList.add('mediaDragActive');
      return;
    }
    if(e.target.closest?.('#tbody .grip'))document.body.classList.add('rowDragActive');
  },true);
  document.addEventListener('dragend',()=>{
    document.body.classList.remove('mediaDragActive','rowDragActive');
    document.querySelectorAll('.mediaDragging,.mediaMoveOver').forEach(el=>el.classList.remove('mediaDragging','mediaMoveOver'));
  },true);

  document.addEventListener('dragover',e=>{
    const types=Array.from(e.dataTransfer?.types||[]);
    if(!types.includes('application/x-regie-media')&&!types.includes('text/regie-media'))return;
    const drop=e.target.closest?.('.mediaDrop');
    if(!drop)return;
    e.preventDefault();
    e.stopPropagation();
    drop.classList.add('mediaMoveOver');
    e.dataTransfer.dropEffect='move';
  },true);
  document.addEventListener('dragleave',e=>{
    const drop=e.target.closest?.('.mediaDrop');
    if(drop)drop.classList.remove('mediaMoveOver');
  },true);
  document.addEventListener('drop',e=>{
    const key=e.dataTransfer?.getData('application/x-regie-media')||e.dataTransfer?.getData('text/regie-media');
    if(!key)return;
    const drop=e.target.closest?.('.mediaDrop');
    if(!drop)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    drop.classList.remove('mediaMoveOver');
    const [fromRid,fromSid]=key.split('|');
    const toTr=drop.closest('tr');
    const toRid=toTr?.dataset.id;
    const toSid=drop.dataset.audioTon||drop.dataset.screen||'';
    if(!fromRid||!fromSid||!toRid||!toSid)return;
    if(fromRid===toRid&&fromSid===toSid)return;
    const fromRow=rowById104(fromRid),toRow=rowById104(toRid);
    const fromSlot=slot104(fromRow,fromSid),toSlot=slot104(toRow,toSid);
    const media=fromSlot?.media;
    if(!media||!toSlot)return;
    if(toSid==='sound'&&!isAudio104(media)){alert('In Audio / Ton bitte nur Audiodateien legen.');return;}
    if(toSid!=='sound'&&!isVisual104(media)){alert('In LED / Screen bitte nur Video oder Bild legen.');return;}
    const movedInDom=updateMediaMoveDom104(fromRid,fromSid,toRid,toSid);
    toSlot.set(JSON.parse(JSON.stringify(media)));
    fromSlot.set(null);
    if(toSid==='sound')autoExpandMediaColumn('sound',media,toRid);
    else autoExpandMediaColumn('screen:'+toSid,media,toRid);
    saveLocal(false);
    if(!movedInDom)renderTable();
    if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();
  },true);

  document.addEventListener('click',e=>{
    const pick=e.target.closest?.('[data-dynamic-media][data-pick-media]');
    if(!pick)return;
    const inp=$$('[data-media-file]').find(x=>x.dataset.mediaFile===pick.dataset.pickMedia);
    if(inp)inp.click();
  });

  function makeMediaDraggable104(){
    document.querySelectorAll('.mediaPreview[data-open-media]').forEach(el=>{
      el.setAttribute('draggable','true');
      el.title=el.title||'Medium ziehen oder öffnen';
    });
  }
  const oldRenderTable104=window.renderTable||renderTable;
  window.renderTable=function(){
    const result=oldRenderTable104.apply(this,arguments);
    setTimeout(makeMediaDraggable104,0);
    return result;
  };
  try{renderTable=window.renderTable;}catch(e){}
  const oldRender104=window.render||render;
  window.render=function(){
    const result=oldRender104.apply(this,arguments);
    setTimeout(makeMediaDraggable104,0);
    return result;
  };
  try{render=window.render;}catch(e){}
  setTimeout(makeMediaDraggable104,0);
})();

/* ---- script block 45: V105 move rows without rebuilding media ---- */
(function(){
  function moveRowsState105(dragId,targetId,beforeTarget){
    const from=state.rows.findIndex(r=>r.id===dragId);
    const to=state.rows.findIndex(r=>r.id===targetId);
    if(from<0||to<0)return null;
    let end=from+1;
    if(state.rows[from]?.isBlock){while(end<state.rows.length&&!state.rows[end].isBlock)end++;}
    if(to>=from&&to<end)return null;
    const ids=state.rows.slice(from,end).map(r=>r.id);
    const group=state.rows.splice(from,end-from);
    let newTo=state.rows.findIndex(r=>r.id===targetId);
    if(newTo<0)newTo=state.rows.length;
    if(!beforeTarget)newTo++;
    state.rows.splice(newTo,0,...group);
    return ids;
  }
  function moveRowsDom105(ids,targetEl,beforeTarget){
    const els=ids.map(id=>document.querySelector(`#tbody tr[data-id="${CSS.escape(id)}"]`)).filter(Boolean);
    if(!els.length||!targetEl)return;
    const frag=document.createDocumentFragment();
    els.forEach(el=>frag.appendChild(el));
    if(beforeTarget)targetEl.before(frag);
    else targetEl.after(frag);
  }
  function refreshCueCells105(){
    let cue=0;
    document.querySelectorAll('#tbody tr').forEach(tr=>{
      const row=state.rows.find(r=>r.id===tr.dataset.id);
      if(!row||row.isBlock)return;
      cue++;
      const cell=tr.querySelector('.cueCell');
      if(cell)cell.textContent=cue;
    });
  }
  function cleanupDrag105(){
    document.body.classList.remove('rowDragActive');
    document.querySelectorAll('#tbody tr').forEach(tr=>tr.classList.remove('dragging','dropBefore','dropAfter'));
  }
  document.addEventListener('drop',e=>{
    if(!dragRow)return;
    const targetEl=e.target.closest?.('#tbody tr');
    if(!targetEl)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const before=targetEl.classList.contains('dropBefore') || (!targetEl.classList.contains('dropAfter') && e.clientY<targetEl.getBoundingClientRect().top+targetEl.getBoundingClientRect().height/2);
    const ids=moveRowsState105(dragRow,targetEl.dataset.id,before);
    if(ids){
      moveRowsDom105(ids,targetEl,before);
      recalc(0,false);
      syncTimeCells();
      refreshCueCells105();
      if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();
    }
    cleanupDrag105();
    dragRow=null;
  },true);
})();

/* ---- script block 48: V109 absolute last UI guard ---- */
(function(){
  const icons109={
    play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z"/></svg>',
    pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z"/></svg>',
    prev:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6V5Zm13 0v14l-10-7 10-7Z"/></svg>',
    next:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2V5ZM5 5l10 7-10 7V5Z"/></svg>',
    copy:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7V3h14v14h-4v4H3V7h4Zm2 0h8v8h2V5H9v2Zm6 2H5v10h10V9Z"/></svg>',
    close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 10.6 4.95-4.95 1.4 1.4L13.4 12l4.95 4.95-1.4 1.4L12 13.4l-4.95 4.95-1.4-1.4L10.6 12 5.65 7.05l1.4-1.4L12 10.6Z"/></svg>',
    eye:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c5.2 0 8.7 4.2 10 7-1.3 2.8-4.8 7-10 7S3.3 14.8 2 12c1.3-2.8 4.8-7 10-7Zm0 2c-3.7 0-6.5 2.6-7.8 5 1.3 2.4 4.1 5 7.8 5s6.5-2.6 7.8-5C18.5 9.6 15.7 7 12 7Zm0 2.5A2.5 2.5 0 1 1 12 14.5 2.5 2.5 0 0 1 12 9.5Z"/></svg>',
    eyeOff:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4.4 3 16.6 16.6-1.4 1.4-3-3A10.7 10.7 0 0 1 12 19c-5.2 0-8.7-4.2-10-7a14.5 14.5 0 0 1 4-4.8L3 4.4 4.4 3Zm3 5.6A12.2 12.2 0 0 0 4.2 12c1.3 2.4 4.1 5 7.8 5a8 8 0 0 0 3-.6l-2-2A2.5 2.5 0 0 1 9.6 11l-2.2-2.4ZM12 5c5.2 0 8.7 4.2 10 7a14 14 0 0 1-3 4.1l-1.4-1.4a12.1 12.1 0 0 0 2.2-2.7C18.5 9.6 15.7 7 12 7a7.9 7.9 0 0 0-2.2.3L8.2 5.7A10.5 10.5 0 0 1 12 5Z"/></svg>'
  };
  const style=document.createElement('style');
  style.textContent=`@media screen{.iconBtn109{font-size:0!important;display:inline-grid!important;place-items:center!important}.iconBtn109 svg{width:15px!important;height:15px!important;display:block!important;fill:currentColor!important;pointer-events:none!important}.regiePreviewControlBtn.iconBtn109{width:32px!important;min-width:32px!important}.regiePreviewControlBtn.main.iconBtn109{width:42px!important;min-width:42px!important}.rowActionBtn.duplicate.iconBtn109{font-size:0!important}}`;
  document.head.appendChild(style);
  function put(btn,key,label){
    if(!btn)return;
    const html=icons109[key]||'';
    if(btn.innerHTML!==html)btn.innerHTML=html;
    btn.classList.add('iconBtn103','iconBtn108','iconBtn109');
    btn.title=label;
    btn.setAttribute('aria-label',label);
  }
  function apply109(root=document){
    const video=document.getElementById('regiePreviewVideo');
    put(root.querySelector?.('#regiePrevBtn'),'prev','Vorheriges Medium');
    put(root.querySelector?.('#regieNextBtn'),'next','Naechstes Medium');
    put(root.querySelector?.('#regiePlayPauseBtn'),video&&!video.paused?'pause':'play',video&&!video.paused?'Pause':'Play');
    root.querySelectorAll?.('.rowActionBtn.duplicate,[data-duplicate-row]').forEach(btn=>put(btn,'copy','Zeile duplizieren'));
    root.querySelectorAll?.('.rowActionBtn.delete,[data-delete-row]').forEach(btn=>put(btn,'close','Zeile loeschen'));
    root.querySelectorAll?.('.rowActionBtn.dim,[data-toggle-row-muted]').forEach(btn=>{
      const row=(state.rows||[]).find(r=>r.id===btn.dataset.toggleRowMuted);
      put(btn,row?.muted?'eyeOff':'eye',row?.muted?'Zeile einblenden':'Zeile ausgrauen');
    });
  }
  const oldUpdate109=window.updateRegiePreviewControls;
  window.updateRegiePreviewControls=function(){
    if(typeof oldUpdate109==='function')oldUpdate109.apply(this,arguments);
    apply109(document);
  };
  try{updateRegiePreviewControls=window.updateRegiePreviewControls;}catch(e){}

  let blockUntil109=0;
  let pageWasHidden109=false;
  ['visibilitychange','pageshow','focus'].forEach(ev=>window.addEventListener(ev,()=>{
    if(ev==='visibilitychange'&&document.hidden){pageWasHidden109=true;return;}
    if(!pageWasHidden109)return;
    blockUntil109=Date.now()+900;
    apply109(document);
  },true));
  const oldRender109=window.render||render;
  window.render=function(){
    if(Date.now()<blockUntil109)return;
    const out=oldRender109.apply(this,arguments);
    setTimeout(()=>apply109(document),0);
    return out;
  };
  try{render=window.render;}catch(e){}
  const oldRenderTable109=window.renderTable||renderTable;
  window.renderTable=function(){
    if(Date.now()<blockUntil109)return;
    const out=oldRenderTable109.apply(this,arguments);
    setTimeout(()=>apply109(document),0);
    return out;
  };
  try{renderTable=window.renderTable;}catch(e){}
  function startIconGuard109(){
    try{
      ['play','pause','loadedmetadata'].forEach(ev=>document.getElementById('regiePreviewVideo')?.addEventListener(ev,()=>apply109(document)));
      apply109(document);
      setTimeout(()=>apply109(document),300);
    }catch(e){}
  }
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startIconGuard109,{once:true});
  else setTimeout(startIconGuard109,0);
})();

/* ---- script block 49: V112 robust media URLs after JSON import ---- */
(function(){
  const PLAYER_ORIGIN112='https://usa.derhacker.com/';
  const CONTENT_ROOT112=PLAYER_ORIGIN112+'CONTENT/';
  function clean112(value){
    let s=String(value||'').trim();
    try{s=decodeURIComponent(s.split('#')[0].split('?')[0]);}catch(e){s=s.split('#')[0].split('?')[0];}
    return s.split(/[\\/]/).filter(Boolean).pop()||s;
  }
  function ext112(value){
    const m=clean112(value).toLowerCase().match(/\.([a-z0-9]+)$/);
    return m?m[1]:'';
  }
  function mime112(m){
    const direct=String(m?.type||m?.mime||'').toLowerCase();
    if(direct.startsWith('video/')||direct.startsWith('audio/')||direct.startsWith('image/'))return direct;
    const source=m?.name||m?.filename||m?.fileName||m?.relativePath||m?.remoteUrl||m?.url||'';
    const ext=ext112(source);
    if(['mp4','m4v'].includes(ext))return 'video/mp4';
    if(ext==='mov')return 'video/quicktime';
    if(ext==='webm')return 'video/webm';
    if(ext==='mp3')return 'audio/mpeg';
    if(ext==='wav'||ext==='wave')return 'audio/wav';
    if(['m4a','aac','ogg','flac'].includes(ext))return 'audio/'+ext;
    if(['jpg','jpeg'].includes(ext))return 'image/jpeg';
    if(['png','gif','webp'].includes(ext))return 'image/'+ext;
    return '';
  }
  function isVideo112(m){const t=mime112(m);return t.startsWith('video/');}
  function isAudio112(m){const t=mime112(m);return t.startsWith('audio/');}
  function encodePath112(path){
    return String(path||'').replace(/\\/g,'/').split('/').filter(Boolean).map(part=>encodeURIComponent(part)).join('/');
  }
  function absoluteUrl112(value,preferContent=false){
    let s=String(value||'').trim();
    if(!s)return '';
    if(/^https?:\/\//i.test(s)||/^data:/i.test(s)||/^blob:/i.test(s))return s;
    s=s.replace(/\\/g,'/').replace(/^\/+/,'');
    if(!s)return '';
    if(/^CONTENT\//i.test(s))return PLAYER_ORIGIN112+encodePath112(s);
    if(preferContent||/^(ALLGMEIN|ALLGEMEIN|ALLGEMEIN|ALLGMEIN|AUDIO|VIDEO|VIDEOS|LOGOS|GFA|00_|01_|02_|03_|04_|05_|06_|07_|08_|09_)/i.test(s)){
      return CONTENT_ROOT112+encodePath112(s);
    }
    return s;
  }
  function normalizeMedia112(m){
    if(!m)return null;
    const type=mime112(m);
    if(type&&!m.type)m.type=type;
    if(type&&!m.mime)m.mime=type;
    if(!m.name)m.name=clean112(m.filename||m.fileName||m.relativePath||m.remoteUrl||m.url)||'Datei';
    const rel=m.relativePath||m.path||'';
    const raw=m.remoteUrl||m.url||'';
    let url='';
    if(rel)url=absoluteUrl112(rel,true);
    else if(raw&&!/^blob:/i.test(raw))url=absoluteUrl112(raw,false);
    if(/^https?:\/\//i.test(url)){
      m.remoteUrl=url;
      m.url=url;
      m.remote=true;
    }
    if(!m.thumb&&m.thumbnail)m.thumb=m.thumbnail;
    return m;
  }
  function normalizeAllMedia112(){
    try{
      (state.rows||[]).forEach(r=>{
        if(!r)return;
        Object.values(r.screens||{}).forEach(slot=>{if(slot?.media)normalizeMedia112(slot.media);});
        if(r.soundMedia)normalizeMedia112(r.soundMedia);
      });
    }catch(e){}
  }
  function syncSource112(m){
    normalizeMedia112(m);
    return m?.remoteUrl||m?.url||m?.data||'';
  }
  async function playableSource112(m){
    normalizeMedia112(m);
    let src=syncSource112(m);
    if(src&&(!/^blob:/i.test(src)||!m?.mediaKey))return src;
    if(m?.mediaKey&&typeof hydrateMediaSource==='function'){
      try{
        const hydrated=await hydrateMediaSource(m);
        if(hydrated)return hydrated;
      }catch(e){}
    }
    return syncSource112(m);
  }
  function audioFromText112(txt){
    const hit=String(txt||'').match(/(Katja_B\.mp3|awards\.mp3|PLATZ_NEHMEN\.wav|[^\s,;]+\.(?:mp3|wav|wave|m4a|aac|ogg|flac))/i);
    if(!hit)return null;
    const name=clean112(hit[1]);
    const m={name,type:mime112({name}),mime:mime112({name}),remote:true,relativePath:'ALLGMEIN/'+name};
    return normalizeMedia112(m);
  }
  function itemKey112(kind,m,url){
    return kind+'|'+String(url||m?.remoteUrl||m?.url||m?.relativePath||m?.name||'').split('?')[0].split('#')[0].toLowerCase().trim();
  }
  window.mediaSourceUrl=function(m){return syncSource112(m);};
  try{mediaSourceUrl=window.mediaSourceUrl;}catch(e){}
  window.regieVideoItems=function(){
    normalizeAllMedia112();
    const items=[];
    let lastKey='';
    let lastItem=null;
    let cue=0;
    const screens=(state.screens||[]).map(s=>s.id);
    (state.rows||[]).forEach((r,rowIndex)=>{
      if(!r||r.isBlock)return;
      cue++;
      let found=null;
      for(const sid of screens){
        const m=r.screens?.[sid]?.media;
        if(m&&isVideo112(m)){found={screen:sid,media:m};break;}
      }
      const audio=(r.soundMedia&&isAudio112(r.soundMedia)?normalizeMedia112(r.soundMedia):null)||audioFromText112(r.sound);
      if(found){
        const m=normalizeMedia112(found.media);
        const url=syncSource112(m);
        const key=itemKey112('video',m,url);
        if(key&&key===lastKey&&lastItem&&lastItem.kind==='video'){
          lastItem.lastCue=cue;
          lastItem.cues=lastItem.cues||[lastItem.cue].filter(Boolean);
          if(!lastItem.cues.includes(cue))lastItem.cues.push(cue);
          if(audio&&!lastItem.audioName){lastItem.audioName=audio.name;lastItem.audioUrl=syncSource112(audio);lastItem.audioType=audio.type||audio.mime||'';}
        }else{
          const item={kind:'video',rowId:r.id,rowIndex,name:m.name||clean112(url)||'Video',url,type:m.type||m.mime||'',screen:found.screen,start:r.start||'',what:r.what||'',loop:!!(m.isLoop||m.loop),cue,firstCue:cue,lastCue:cue,media:m,audioName:audio?.name||'',audioUrl:audio?syncSource112(audio):'',audioType:audio?.type||audio?.mime||''};
          items.push(item);
          lastItem=item;
        }
        lastKey=key;
        return;
      }
      if(audio){
        const url=syncSource112(audio);
        const key=itemKey112('audio',audio,url);
        if(key&&key===lastKey&&lastItem&&lastItem.kind==='audio'){
          lastItem.lastCue=cue;
          lastItem.cues=lastItem.cues||[lastItem.cue].filter(Boolean);
          if(!lastItem.cues.includes(cue))lastItem.cues.push(cue);
        }else{
          const item={kind:'audio',rowId:r.id,rowIndex,name:audio.name||'Audio',url,type:audio.type||audio.mime||'',start:r.start||'',what:r.what||'',loop:false,cue,firstCue:cue,lastCue:cue,media:audio};
          items.push(item);
          lastItem=item;
        }
        lastKey=key;
        return;
      }
      lastKey='';
      lastItem=null;
    });
    return items;
  };
  try{regieVideoItems=window.regieVideoItems;}catch(e){}
  window.playRegiePreview=async function(index){
    const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
    const video=document.getElementById('regiePreviewVideo');
    const now=document.getElementById('regiePreviewNow');
    if(!video||!items.length)return;
    let idx=Number(index);
    if(!Number.isFinite(idx))idx=Number(window.regiePreviewIndex)||0;
    idx=Math.max(0,Math.min(items.length-1,idx));
    window.regiePreviewIndex=idx;
    try{regiePreviewIndex=idx;}catch(e){}
    const item=items[idx];
    const src=await playableSource112(item.media||item);
    if(!src){
      if(now)now.textContent=(item.name||'Datei')+' kann nicht abgespielt werden. Datei bitte neu verknuepfen.';
      if(typeof renderRegiePreviewList==='function')renderRegiePreviewList(items);
      return;
    }
    item.url=src;
    if(video.getAttribute('src')!==src)video.src=src;
    video.loop=!!item.loop;
    video.play().catch(()=>{});
    if(now)now.textContent=(item.start?item.start+' - ':'')+(item.name||clean112(src)||'Medium');
    if(typeof renderRegiePreviewList==='function')renderRegiePreviewList(items);
    if(typeof updateRegiePreviewControls==='function')setTimeout(updateRegiePreviewControls,0);
  };
  try{playRegiePreview=window.playRegiePreview;}catch(e){}
  window.toggleRegiePreview=function(index){
    const video=document.getElementById('regiePreviewVideo');
    if(!video)return;
    const next=Number(index);
    if(Number.isFinite(next)&&next!==Number(window.regiePreviewIndex)){window.playRegiePreview(next);return;}
    if(!video.src){window.playRegiePreview(Number.isFinite(next)?next:0);return;}
    if(video.paused)video.play().catch(()=>{});else video.pause();
    if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();
    if(typeof updateRegiePreviewControls==='function')setTimeout(updateRegiePreviewControls,0);
  };
  try{toggleRegiePreview=window.toggleRegiePreview;}catch(e){}
  const oldRender112=window.render||render;
  window.render=function(){
    normalizeAllMedia112();
    const out=oldRender112.apply(this,arguments);
    setTimeout(()=>{try{normalizeAllMedia112();if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();}catch(e){}},0);
    return out;
  };
  try{render=window.render;}catch(e){}
  const oldLoadDefault112=window.loadDefaultProjectFromServer;
  if(typeof oldLoadDefault112==='function'){
    window.loadDefaultProjectFromServer=async function(){
      const out=await oldLoadDefault112.apply(this,arguments);
      normalizeAllMedia112();
      try{if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();}catch(e){}
      return out;
    };
    try{loadDefaultProjectFromServer=window.loadDefaultProjectFromServer;}catch(e){}
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{normalizeAllMedia112();try{if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();}catch(e){}},100));
})();

/* ---- script block 50: V113 side toggles and audio-only preview playback ---- */
(function(){
  const iconLeft113='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 5 8.5 12l7 7-1.8 1.8L4.9 12l8.8-8.8L15.5 5Z"/></svg>';
  const iconRight113='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.5 5 7 7-7 7 1.8 1.8 8.8-8.8-8.8-8.8L8.5 5Z"/></svg>';
  function addPanelToggle113(id,side,label,html){
    if(document.getElementById(id))return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.id=id;
    btn.className='panelToggle113';
    btn.innerHTML=html;
    btn.title=label;
    btn.setAttribute('aria-label',label);
    btn.addEventListener('click',()=>{
      const cls=side+'Collapsed';
      document.body.classList.toggle(cls);
      try{localStorage.setItem('regie_'+cls,document.body.classList.contains(cls)?'1':'0');}catch(e){}
    });
    document.body.appendChild(btn);
  }
  function initPanelToggles113(){
    try{
      if(localStorage.getItem('regie_leftCollapsed')==='1')document.body.classList.add('leftCollapsed');
      if(localStorage.getItem('regie_rightCollapsed')==='1')document.body.classList.add('rightCollapsed');
    }catch(e){}
    addPanelToggle113('leftPanelToggle113','left','Linken Bereich ein-/ausklappen',iconLeft113);
    addPanelToggle113('rightPanelToggle113','right','Rechten Bereich ein-/ausklappen',iconRight113);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initPanelToggles113,{once:true});
  else setTimeout(initPanelToggles113,0);

  function previewAudio113(){
    let audio=document.getElementById('regiePreviewAudio113');
    if(!audio){
      audio=document.createElement('audio');
      audio.id='regiePreviewAudio113';
      audio.preload='metadata';
      audio.style.display='none';
      document.body.appendChild(audio);
      audio.addEventListener('ended',()=>{
        const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
        const idx=Number(window.regiePreviewIndex)||0;
        if(idx<items.length-1)window.playRegiePreview(idx+1);
        else if(typeof renderRegiePreviewList==='function')renderRegiePreviewList(items);
      });
      audio.addEventListener('play',()=>{if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();});
      audio.addEventListener('pause',()=>{if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();});
    }
    return audio;
  }
  function isAudioItem113(item){
    const t=String(item?.type||item?.mime||item?.media?.type||item?.media?.mime||'').toLowerCase();
    const n=String(item?.name||item?.url||item?.media?.name||item?.media?.url||item?.media?.remoteUrl||'').toLowerCase();
    return item?.kind==='audio'||t.startsWith('audio/')||/\.(mp3|wav|wave|m4a|aac|ogg|flac)(\?|#|$)/i.test(n);
  }
  function source113(item){
    const m=item?.media||item;
    if(typeof mediaSourceUrl==='function'){
      const src=mediaSourceUrl(m);
      if(src)return src;
    }
    return m?.remoteUrl||m?.url||m?.data||item?.url||'';
  }
  async function playable113(item){
    let src=source113(item);
    const m=item?.media||item;
    if(src&&(!/^blob:/i.test(src)||!m?.mediaKey))return src;
    if(m?.mediaKey&&typeof hydrateMediaSource==='function'){
      try{return await hydrateMediaSource(m);}catch(e){}
    }
    return source113(item);
  }
  function setPreviewIndex113(idx){
    window.regiePreviewIndex=idx;
    try{regiePreviewIndex=idx;}catch(e){}
  }
  window.playRegiePreview=async function(index){
    const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
    const video=document.getElementById('regiePreviewVideo');
    const now=document.getElementById('regiePreviewNow');
    if(!items.length)return;
    let idx=Number(index);
    if(!Number.isFinite(idx))idx=Number(window.regiePreviewIndex)||0;
    idx=Math.max(0,Math.min(items.length-1,idx));
    setPreviewIndex113(idx);
    const item=items[idx];
    const src=await playable113(item);
    if(!src){
      if(now)now.textContent=(item?.name||'Datei')+' kann nicht abgespielt werden. Datei bitte neu verknuepfen.';
      if(typeof renderRegiePreviewList==='function')renderRegiePreviewList(items);
      return;
    }
    if(isAudioItem113(item)){
      const audio=previewAudio113();
      if(audio.getAttribute('src')!==src)audio.src=src;
      audio.play().catch(()=>{});
      if(now)now.textContent=(item.start?item.start+' - ':'')+(item.name||'Audio')+' (Audio)';
      if(typeof renderRegiePreviewList==='function')renderRegiePreviewList(items);
      if(typeof updateRegiePreviewControls==='function')setTimeout(updateRegiePreviewControls,0);
      return;
    }
    const audio=previewAudio113();
    audio.pause();
    if(video){
      if(video.getAttribute('src')!==src)video.src=src;
      video.loop=!!item.loop;
      video.play().catch(()=>{});
    }
    if(now)now.textContent=(item.start?item.start+' - ':'')+(item.name||'Video');
    if(typeof renderRegiePreviewList==='function')renderRegiePreviewList(items);
    if(typeof updateRegiePreviewControls==='function')setTimeout(updateRegiePreviewControls,0);
  };
  try{playRegiePreview=window.playRegiePreview;}catch(e){}
  window.toggleRegiePreview=function(index){
    const items=(typeof regieVideoItems==='function')?regieVideoItems():[];
    let idx=Number(index);
    if(!Number.isFinite(idx))idx=Number(window.regiePreviewIndex)||0;
    const item=items[idx];
    if(!item)return;
    if(idx!==Number(window.regiePreviewIndex)){window.playRegiePreview(idx);return;}
    if(isAudioItem113(item)){
      const audio=previewAudio113();
      if(!audio.src){window.playRegiePreview(idx);return;}
      if(audio.paused)audio.play().catch(()=>{});else audio.pause();
    }else{
      const audio=previewAudio113();
      audio.pause();
      const video=document.getElementById('regiePreviewVideo');
      if(!video?.src){window.playRegiePreview(idx);return;}
      if(video.paused)video.play().catch(()=>{});else video.pause();
    }
    if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();
    if(typeof updateRegiePreviewControls==='function')setTimeout(updateRegiePreviewControls,0);
  };
  try{toggleRegiePreview=window.toggleRegiePreview;}catch(e){}
})();

/* ---- script block 51: V114 MacBook/Mobile mode and fast normal row insert ---- */
(function(){
  function initMobileMode114(){
    const actions=document.querySelector('.topActions');
    if(!actions||document.getElementById('mobileModeBtn114'))return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.id='mobileModeBtn114';
    btn.className='btn mobileModeBtn114';
    btn.textContent='MOBILE';
    btn.title='MacBook/Mobile-Modus: Seiten ausblenden und Tabelle kompakter anzeigen';
    btn.addEventListener('click',()=>{
      document.body.classList.toggle('mobileMode114');
      const active=document.body.classList.contains('mobileMode114');
      btn.classList.toggle('active',active);
      try{localStorage.setItem('regie_mobileMode114',active?'1':'0');}catch(e){}
      if(active){
        document.body.classList.add('leftCollapsed','rightCollapsed');
      }
      setTimeout(()=>{try{if(typeof fitToScreen==='function')fitToScreen();}catch(e){}},80);
    });
    actions.prepend(btn);
    try{
      if(localStorage.getItem('regie_mobileMode114')==='1'){
        document.body.classList.add('mobileMode114','leftCollapsed','rightCollapsed');
        btn.classList.add('active');
      }
    }catch(e){}
  }

  function activeCueNumber114(rowId){
    let cue=0;
    for(const r of state.rows||[]){
      if(!r.isBlock)cue++;
      if(r.id===rowId)return r.isBlock?'':cue;
    }
    return '';
  }
  function refreshCueCells114(){
    let cue=0;
    document.querySelectorAll('#tbody tr').forEach(tr=>{
      const row=state.rows.find(r=>r.id===tr.dataset.id);
      if(!row||row.isBlock)return;
      cue++;
      const cellEl=tr.querySelector('.cueCell');
      if(cellEl)cellEl.textContent=cue;
    });
  }
  function rowHtml114(r){
    const c=cols();
    const p=preset(r.preset),ct=colorsFor(p);
    const tr=document.createElement('tr');
    tr.dataset.id=r.id;
    tr.style.setProperty('--row-bg',ct.bg);
    tr.style.setProperty('--row-text',ct.tx);
    tr.style.cssText+=rowStyle(r);
    tr.classList.add('activeRow');
    if(r.muted)tr.classList.add('rowMuted');
    if(r.isBlock){
      tr.classList.add('blockSeparator');
      tr.innerHTML=`<td colspan="${c.length}"><div class="blockBar"><span class="grip" draggable="true" title="Trenner ziehen">..</span><div class="colorPill" data-color="${r.id}">${esc(preset(r.preset).name)}</div><input class="blockInput" data-field="what" value="${esc(r.what||'Abschnitt')}" placeholder="Abschnitt / Blocktitel"><span class="rowResize" data-resize-row="${r.id}" title="Zeilenhoehe ziehen"></span></div></td>${rowActions(r)}`;
    }else{
      tr.innerHTML=c.map(col=>cell(col,r,activeCueNumber114(r.id),ct)).join('')+rowActions(r);
    }
    return tr;
  }
  function bindFastRow114(tr){
    if(!tr)return;
    const activate=()=>{state.activeRowId=tr.dataset.id;document.querySelectorAll('#tbody tr').forEach(x=>x.classList.remove('activeRow'));tr.classList.add('activeRow');saveLocal(false);};
    tr.addEventListener('mousedown',activate);
    tr.addEventListener('focusin',activate);
    tr.querySelectorAll('[data-field]').forEach(el=>{
      const commit=()=>{
        const r=rowFrom(el),f=el.dataset.field;
        if(!r)return;
        if(f==='start'){r.start=norm(el.value);recalc(state.rows.indexOf(r),false);syncTimeCells();}
        else if(f==='duration'){r.duration=norm(el.value);recalc(state.rows.indexOf(r),false);syncTimeCells();}
        else{r[f]=el.value;saveLocal(false);}
      };
      el.addEventListener('blur',commit);
      el.addEventListener('change',commit);
      el.addEventListener('keydown',e=>{if(e.key==='Enter'&&el.tagName==='INPUT'){e.preventDefault();el.blur();}});
      if(el.classList.contains('duration')||el.dataset.field==='start'){
        el.addEventListener('input',()=>{
          const r=rowFrom(el);if(!r)return;
          if(el.dataset.field==='start')r.start=el.value;else r.duration=el.value;
          recalc(state.rows.indexOf(r),false);syncTimeCells();
        });
      }
    });
    tr.querySelectorAll('[data-color]').forEach(el=>el.addEventListener('click',e=>openColorMenu(e.currentTarget.dataset.color,e.currentTarget)));
    tr.querySelectorAll('[data-show-start]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();state.showStartRowId=b.dataset.showStart;state.activeRowId=state.showStartRowId;render();}));
    tr.querySelectorAll('[data-pick-media]').forEach(b=>b.addEventListener('click',e=>{
      e.stopPropagation();
      const inp=Array.from(document.querySelectorAll('[data-media-file]')).find(x=>x.dataset.mediaFile===b.dataset.pickMedia);
      if(inp)inp.click();
    }));
    tr.querySelectorAll('[data-media-file]').forEach(inp=>inp.addEventListener('change',async()=>{
      const file=inp.files&&inp.files[0];if(!file)return;
      const [rid,sid]=inp.dataset.mediaFile.split('|');
      const r=state.rows.find(x=>x.id===rid);if(!r)return;
      const kind=fileKindFromName(file);
      if(sid==='sound'){
        if(!kind.type.startsWith('audio/')){alert('In Audio / Ton bitte MP3, WAV oder eine Audiodatei verwenden.');inp.value='';return;}
        const mediaObj=await readMedia(file);r.soundMedia=mediaObj;r.sound=(r.sound||mediaObj.name).trim()||mediaObj.name;autoExpandMediaColumn('sound',mediaObj,r.id);inp.value='';render();return;
      }
      if(kind.type.startsWith('audio/')){alert('Audio bitte in die Spalte Audio / Ton legen, nicht in LED / Screen.');inp.value='';return;}
      if(!r.screens)r.screens={};if(!r.screens[sid])r.screens[sid]={text:'',media:null};
      const mediaObj=await readMedia(file);r.screens[sid].media=mediaObj;r.screens[sid].text=(r.screens[sid].text||mediaObj.name).trim()||mediaObj.name;autoExpandMediaColumn('screen:'+sid,mediaObj,r.id);inp.value='';render();
    }));
    tr.querySelectorAll('[data-delete-row]').forEach(b=>b.addEventListener('click',e=>{
      e.stopPropagation();
      const id=b.dataset.deleteRow;
      const r=state.rows.find(x=>x.id===id);if(!r)return;
      if(!confirm((r.isBlock?'Trenner':'Zeile')+' wirklich loeschen?'))return;
      state.rows=state.rows.filter(x=>x.id!==id);
      tr.remove();
      recalc(0,false);syncTimeCells();refreshCueCells114();saveLocal(false);
      if(typeof renderRegiePreviewList==='function')renderRegiePreviewList();
    }));
  }
  function addRowFast114(block=false){
    if(block||String(document.getElementById('search')?.value||'').trim()){
      return window.__oldAddRow114?window.__oldAddRow114(block):undefined;
    }
    const tbody=document.getElementById('tbody');
    if(!tbody||typeof cell!=='function'||typeof rowActions!=='function')return window.__oldAddRow114?window.__oldAddRow114(block):undefined;
    const insertAt=currentInsertIndex();
    const prev=[...state.rows.slice(0,insertAt)].reverse().find(r=>!r.isBlock);
    const start=prev?prev.end:'09:00:00';
    const r={id:uid(),isBlock:false,preset:'neutral',start,duration:'00:05:00',end:'',what:'Neue Regiezeile',people:[],detail:'',light:'',sound:'',camera:'',screens:{}};
    state.screens.forEach(s=>r.screens[s.id]={text:'',media:null});
    state.cols.forEach(c=>{if(c.id.startsWith('col_')||(!baseCols.find(b=>b.id===c.id)))r[c.id]='';});
    state.rows.splice(insertAt,0,r);
    state.activeRowId=r.id;
    recalc(insertAt,false);
    document.querySelectorAll('#tbody tr').forEach(x=>x.classList.remove('activeRow'));
    const tr=rowHtml114(r);
    const before=tbody.children[insertAt]||null;
    tbody.insertBefore(tr,before);
    bindFastRow114(tr);
    syncTimeCells();
    refreshCueCells114();
    saveLocal(false);
    if(typeof renderSide==='function')setTimeout(()=>{try{renderSide();}catch(e){}},0);
    if(typeof renderRegiePreviewList==='function')setTimeout(()=>{try{renderRegiePreviewList();}catch(e){}},0);
    setTimeout(()=>tr.scrollIntoView({block:'center',inline:'nearest'}),0);
    return r;
  }
  if(!window.__oldAddRow114)window.__oldAddRow114=window.addRow||addRow;
  window.addRow=addRowFast114;
  try{addRow=window.addRow;}catch(e){}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initMobileMode114,{once:true});
  else setTimeout(initMobileMode114,0);
})();
