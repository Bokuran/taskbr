/* TBH Save Tools v3 — перенос и загрузка сохранений между устройствами/браузерами.
   v3: перезагрузка после импорта/восстановления больше не даёт автосохранению
   при выгрузке страницы перезаписать только что загруженный сейв. */
(function(){
  const T=window.TBH;if(!T||!T.S)return;
  const U=T.util,VER=3;
  const KEY="tbh_idle_equipment_v1",BAK="tbh_backup_v1",FLAG="tbh_import_flag",SLOT=i=>"tbh_slot_"+i;
  const HERO_MIG={knight:"paladin",healer:"necro"};

  const st=document.createElement("style");
  st.textContent=`
  .svSec{font:900 10px var(--mono);letter-spacing:1.6px;color:var(--gold);margin:14px 0 7px;text-transform:uppercase;display:flex;align-items:center;gap:8px}
  .svSec:after{content:"";flex:1;height:1px;background:linear-gradient(90deg,rgba(201,162,39,.5),transparent)}
  .svChips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px}
  .svChip{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:14px;border:1px solid var(--line);background:rgba(255,255,255,.04);font:700 10.5px var(--mono);color:var(--dim)}
  .svChip i{font-style:normal;font-size:12px}
  .svChip b{color:var(--gold2)}
  .svRow{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0}
  .svBtn{padding:8px 12px;border-radius:9px;border:1px solid var(--gold);color:var(--gold2);font:900 11px var(--mono);background:rgba(201,162,39,.1);transition:.14s;display:inline-flex;align-items:center;gap:6px}
  .svBtn:hover{background:rgba(201,162,39,.22);transform:translateY(-1px);box-shadow:0 0 12px rgba(201,162,39,.25)}
  .svBtn.ghost{border-color:var(--line);color:var(--dim);background:rgba(255,255,255,.04)}
  .svBtn.ghost:hover{border-color:var(--dim);color:var(--ink);box-shadow:none}
  .svBtn.danger{border-color:var(--red);color:#ff9aaa;background:rgba(255,77,98,.1)}
  .svBtn.danger:hover{background:rgba(255,77,98,.22);box-shadow:0 0 12px rgba(255,77,98,.3)}
  .svBtn.green{border-color:var(--green);color:var(--green);background:rgba(120,255,122,.1)}
  .svBtn.green:hover{background:rgba(120,255,122,.2);box-shadow:0 0 12px rgba(120,255,122,.3)}
  .svDrop{border:2px dashed var(--bronze);border-radius:12px;padding:16px 12px;text-align:center;color:var(--faint);font:700 11px var(--mono);background:rgba(0,0,0,.22);transition:.15s;cursor:pointer}
  .svDrop:hover,.svDrop.over{border-color:var(--gold2);color:var(--gold2);background:rgba(201,162,39,.08);box-shadow:inset 0 0 24px rgba(201,162,39,.12)}
  .svDrop b{display:block;font-size:22px;margin-bottom:4px}
  .svCode{width:100%;min-height:74px;resize:vertical;margin:8px 0;padding:8px;border-radius:9px;border:1px solid var(--line);background:#0d0a13;color:var(--cyan);font:700 10px var(--mono);word-break:break-all}
  .svCode:focus{outline:1px solid var(--gold)}
  .svErr{display:none;margin:6px 0;padding:7px 10px;border-radius:8px;border:1px solid var(--red);background:rgba(255,77,98,.12);color:#ff9aaa;font:700 11px var(--mono)}
  .svErr.on{display:block}
  .svSlot{display:flex;align-items:center;gap:9px;padding:8px 9px;border:1px solid var(--line);border-radius:10px;margin-bottom:7px;background:rgba(255,255,255,.03)}
  .svSlot .n{font:900 12px var(--mono);color:var(--gold);width:20px;text-align:center}
  .svSlot .info{flex:1;min-width:0;font:700 10.5px var(--mono);color:var(--dim)}
  .svSlot .info b{color:var(--gold2)}
  .svSlot .info small{display:block;color:var(--faint);font-size:9.5px}
  .svSlot.empty .info{color:var(--faint)}
  .svWarn{margin:8px 0;padding:9px 11px;border-radius:9px;border:1px solid rgba(255,176,32,.5);background:rgba(255,176,32,.1);color:var(--gold2);font:700 11px var(--mono)}
  .svHint{font-size:11.5px;color:var(--dim);margin:4px 0 8px}
  `;
  document.head.appendChild(st);

  const readRaw=()=>{try{return localStorage.getItem(KEY)}catch(e){return null}};
  const writeRaw=s=>{try{localStorage.setItem(KEY,s);return true}catch(e){return false}};
  const readJSON=k=>{try{const r=localStorage.getItem(k);return r?JSON.parse(r):null}catch(e){return null}};
  const writeJSON=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
  const delJSON=k=>{try{localStorage.removeItem(k)}catch(e){}};
  function currentSave(){T.save();const raw=readRaw();if(raw){try{return JSON.parse(raw)}catch(e){}}return JSON.parse(JSON.stringify(T.S))}
  function checksum(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(36)}
  const envelope=save=>{const j=JSON.stringify(save);return {fmt:"tbh-save",v:VER,at:new Date().toISOString(),from:location.origin,roster:(T.config.heroes||[]).map(h=>h.id).join(","),check:checksum(j),save}};
  function b64enc(s){const b=new TextEncoder().encode(s);let bin="";for(let i=0;i<b.length;i++)bin+=String.fromCharCode(b[i]);return btoa(bin)}
  function b64dec(s){const bin=atob(s);const b=Uint8Array.from(bin,c=>c.charCodeAt(0));return new TextDecoder().decode(b)}
  function migrateSave(s){
    if(!s||typeof s!=="object")return s;
    if(s.heroes){for(const k in HERO_MIG){const nk=HERO_MIG[k];if(s.heroes[k]&&!s.heroes[nk]){s.heroes[nk]=s.heroes[k];delete s.heroes[k]}}
      const fix=a=>Array.isArray(a)?a.map(id=>HERO_MIG[id]&&s.heroes[HERO_MIG[id]]?HERO_MIG[id]:id):a;
      s.party=fix(s.party);s.order=fix(s.order);}
    return s;
  }
  function parseAny(text){
    text=(text||"").trim();if(!text)throw new Error("Пусто: вставь код переноса или выбери файл сохранения.");
    let obj;
    try{
      if(text.indexOf("TBH1.")===0)obj=JSON.parse(b64dec(text.slice(5)));
      else if(text[0]==="{"||text[0]==="[")obj=JSON.parse(text);
      else obj=JSON.parse(b64dec(text));
    }catch(e){throw new Error("Не удалось прочитать код/файл: неверный формат или данные обрезались при копировании.")}
    let save=obj;
    if(obj&&obj.fmt==="tbh-save"){
      if(obj.check&&obj.save&&checksum(JSON.stringify(obj.save))!==obj.check)throw new Error("Контрольная сумма не совпадает — код/файл повреждён при копировании.");
      save=obj.save;
    }
    save=migrateSave(save);
    if(!save||typeof save!=="object"||(!save.heroes&&save.wave==null))throw new Error("Это не сохранение TBH: нет данных героев/волны.");
    return save;
  }
  function preview(s){const h=s.heroes||{};const rec=Object.keys(h).filter(k=>h[k]&&h[k].rec).length;
    return {wave:s.wave||1,max:s.maxWave||1,gold:s.gold||0,gems:s.gems||0,rec,party:(s.party||[]).length,prest:s.prestiges||0,kills:(s.stats&&s.stats.kills)||0,at:s.lastSeen?new Date(s.lastSeen):null}}
  const chip=(i,l,v)=>`<span class="svChip"><i>${i}</i>${l}: <b>${v}</b></span>`;
  const chips=p=>`<div class="svChips">${chip("🌊","волна",p.wave)}${chip("🏔","рекорд",p.max)}${chip("🪙","золото",U.fmt(p.gold))}${chip("💎","кристаллы",p.gems)}${chip("⚔","нанято",p.rec)}${chip("🛡","в отряде",p.party)}${chip("💠","перерожд.",p.prest)}${chip("💀","убийств",U.fmt(p.kills))}${p.at?chip("🕒","сохранено",p.at.toLocaleString("ru-RU")):""}</div>`;

  /* Перезагрузка БЕЗ автосохранения при выгрузке: иначе pagehide/beforeunload
     (зарегистрированные в main.js прямой ссылкой на оригинальный T.save)
     перезапишут только что загруженный сейв старым состоянием. */
  function safeReload(){
    try{
      const orig=T.save;
      removeEventListener("beforeunload",orig);
      removeEventListener("pagehide",orig);
      T.save=function(){};
    }catch(e){}
    location.reload();
  }

  const root=document.createElement("div");root.className="modal";root.id="svModal";
  root.innerHTML=`<div class="scrim"></div><div class="card" style="width:min(600px,94vw)"><div class="sub">TBH · SAVE TOOLS v${VER}</div><h2>💾 Сохранения и перенос</h2><div id="svBody"></div><div class="modalBtns"><button class="ghostBtn" id="svClose">Закрыть</button></div></div>`;
  document.body.appendChild(root);
  const body=root.querySelector("#svBody");
  root.querySelector(".scrim").onclick=close;
  root.querySelector("#svClose").onclick=close;
  let pending=null,fileInput=null;
  function open(){T.audio&&T.audio.init();T.audio&&T.audio.play("click");root.classList.add("on");renderMain()}
  function close(){root.classList.remove("on");pending=null}
  function err(msg){const e=body.querySelector("#svErr");if(e){e.textContent="⚠ "+msg;e.classList.add("on")}T.toast(msg,"danger")}

  (function(){const f=readJSON(FLAG);if(f){delJSON(FLAG);setTimeout(()=>T.toast(`✅ Перенос применён: волна ${f.wave} · 💎 ${f.gems} · ⚔ героев ${f.rec}`,"success"),600)}})();

  function renderMain(){
    const cur=currentSave(),p=preview(cur);
    const bak=readJSON(BAK);
    const slots=[1,2,3].map(i=>{const s=readJSON(SLOT(i));
      if(s&&s.save){const sp=preview(s.save);return `<div class="svSlot"><span class="n">${i}</span><span class="info"><b>Волна ${sp.wave}</b> · 💎${sp.gems} · ⚔${sp.rec}<small>${s.at?new Date(s.at).toLocaleString("ru-RU"):""}</small></span><button class="svBtn green" data-act="loadslot" data-slot="${i}">Загрузить</button><button class="svBtn danger" data-act="delslot" data-slot="${i}">✕</button></div>`}
      return `<div class="svSlot empty"><span class="n">${i}</span><span class="info">Пустой слот</span><button class="svBtn" data-act="toslot" data-slot="${i}">Сохранить сюда</button></div>`}).join("");
    body.innerHTML=`
      <div class="svSec">Это устройство</div>
      <div class="svChips">${chip("🌐","адрес",location.host)}${chip("🧩","модуль","v"+VER)}</div>
      <p class="svHint">Сохранения живут в браузере конкретного адреса: ПК (локально) и телефон (GitHub Pages) — разные хранилища. Перенос — файлом или кодом ниже.</p>
      <div class="svSec">Текущее сохранение</div>${chips(p)}
      <div class="svRow"><button class="svBtn" data-act="file">💾 Скачать файл</button><button class="svBtn" data-act="code">📋 Копировать код переноса</button></div>
      <div class="svSec">Перенос / загрузка</div>
      <p class="svHint">На другом устройстве открой 💾 → загрузи файл или вставь код. После перезагрузки появится зелёное подтверждение «Перенос применён» с цифрами — значит всё записалось.</p>
      <div class="svDrop" id="svDrop"><b>📥</b>Перетащи файл сохранения сюда<br>или нажми, чтобы выбрать</div>
      <div class="svRow"><button class="svBtn ghost" data-act="pick">📂 Выбрать файл…</button></div>
      <textarea class="svCode" id="svCode" placeholder="…или вставь код переноса (TBH1.…) / JSON сохранения"></textarea>
      <div class="svRow"><button class="svBtn green" data-act="loadcode">📥 Загрузить код</button></div>
      <div class="svErr" id="svErr"></div>
      <div class="svSec">Локальные слоты</div>${slots}
      ${bak?`<div class="svSec">Резервная копия</div><div class="svSlot"><span class="n">↩</span><span class="info"><b>Предыдущее сохранение</b><small>${bak.at?new Date(bak.at).toLocaleString("ru-RU"):""}</small></span><button class="svBtn green" data-act="restore">Вернуть</button><button class="svBtn danger" data-act="delbak">✕</button></div>`:""}
    `;
    fileInput=document.createElement("input");fileInput.type="file";fileInput.accept=".json,.tbh,application/json,text/plain";fileInput.style.display="none";body.appendChild(fileInput);
    fileInput.onchange=()=>{const f=fileInput.files[0];if(f)readFile(f)};
    const drop=body.querySelector("#svDrop");
    drop.onclick=()=>fileInput.click();
    drop.ondragover=e=>{e.preventDefault();drop.classList.add("over")};
    drop.ondragleave=()=>drop.classList.remove("over");
    drop.ondrop=e=>{e.preventDefault();drop.classList.remove("over");const f=e.dataTransfer.files&&e.dataTransfer.files[0];if(f)readFile(f)};
    body.querySelectorAll("[data-act]").forEach(b=>{b.onclick=()=>act(b.dataset.act,b.dataset.slot)});
  }

  function renderConfirm(){
    const p=preview(pending);
    body.innerHTML=`
      <div class="svSec">Загрузить это сохранение?</div>${chips(p)}
      <div class="svWarn">⚠ Текущий прогресс этого устройства (волна ${preview(currentSave()).wave}) будет заменён. Создам резервную копию — вернуть можно в этом же окне. После перезагрузки появится подтверждение «Перенос применён».</div>
      <div class="svRow"><button class="svBtn green" data-act="apply">✅ Заменить и перезапустить</button><button class="svBtn ghost" data-act="back">← Назад</button></div>`;
    body.querySelectorAll("[data-act]").forEach(b=>{b.onclick=()=>act(b.dataset.act)});
  }

  function readFile(f){const r=new FileReader();r.onload=()=>{try{pending=parseAny(String(r.result));T.audio.play("click");renderConfirm()}catch(e){err(e.message)}};r.onerror=()=>err("Не удалось прочитать файл.");r.readAsText(f)}

  function download(){const save=currentSave();const env=envelope(save);const blob=new Blob([JSON.stringify(env,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");const d=new Date();const pad=n=>String(n).padStart(2,"0");a.href=url;a.download=`tbh-save-w${save.wave||1}-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);T.toast("Файл сохранения скачан","success");T.audio.play("chest")}
  function copyCode(){const code="TBH1."+b64enc(JSON.stringify(envelope(currentSave())));const ta=body.querySelector("#svCode");if(ta){ta.value=code;ta.focus();ta.select()}
    const done=()=>T.toast("Код переноса скопирован ("+code.length+" символов — копируй целиком)","success");
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(code).then(done).catch(()=>{try{document.execCommand("copy");done()}catch(e){T.toast("Скопируй код из поля вручную (выделить всё)","info")}})}
    else{try{document.execCommand("copy");done()}catch(e){T.toast("Скопируй код из поля вручную (выделить всё)","info")}}}
  function applyPending(){
    const raw=readRaw();if(raw)writeJSON(BAK,{at:new Date().toISOString(),raw});
    if(!writeRaw(JSON.stringify(pending))){err("Не удалось записать сохранение: хранилище браузера недоступно (приватный режим?).");return}
    const p=preview(pending);writeJSON(FLAG,{at:new Date().toISOString(),wave:p.wave,gems:p.gems,rec:p.rec});
    T.toast("Сохранение записано — перезапуск…","success");
    safeReload();
  }
  function restore(){const b=readJSON(BAK);if(!b||!b.raw){err("Резервная копия пуста.");return}if(!writeRaw(b.raw)){err("Не удалось записать.");return}delJSON(BAK);T.toast("Предыдущее сохранение возвращено — перезапуск…","success");safeReload()}

  function act(a,slot){
    T.audio&&T.audio.play("click");
    if(a==="file")download();
    else if(a==="code")copyCode();
    else if(a==="pick")fileInput.click();
    else if(a==="loadcode"){try{pending=parseAny(body.querySelector("#svCode").value);renderConfirm()}catch(e){err(e.message)}}
    else if(a==="apply")applyPending();
    else if(a==="back"){pending=null;renderMain()}
    else if(a==="toslot"){if(writeJSON(SLOT(+slot),envelope(currentSave()))){T.toast("Сохранено в слот "+slot,"success");renderMain()}else err("Хранилище недоступно.")}
    else if(a==="loadslot"){const s=readJSON(SLOT(+slot));if(s&&s.save){pending=migrateSave(s.save);renderConfirm()}else err("Слот пуст.")}
    else if(a==="delslot"){delJSON(SLOT(+slot));T.toast("Слот "+slot+" очищен","info");renderMain()}
    else if(a==="restore")restore();
    else if(a==="delbak"){delJSON(BAK);renderMain()}
  }

  const tc=document.querySelector(".topControls");
  if(tc&&!document.getElementById("saveBtn")){const b=document.createElement("button");b.className="iconBtn";b.id="saveBtn";b.title="Сохранения и перенос";b.setAttribute("aria-label","Сохранения и перенос");b.textContent="💾";tc.insertBefore(b,document.getElementById("helpBtn")||null);b.onclick=open}
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&root.classList.contains("on"))close()});
})();