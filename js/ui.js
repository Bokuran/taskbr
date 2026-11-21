(function(){
  const T=window.TBH,C=T.config,BAL=C.balance,U=T.util,E=T.events,
    el=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e},
    setText=(e,v)=>{if(e&&e.__t!==v){e.__t=v;e.textContent=v}},
    refs={};
  const plural=(n,one,few,many)=>{const a=n%10,b=n%100;return a===1&&b!==11?one:a>=2&&a<=4&&(b<10||b>=20)?few:many};
  const sec=t=>`<div style="font:900 10px var(--mono);letter-spacing:1.5px;color:var(--gold);margin:12px 0 6px;text-transform:uppercase">${t}</div>`;
  let buyQty="1",paused=false,modalOpen=false,modalPause=false,invDirty=true,heroesDirty=true,mapCircle=null,chainKey="";const itemHeroPick={};
  const UI=T.ui={
    isPaused:()=>paused||modalPause,
    init(){["gold","gems","dps","zoneIcon","zoneName","waveLabel","progress","stageNow","stageChain","mapBtn","autoBtn","bossBar","bossName","bossFill","bossTime","partyFill","partyText","partyStats","dropInfo","heroList","itemList","bagCount","filterSlot","filterRarity","sortItems","autoSell","sellSpare","lazInfo","lazBtn","mineInfo","mineBtn","prestGain","prestBtn","statKills","statBosses","statDrops","statTime","log","pauseBtn","speedBtn","soundBtn","helpBtn","resetBtn","hint","hintClose","saveDot","banner","pauseOverlay","hurt"].forEach(id=>refs[id]=document.getElementById(id));refs.lazCost=refs.lazBtn.querySelector("span");refs.mineCost=refs.mineBtn.querySelector("span");refs.dropInfo.textContent=Math.round(BAL.drops.chance*100)+"%";
      const hpanel=document.querySelector('.panel[data-panel="heroes"]');if(hpanel&&!document.getElementById("partyBar")){const pb=el("div","partyBar");pb.id="partyBar";hpanel.insertBefore(pb,hpanel.querySelector(".panelBody"));refs.partyBar=pb}
      const hh=document.querySelector('.panel[data-panel="heroes"] .panelHead');if(hh&&!document.getElementById("partyCount")){const pc=el("span");pc.id="partyCount";pc.style.cssText="font:900 11px var(--mono);color:var(--gold);letter-spacing:1px";hh.insertBefore(pc,hh.querySelector("#buyQty")||null);refs.partyCount=pc}
      buildFilters();bindControls();bindInventory();renderPartyBar();renderHeroes();renderInventory();renderStageChain();updateAll();E.on("inv",()=>{invDirty=true});E.on("heroes",()=>{heroesDirty=true;renderPartyBar()});E.on("party",()=>{heroesDirty=true;invDirty=true;renderPartyBar()});E.on("sprites",()=>{heroesDirty=true;renderPartyBar()});E.on("wave",()=>{updateAll();renderStageChain()});E.on("log",addLog);E.on("toast",d=>toast(d.msg,d.type));E.on("banner",d=>banner(d.txt,d.cls));E.on("hurt",()=>{refs.hurt.classList.remove("on");void refs.hurt.offsetWidth;refs.hurt.classList.add("on")});E.on("saved",()=>{refs.saveDot.classList.remove("flash");void refs.saveDot.offsetWidth;refs.saveDot.classList.add("flash")});E.on("victory",showVictory);if(!T.S.hint)refs.hint.style.display="none";addLog({msg:"Отряд выходит на волну 1. Автобой включён.",type:"success"});addLog({msg:"Монстры атакуют героев. Броня и Некромант решают.",type:"drop"})},
    tick(){if(invDirty){invDirty=false;renderInventory()}if(heroesDirty){heroesDirty=false;renderHeroes()}updateAll()},
    showOffline(gold,items,secs){const list=items.map(it=>{const r=T.derived.rarityOf(it),d=T.derived.itemDef(it);return`<div class="offItem"><span>${d.icon}</span><b style="color:${r.color}">${d.name}</b><small>ур.${it.ilvl}</small></div>`}).join("");modal({title:"С возвращением, герой!",sub:"ОФЛАЙН-БОЙ",icon:"🌙",html:`<p>Отряд сражался <b>${U.fmtTime(secs)}</b>, пока игра была закрыта.</p><div class="offGold">+🪙 ${U.fmt(gold)}</div>${items.length?`<p><b>Найдено предметов:</b></p>${list}`:"<p>Предметов не найдено.</p>"}`,buttons:[{label:"Забрать всё",fn:()=>{T.econ.addGold(gold,{raw:true});items.forEach(it=>T.items.handleDrop(it,null,null,"Офлайн"));T.save()}}]})},
    setPaused(v){paused=v;refs.pauseOverlay.classList.toggle("on",v);refs.pauseBtn.textContent=v?"▶":"⏸";refs.pauseBtn.classList.toggle("on",v);refs.pauseBtn.setAttribute("aria-pressed",String(v))}
  };
  function bindControls(){refs.pauseBtn.onclick=()=>{T.audio.init();T.audio.resume();T.audio.play("click");UI.setPaused(!paused)};refs.speedBtn.onclick=()=>{T.audio.init();T.S.settings.speed=T.S.settings.speed>=3?1:T.S.settings.speed+1;T.save();T.audio.play("click");updateAll()};refs.soundBtn.onclick=()=>{T.audio.init();T.S.settings.muted=!T.S.settings.muted;T.audio.setMuted(T.S.settings.muted);T.save();updateAll()};refs.helpBtn.onclick=()=>{T.audio.init();showHelp()};refs.resetBtn.onclick=()=>{T.audio.init();showReset()};refs.hintClose.onclick=()=>{T.S.hint=false;refs.hint.style.display="none";T.save()};refs.autoBtn.onclick=()=>{T.S.settings.auto=!T.S.settings.auto;T.save();T.audio.play("click");updateAll()};refs.mapBtn.onclick=()=>{T.audio.init();T.audio.play("click");mapCircle=null;showWorldMap()};refs.sellSpare.onclick=()=>{T.audio.init();showSellSpare()};refs.lazBtn.onclick=()=>{T.audio.init();T.econ.upgradeLazaret()};refs.mineBtn.onclick=()=>{T.audio.init();T.econ.upgradeMine()};refs.prestBtn.onclick=()=>{T.audio.init();showPrestige()};document.querySelectorAll("#buyQty button").forEach(b=>{b.onclick=()=>{buyQty=b.dataset.q;document.querySelectorAll("#buyQty button").forEach(x=>x.classList.toggle("on",x===b));T.audio.play("click");renderHeroes()}});document.querySelectorAll(".mobileTabs button").forEach(b=>{b.onclick=()=>{document.querySelectorAll(".mobileTabs button").forEach(x=>x.classList.toggle("on",x===b));document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.dataset.panel===b.dataset.tab));T.audio.play("click")}});[refs.filterSlot,refs.filterRarity,refs.sortItems].forEach(s=>s.onchange=()=>{invDirty=true;T.audio.play("click")});refs.autoSell.onchange=()=>{T.S.settings.autoSell=refs.autoSell.value;T.save();T.audio.play("click")}}
  function bindInventory(){
    refs.itemList.addEventListener("click",e=>{const btn=e.target.closest("button");if(!btn)return;const card=btn.closest(".itemCard");if(!card)return;const uid=card.dataset.uid;if(btn.classList.contains("equipBtn")){const v=card.querySelector(".heroPick").value;itemHeroPick[uid]=v;T.items.equip(uid,v)}else if(btn.classList.contains("sellBtn"))T.items.sell(uid)});
    refs.itemList.addEventListener("change",e=>{const sel=e.target;if(!sel.classList||!sel.classList.contains("heroPick"))return;const card=sel.closest(".itemCard");if(!card)return;const uid=card.dataset.uid;itemHeroPick[uid]=sel.value;const old=card.querySelector(".replaceHint");if(old)old.remove();const h=replaceHintFor(uid,sel.value);if(h)card.querySelector(".itemActions").append(el("div","replaceHint",h))});
  }
  function replaceHintFor(uid,heroId){const S=T.S,it=S.inventory.find(i=>i.uid===uid),h=heroId?S.heroes[heroId]:null;if(!it||!h?.rec)return"";const oldUid=h.equip[it.slot];if(!oldUid||!S.equipped[oldUid])return"";const od=T.derived.itemDef(S.equipped[oldUid]);return`Заменит: ${od.icon} ${od.name}`}
  function buildFilters(){for(const k in C.slots)refs.filterSlot.append(new Option(C.slots[k].icon+" "+C.slots[k].name,k));C.rarities.forEach(r=>refs.filterRarity.append(new Option(r.name+"+",r.id)));if(T.S.settings.autoSell!=="off"&&T.S.settings.autoSell!=="spare")T.S.settings.autoSell="spare";refs.autoSell.value=T.S.settings.autoSell}
  function heroStatLine(st){const main=st.isHealer?`✚ ${U.fmt(st.hps)}/с · ⚔ ${U.fmt(st.dps)}/с`:`⚔ ${U.fmt(st.dps)}/с`;return`${main} · ❤ ${U.fmt(st.maxHp)} · 🛡 ${st.defPct.toFixed(0)}% · ✚ ${st.regen.toFixed(1)}/с`}
  function drawPortrait(cv,s,size,flip){size=size||46;const x=cv.getContext("2d");x.imageSmoothingEnabled=false;x.clearRect(0,0,size,size);x.save();if(flip){x.translate(size,0);x.scale(-1,1)}const sc=Math.min(size/s.w,size/s.h),dw=s.w*sc,dh=s.h*sc;x.drawImage(s.c,(size-dw)/2,(size-dh)/2,dw,dh);x.restore()}
  function stageState(w){const S=T.S;return w===S.wave?"current":w>S.maxWave?"locked":w<S.maxWave?"cleared":"avail"}
  function jumpWave(w){if(w<1||w>T.S.maxWave){toast("Этап ещё недоступен — сначала пройди предыдущие","info");return false}T.audio.play("click");T.battle.startWave(w,{silent:true});return true}
  function renderStageChain(){const S=T.S,box=refs.stageChain;if(!box)return;const key=S.wave+"/"+S.maxWave;if(key===chainKey)return;chainKey=key;
    const total=T.waves.total(),zi=C.levels.findIndex(z=>z.id===T.waves.zoneFor(S.wave).zone.id),tier=Math.floor((S.wave-1)/total),base=tier*total+zi*(C.levels[zi].waves||10),n=C.levels[zi].waves||10;
    box.innerHTML="";for(let i=0;i<n;i++){const w=base+i+1,st=stageState(w),boss=T.waves.isBoss(w);const b=el("button","stageDot "+st+(boss?" boss":""));b.title=`Этап ${i+1}/${n} · Волна ${w}${boss?" · БОСС":""}${st==="locked"?" (закрыто)":""}`;b.setAttribute("aria-label",b.title);if(st==="locked")b.disabled=true;else b.onclick=()=>{jumpWave(w)};box.append(b)}
    setText(refs.stageNow,`этап ${((S.wave-1)%(C.levels[zi].waves||10))+1}/${n}`)}
  function showWorldMap(){
    const S=T.S,total=T.waves.total(),Z=C.levels;
    const curTier=Math.floor((S.wave-1)/total),maxTier=Math.floor((Math.max(S.maxWave,S.wave)-1)/total);
    if(mapCircle==null||mapCircle>maxTier)mapCircle=curTier;
    const tabs=Array.from({length:maxTier+1},(_,c)=>`<button data-circle="${c}" class="${c===mapCircle?"on":""}">Круг ${c+1}</button>`).join("");
    const zones=Z.map((z,zi)=>{const nw=z.waves||10,base=mapCircle*total+zi*nw,first=base+1,frontier=Math.min(base+nw,S.maxWave);
      const locked=first>S.maxWave,done=Math.max(0,Math.min(nw,S.maxWave-base));
      const isCur=T.waves.zoneFor(S.wave).zone.id===z.id&&Math.floor((S.wave-1)/total)===mapCircle;
      const stages=Array.from({length:nw},(_,i)=>{const w=base+i+1,st=stageState(w),boss=T.waves.isBoss(w);return`<button class="mapStage ${st}${boss?" boss":""}" data-wave="${w}" ${st==="locked"?"disabled":""} title="Этап ${i+1} · Волна ${w}${boss?" · БОСС":""}">${boss?"👑":i+1}</button>`}).join("");
      return`<div class="mapZone${locked?" locked":""}${isCur?" cur":""}${done>=nw?" done":""}"><button class="mapNode" data-wave="${frontier}" ${locked?"disabled":""} title="${locked?"Локация закрыта":"Перейти к пройденному рубежу локации"}"><span class="mi">${z.icon||"🗺"}</span><span class="mn">Уровень ${zi+1} · ${z.name}</span><span class="mp">${locked?"🔒":done+"/"+nw}</span></button><div class="mapStages">${stages}</div></div>`}).join("");
    modal({title:"Карта прогресса",sub:"ЛОКАЦИИ · УРОВНИ · ЭТАПЫ",icon:"🗺",
      html:`<p>Сейчас: <b>${T.waves.zoneFor(S.wave).zone.name}</b> · круг ${curTier+1} · волна ${S.wave}. Открыто до волны <b>${S.maxWave}</b>. Клик по этапу или локации переносит отряд; закрытые этапы недоступны.</p>
        <div class="mapLegend"><span><i style="background:var(--green)"></i>текущий</span><span><i style="background:var(--gold)"></i>пройден</span><span><i style="background:rgba(56,223,255,.4);border:1px solid var(--cyan)"></i>доступен</span><span><i style="background:var(--surf2);opacity:.5"></i>закрыт</span><span>👑 босс</span></div>
        <div class="seg mapTabs">${tabs}</div><div class="mapList">${zones}</div>`,
      buttons:[{label:"Закрыть",cls:"ghostBtn"}],
      after:card=>{
        card.querySelectorAll("[data-circle]").forEach(b=>{b.onclick=()=>{mapCircle=+b.dataset.circle;T.audio.play("click");showWorldMap()}});
        card.querySelectorAll("[data-wave]").forEach(b=>{b.onclick=()=>{const w=+b.dataset.wave;if(jumpWave(w))showWorldMap()}});
      }});
  }
  function renderPartyBar(){const bar=refs.partyBar;if(!bar)return;bar.innerHTML="";const F=T.formation(),cap=T.partyCap();for(let i=0;i<cap;i++){const hd=F[i];const slot=el("button","pSlot"+(hd?" filled":""));if(hd){const cv=document.createElement("canvas");cv.width=40;cv.height=40;drawPortrait(cv,T.getSprite(hd,"hero")[0],40,hd.sprite?.face==="left");slot.append(cv);slot.append(el("span","pName",(i+1)+" "+hd.name));slot.title="Позиция "+(i+1)+(i===0?" (передняя, танк)":"")+" — клик: построение"}else{slot.append(el("span","pPlus","+"));slot.title="Добавить героя в отряд"}slot.onclick=()=>{T.audio.init();T.audio.play("click");if(hd)showFormation();else showPartyManager()};bar.append(slot)}
    const gear=el("button","pSlot");gear.append(el("span","pPlus","⚙"));gear.title="Построение: порядок позиций";gear.onclick=()=>{T.audio.init();T.audio.play("click");showFormation()};bar.append(gear);
    const mgr=el("button","pSlot");mgr.append(el("span","pPlus","👥"));mgr.title="Состав отряда: актив / резерв";mgr.onclick=()=>{T.audio.init();T.audio.play("click");showPartyManager()};bar.append(mgr)}
  function showPartyManager(){
    const S=T.S,cap=T.partyCap(),F=T.formation();
    const role=hd=>hd.role==="healer"?"лекарь":hd.range==="melee"?"ближний бой":"дальний бой";
    const active=F.map((hd,i)=>`<div class="pickRow"><span class="pn">${i+1}. ${hd.name}</span><span class="ps">${role(hd)} · Ур.${S.heroes[hd.id].lvl}</span><button data-res="${hd.id}">В резерв</button></div>`).join("");
    const reserve=C.heroes.filter(h=>S.heroes[h.id].rec&&!T.inParty(h.id));
    const resRows=reserve.map(hd=>`<div class="pickRow"><span class="pn">${hd.name}</span><span class="ps">${role(hd)} · Ур.${S.heroes[hd.id].lvl}</span><button data-add="${hd.id}" ${S.party.length>=cap?"disabled":""}>В отряд</button></div>`).join("")||'<p style="opacity:.6;margin:4px 0">Резерв пуст — все нанятые в бою.</p>';
    const locked=C.heroes.filter(h=>!S.heroes[h.id].rec);
    const lockRows=locked.map(hd=>`<div class="pickRow"><span class="pn">${hd.name}</span><span class="ps">не нанят</span><button data-hire="${hd.id}">Нанять 🪙${U.fmt(hd.recruitCost||0)}</button></div>`).join("");
    modal({title:"Состав отряда",sub:"АКТИВ / РЕЗЕРВ",icon:"👥",
      html:`<p>Активный отряд: <b>${S.party.length}/${cap}</b>. Порядок списка = построение в бою (1 — передняя линия). Резерв не участвует в бою, но сохраняет уровень и экипировку.</p>${sec("⚔ В отряде")}${active||'<p style="opacity:.6">Отряд пуст.</p>'}${sec("🪑 Резерв")}${resRows}${locked.length?sec("🔒 Не наняты")+lockRows:""}`,
      buttons:[{label:"Готово",cls:"ghostBtn"}],
      after:card=>{
        card.querySelectorAll("[data-res]").forEach(b=>{b.onclick=()=>{T.audio.play("click");T.toggleParty(b.dataset.res);showPartyManager()}});
        card.querySelectorAll("[data-add]").forEach(b=>{b.onclick=()=>{T.audio.play("click");T.toggleParty(b.dataset.add);showPartyManager()}});
        card.querySelectorAll("[data-hire]").forEach(b=>{b.onclick=()=>{T.audio.play("click");T.econ.buyHero(b.dataset.hire,"1");showPartyManager()}});
      }});
  }
  function showFormation(){
    const F=T.formation();
    const rows=F.map((hd,i)=>{const lock=i===0;const role=lock?"танк · спереди":(i===F.length-1?"тыл":"центр");return`<div class="pickRow"><span class="pn">${i+1}. ${hd.name}</span><span class="ps">${role}</span>${lock?'<button disabled>🛡</button>':`<button data-fm="${hd.id}" data-dir="-1">▲</button><button data-fm="${hd.id}" data-dir="1">▼</button>`}</div>`}).join("");
    modal({title:"Построение отряда",sub:"ПОРЯДОК В БОЮ",icon:"🛡",html:`<p>Позиция 1 — передняя линия: её всегда занимает танк (макс. HP). Остальные стоят за ним в заданном порядке; ▲▼ меняют их очерёдность. Порядок сохраняется.</p>${rows||"<p>Нет героев в отряде.</p>"}`,buttons:[{label:"Готово",cls:"ghostBtn"}],after:card=>{card.querySelectorAll("[data-fm]").forEach(b=>{b.onclick=()=>{const id=b.dataset.fm,dir=+b.dataset.dir;const order=T.formation().slice(1).map(h=>h.id);const i=order.indexOf(id),j=i+dir;if(i<0||j<0||j>=order.length)return;[order[i],order[j]]=[order[j],order[i]];T.setOrder(order);T.audio.play("click");showFormation()}})}});
  }
  function renderHeroes(){const S=T.S,box=refs.heroList;box.innerHTML="";const F=T.formation();for(const hd of C.heroes){const h=S.heroes[hd.id],st=T.derived.heroStats(hd.id),inP=T.inParty(hd.id),fi=F.findIndex(x=>x.id===hd.id),card=el("div","heroCard"+(h.rec?"":" locked"));if(h.rec&&!inP)card.style.opacity=".78";const portrait=el("div","portrait"),cv=document.createElement("canvas");cv.width=46;cv.height=46;drawPortrait(cv,T.getSprite(hd,"hero")[0],46,hd.sprite?.face==="left");portrait.append(cv);card.append(portrait);const info=el("div","heroInfo");info.innerHTML=`<b>${hd.name} ${h.rec?`<span style="color:var(--gold2)">Ур.${h.lvl}</span>`:""} ${h.rec?(inP?`<span style="color:var(--green)">⚔${fi+1}</span>`:'<span style="color:var(--faint)">🪑</span>'):""}</b><span class="flavor">${hd.flavor||""}</span><span class="heroStats">${h.rec?heroStatLine(st):"Не нанят · "+(hd.role==="healer"?"лечит отряд":hd.range==="melee"?"ближний бой":"дальний бой")}</span>`;const slots=el("div","slots");for(const slot in C.slots){const uid=h.equip[slot],it=uid?S.equipped[uid]:null,b=el("button","slot"+(it?" filled":""));if(it){const r=T.derived.rarityOf(it),d=T.derived.itemDef(it);b.style.color=r.color;b.style.borderColor=r.color;b.title=T.items.statLines(it).join("\n")+"\nКлик — снять";b.textContent=`${d.icon} ${d.name}`;b.onclick=()=>T.items.unequip(hd.id,slot)}else{b.title="Пустой слот: "+C.slots[slot].name;b.textContent=`${C.slots[slot].icon} ${C.slots[slot].name}`;b.onclick=()=>{refs.filterSlot.value=slot;invDirty=true;document.querySelector('.mobileTabs button[data-tab="bag"]').click();toast("Выберите предмет в инвентаре и нажмите «Надеть».","info")}}slots.append(b)}info.append(slots);if(h.rec){const pb=el("button","miniBtn",inP?"🪑 В резерв":"⚔ В отряд");pb.style.marginTop="6px";pb.disabled=!inP&&S.party.length>=T.partyCap();pb.title=inP?"Убрать из боевого отряда":"Добавить в боевой отряд";pb.onclick=()=>{T.audio.play("click");T.toggleParty(hd.id)};info.append(pb)}card.append(info);const btn=el("button","buyBtn"+(h.rec?"":" recruit"));if(h.rec){const q=T.econ.heroCost(hd.id,buyQty);btn.innerHTML=`<b>Улучшить${q.n>1?" ×"+q.n:""}</b><span>🪙 ${U.fmt(q.cost)}</span>`;btn.disabled=!q.affordable;btn.onclick=()=>T.econ.buyHero(hd.id,buyQty)}else{btn.innerHTML=`<b>Нанять</b><span>🪙 ${U.fmt(hd.recruitCost||0)}</span>`;btn.disabled=S.gold<(hd.recruitCost||0);btn.onclick=()=>T.econ.buyHero(hd.id,"1")}card.append(btn);box.append(card)}}
  function renderInventory(){
    const S=T.S,box=refs.itemList,scroll=box.scrollTop;
    setText(refs.bagCount,`${S.inventory.length}/${BAL.drops.inventoryCap}`);
    const spare=T.items.spareItems(),spareGold=spare.reduce((s,i)=>s+i.value,0);
    refs.sellSpare.disabled=!spare.length;
    setText(refs.sellSpare,spare.length?`🧹 Продать лишнее · ${spare.length} шт · ${U.fmt(spareGold)}🪙`:"🧹 Лишнего нет");
    box.innerHTML="";
    let list=[...S.inventory];
    const slot=refs.filterSlot.value,rar=refs.filterRarity.value,sort=refs.sortItems.value;
    if(slot!=="all")list=list.filter(i=>i.slot===slot);
    if(rar!=="all"){const min=C.rarities.findIndex(r=>r.id===rar);list=list.filter(i=>C.rarities.findIndex(r=>r.id===i.rarity)>=min)}
    if(sort==="new")list.sort((a,b)=>parseInt(b.uid.slice(1))-parseInt(a.uid.slice(1)));else if(sort==="power")list.sort((a,b)=>T.items.power(b)-T.items.power(a));else list.sort((a,b)=>b.value-a.value);
    if(!list.length){box.append(el("div","empty","<b>Инвентарь пуст</b>Предметы падают с монстров и боссов.<br>Фармите волны — экипировка сама найдёт вас."));return}
    const recruited=T.partyDefs(),frag=document.createDocumentFragment();
    for(const it of list){
      const d=T.derived.itemDef(it),r=T.derived.rarityOf(it),card=el("div","itemCard");
      card.dataset.uid=it.uid;card.style.borderLeftColor=r.color;
      const icon=el("div","itemIcon",d.icon);icon.style.color=r.color;icon.style.borderColor=r.color;card.append(icon);
      const info=el("div","itemInfo");info.innerHTML=`<b style="color:${r.color}">${d.name}</b><span class="meta">${r.name} · ${C.slots[it.slot].name} · Ур.${it.ilvl}</span><div class="itemStats">${T.items.statLines(it).map(s=>`<span>${s}</span>`).join("")}</div>`;card.append(info);
      const actions=el("div","itemActions"),sel=document.createElement("select");sel.className="heroPick";
      recruited.forEach(h=>sel.append(new Option(h.name,h.id)));
      sel.value=itemHeroPick[it.uid]&&S.heroes[itemHeroPick[it.uid]]?.rec?itemHeroPick[it.uid]:recruited[0]?.id;
      actions.append(sel,el("button","equipBtn","Надеть"),el("button","sellBtn",`Продать ${U.fmt(it.value)}🪙`));
      const hint=replaceHintFor(it.uid,sel.value);if(hint)actions.append(el("div","replaceHint",hint));
      card.append(actions);frag.append(card);
    }
    box.append(frag);box.scrollTop=scroll;
  }
  function updateAll(){
    const S=T.S,B=T.battleState,z=T.waves.zoneFor(S.wave);
    setText(refs.gold,U.fmt(S.gold));setText(refs.gems,U.fmt(S.gems));setText(refs.dps,U.fmt(T.derived.totalDps()));
    setText(refs.zoneIcon,z.zone.icon||"🗺");setText(refs.zoneName,z.zone.name+(z.tier?` · круг ${z.tier+1}`:""));
    setText(refs.waveLabel,"Волна "+S.wave+(B.bossWave?" · БОСС":""));setText(refs.progress,`${B.waveKills}/${B.waveTotal}`);
    renderStageChain();
    refs.autoBtn.classList.toggle("on",S.settings.auto);setText(refs.autoBtn,S.settings.auto?"АВТО ▶":"ФАРМ ∞");
    setText(refs.speedBtn,"×"+S.settings.speed);
    const snd=S.settings.muted?"🔇":"🔊";
    if(refs.soundBtn.__t!==snd){setText(refs.soundBtn,snd);refs.soundBtn.title=S.settings.muted?"Включить звук (M)":"Выключить звук (M)";refs.soundBtn.setAttribute("aria-pressed",String(!S.settings.muted))}
    setText(refs.partyCount,`Отряд ${S.party.length}/${T.partyCap()}`);
    const bossActive=B.bossWave&&B.boss&&!B.boss.dead;refs.bossBar.classList.toggle("on",bossActive);
    if(bossActive){setText(refs.bossName,"👑 "+B.boss.def.name);refs.bossFill.style.width=U.clamp(B.bossT/BAL.boss.timer*100,0,100)+"%";setText(refs.bossTime,Math.ceil(B.bossT)+"с")}
    let alive=0,total=0,hp=0,maxHp=0;
    for(const hd of T.partyDefs()){const hs=S.heroes[hd.id];if(!hs?.rec)continue;total++;const st=T.derived.heroStats(hd.id);maxHp+=st.maxHp;const rt=B.hs[hd.id];if(rt&&!rt.dead){alive++;hp+=Math.max(0,rt.hp)}}
    const ppct=maxHp>0?U.clamp(hp/maxHp*100,0,100):0;
    refs.partyFill.style.width=ppct+"%";
    refs.partyFill.style.background=ppct>50?"linear-gradient(90deg,var(--green),#baff8a)":ppct>25?"linear-gradient(90deg,var(--gold),#ffe08a)":"linear-gradient(90deg,var(--red),#ff9aaa)";
    setText(refs.partyText,`${alive}/${total} в строю`);setText(refs.partyStats,`HP ${U.fmt(hp)}/${U.fmt(maxHp)} · ✚ ${U.fmt(T.derived.totalHps())}/с`);
    setText(refs.lazInfo,`Ур. ${S.lazaretLvl} · +${Math.round(S.lazaretLvl*BAL.party.hpBonusPerLvl*100)}% HP героям`);
    const lc=T.econ.lazaretCost();setText(refs.lazCost,"🪙 "+U.fmt(lc));refs.lazBtn.disabled=S.gold<lc;
    setText(refs.mineInfo,`Ур. ${S.mineLvl} · ×${T.derived.goldMult().toFixed(2)} золото`);
    const mc=T.econ.mineCost();setText(refs.mineCost,"🪙 "+U.fmt(mc));refs.mineBtn.disabled=S.gold<mc;
    const gain=T.econ.prestGain();setText(refs.prestGain,gain?`Сейчас получите: 💎 ${gain}`:`Доступно с волны ${BAL.prestige.minWave} (рекорд: ${S.maxWave})`);refs.prestBtn.disabled=gain<1;
    setText(refs.statKills,U.fmt(S.stats.kills));setText(refs.statBosses,U.fmt(S.stats.bosses));setText(refs.statDrops,U.fmt(S.stats.drops));setText(refs.statTime,U.fmtTime(S.stats.play));
    const cards=refs.heroList.children;
    C.heroes.forEach((hd,i)=>{const card=cards[i];if(!card)return;const h=S.heroes[hd.id],btn=card.querySelector(".buyBtn");if(!btn)return;if(h.rec){const q=T.econ.heroCost(hd.id,buyQty);setText(btn.querySelector("b"),`Улучшить${q.n>1?" ×"+q.n:""}`);setText(btn.querySelector("span"),"🪙 "+U.fmt(q.cost));btn.disabled=!q.affordable;setText(card.querySelector(".heroStats"),heroStatLine(T.derived.heroStats(hd.id)));const lvlSpan=card.querySelector(".heroInfo b span");if(lvlSpan)setText(lvlSpan,"Ур."+h.lvl)}else btn.disabled=S.gold<(hd.recruitCost||0)});
  }
  function addLog(d){const row=el("div","logRow "+(d.type||"info"),`<time>${U.nowTime()}</time>${d.msg}`);if(d.color)row.style.color=d.color;refs.log.prepend(row);while(refs.log.children.length>80)refs.log.lastChild.remove()}
  function toast(msg,type="info"){const box=document.getElementById("toasts"),t=el("div","toast "+type,msg);t.onclick=()=>t.remove();box.append(t);while(box.children.length>4)box.firstChild.remove();setTimeout(()=>{t.classList.add("out");setTimeout(()=>t.remove(),260)},4200)}
  function banner(txt,cls=""){const b=refs.banner;b.className="banner";void b.offsetWidth;b.textContent=txt;b.className="banner show "+cls}
  function modal(opts){modalOpen=true;modalPause=!!opts.pause;const root=document.getElementById("modal");root.classList.add("on");root.innerHTML=`<div class="scrim"></div><div class="card"><div class="sub">${opts.sub||"TBH"}</div><h2>${opts.icon||""} ${opts.title}</h2><div>${opts.html}</div><div class="modalBtns"></div></div>`;const btns=root.querySelector(".modalBtns");(opts.buttons||[{label:"OK"}]).forEach(b=>{const btn=el("button",b.cls||"bigBtn"+(b.danger?" danger":""),b.label);btn.onclick=()=>{T.audio.init();T.audio.play("click");if(b.fn)b.fn();closeModal()};btns.append(btn)});if(opts.after)opts.after(root.querySelector(".card"))}
  function closeModal(){const root=document.getElementById("modal");root.classList.remove("on");root.innerHTML="";modalOpen=false;modalPause=false}
  function hardReset(){
    try{
      const orig=T.save;
      removeEventListener("beforeunload",orig);
      removeEventListener("pagehide",orig);
      T.save=function(){};
      localStorage.setItem("tbh_wipe","1");
      localStorage.removeItem("tbh_idle_equipment_v1");
      localStorage.removeItem("tbh_backup_v1");
      localStorage.removeItem("tbh_import_flag");
    }catch(e){}
    location.reload();
  }
  function showSellSpare(){
    const spare=T.items.spareItems();
    if(!spare.length){toast("✓ Лишних предметов нет — надето всё лучшее","success");return}
    if(T.items.autoEquipPreview().changes===0){T.items.sellSpare();return}
    const total=spare.reduce((s,i)=>s+i.value,0),counts={};
    spare.forEach(i=>counts[i.rarity]=(counts[i.rarity]||0)+1);
    const line=C.rarities.filter(r=>counts[r.id]).map(r=>`<b style="color:${r.color}">${r.name} ×${counts[r.id]}</b>`).join(" · ");
    modal({title:"Продать всё лишнее?",sub:"ИНВЕНТАРЬ",icon:"🧹",
      html:`<p>К продаже: <b>${spare.length}</b> ${plural(spare.length,"предмет","предмета","предметов")} вне лучшего комплекта отряда:</p><p>${line}</p><p class="offGold">+🪙 ${U.fmt(total)}</p><p style="opacity:.75">Надетая экипировка не пострадает. Запас для ещё не нанятых героев тоже будет продан. Бой продолжается, пока окно открыто.</p>`,
      buttons:[{label:"Отмена",cls:"ghostBtn"},{label:"Продать",fn:()=>T.items.sellSpare()},{label:"✨ Надеть лучшее и продать",fn:()=>{T.items.autoEquip();T.items.sellSpare()}}]});
  }
  function showPrestige(){const gain=T.econ.prestGain();if(gain<1)return;modal({title:"Перерождение",sub:"НОВЫЙ КРУГ СИЛЫ",icon:"💎",html:`<p>Сбросятся: волна, золото, герои, лазарет, жила, <b>весь инвентарь и экипировка</b>.</p><p>Останутся: кристаллы и статистика. Вы получите <b style="color:var(--cyan)">💎 ${gain}</b> — это навсегда <b>+${gain*Math.round(BAL.prestige.gemBonus*100)}%</b> к урону, лечению и золоту.</p>`,buttons:[{label:"Отмена",cls:"ghostBtn"},{label:"Переродиться",fn:()=>T.econ.doPrestige()}]})}
  function showReset(){modal({title:"Сбросить сохранение?",sub:"ОПАСНАЯ ЗОНА",icon:"⚠️",html:`<p>Все герои, золото, кристаллы, предметы и прогресс будут <b style="color:var(--red)">удалены навсегда</b>, включая резервную копию переноса.</p><p style="opacity:.75">Локальные слоты 💾 и скачанные файлы-копии останутся — из них можно восстановиться.</p>`,buttons:[{label:"Отмена",cls:"ghostBtn"},{label:"Стереть всё",danger:true,fn:hardReset}]})}
  function showVictory(){const S=T.S,fin=T.waves.bossDef(T.waves.victoryWave());modal({title:"Мир покорен!",sub:"ПОБЕДА · ВОЛНА "+T.waves.victoryWave(),icon:"🏆",html:`<p>${fin.name} повержен. Но орды бесконечны — отряд готов идти дальше.</p><p><b>Убийств:</b> ${U.fmt(S.stats.kills)} · <b>Боссов:</b> ${U.fmt(S.stats.bosses)} · <b>Предметов:</b> ${U.fmt(S.stats.drops)} · <b>Время:</b> ${U.fmtTime(S.stats.play)}</p>`,buttons:[{label:"⚔ Продолжить автобой",fn:()=>{}}]})}
  function showHelp(){modal({title:"Как играть",sub:"TBH · IDLE RPG",icon:"📖",html:`<ul><li>Герои сражаются <b>полностью сами</b> и идут к врагу единым строем.</li><li>Навигация — <b>🗺 карта прогресса</b>: локации, круги и этапы связаны в цепочку; клик переносит отряд на доступный этап. Цепочка точек в шапке — этапы текущей локации.</li><li>Зелёный — текущий этап, золотой — пройденный, синий — доступный, тусклый — закрытый; 👑 — босс.</li><li>Отряд — максимум <b>4 героя</b>. Кнопка <b>👥</b> — состав (актив/резерв), <b>⚙</b> — построение (позиция 1 всегда танк).</li><li>Кнопка <b>💾</b> — перенос сохранений между устройствами (файл/код), слоты и резервная копия.</li><li>У каждого героя есть <b>HP над головой</b>. Монстры бьют переднего живого героя.</li><li><b>Некромант</b> лечит раненых, а когда все здоровы — бьёт тёмными сферами по площади.</li><li>Броня даёт HP, защиту и реген конкретному герою.</li><li>В начале каждой волны отряд полностью восстанавливается и возвращается в строй. Если все пали — отступление.</li><li>Экипировка падает с монстров (${Math.round(BAL.drops.chance*100)}%) и боссов (100%). <b>✨ Автоэкипировка</b> надевает лучшее на отряд.</li><li><b>🧹 Продать лишнее</b> — продаёт всё вне лучшего комплекта; если лучшее надето (✓) — сразу, без окна.</li><li>Режим <b>«Авто: всё лишнее»</b> продаёт хлам при дропе.</li><li>Окна не останавливают бой. Пауза — <b>P</b>.</li><li><b>P</b> — пауза, <b>M</b> — звук, <b>H</b> — справка, <b>E</b> — автоэкипировка.</li></ul>`})}
})();