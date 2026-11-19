      (function(){
        const T=window.TBH,C=T.config,BAL=C.balance;
        const E=T.events=(()=>{const m={};return{on(e,f){(m[e]=m[e]||[]).push(f)},emit(e,d){(m[e]||[]).forEach(f=>{try{f(d)}catch(err){console.error(err)}})}}})();
        const U=T.util={
          clamp:(v,a,b)=>v<a?a:v>b?b:v, lerp:(a,b,t)=>a+(b-a)*t,
          rand:(a=1,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a),
          irand:(a,b)=>Math.floor(a+Math.random()*(b-a+1)), pick:a=>a[Math.floor(Math.random()*a.length)],
          round1:v=>Math.round(v*10)/10,
          fmt(n){n=Math.floor(n);if(n<1000)return""+n;const u=["К","М","Б","Т","Кв","Кн"];let i=-1,v=n;while(v>=1000&&i<u.length-1){v/=1000;i++}return(v>=100?v.toFixed(0):v>=10?v.toFixed(1):v.toFixed(2))+u[i]},
          fmtTime(s){s=Math.floor(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60);if(h)return h+"ч "+m+"м";if(m)return m+"м "+Math.floor(s%60)+"с";return s+"с"},
          hex2rgb(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]},
          rgb(c){return`rgb(${c[0]|0},${c[1]|0},${c[2]|0})`},
          mix(a,b,t){a=a||[0,0,0];b=b||[0,0,0];return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]},
          shade(hex,amt){const c=U.hex2rgb(hex).map(v=>U.clamp(v+amt,0,255));return"#"+c.map(v=>Math.round(v).toString(16).padStart(2,"0")).join("")},
          weighted(list,key){let sum=0;for(const x of list)sum+=(x[key]||0);let r=Math.random()*sum;for(const x of list){r-=(x[key]||0);if(r<=0)return x}return list[list.length-1]},
          nowTime(){const d=new Date();return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")}
        };

        function tintOf(src,w,h,col){const t=document.createElement("canvas");t.width=w;t.height=h;const x=t.getContext("2d");x.drawImage(src,0,0);x.globalCompositeOperation="source-in";x.fillStyle=col;x.fillRect(0,0,w,h);return t}
        function wrapSprite(c,img){return{c,w:c.width,h:c.height,img:!!img,flash:tintOf(c,c.width,c.height,"#ffffff"),hurt:tintOf(c,c.width,c.height,"#ff4d62"),heal:tintOf(c,c.width,c.height,"#78ff7a")}}
        function buildSprite(rows,palette){const h=rows.length,w=Math.max(...rows.map(r=>r.length)),c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");rows.forEach((r,j)=>{for(let i=0;i<r.length;i++){const col=palette[r[i]];if(col){x.fillStyle=col;x.fillRect(i,j,1,1)}}});return wrapSprite(c,false)}
        const FB_HERO=["....hhhh....","....hffh....","....hhhh....","..aaaaaa.w..",".faaaaaa.w..","..aaaaaa.w..","..aaaaaa....","...aa.aa....","...aa.aa....","...bb.bb...."];
        const FB_MOB=["...cccc...","..cccccc..",".ccecccec.","cccccccccc","cccccccccc",".cccccccc.","..cc..cc..","..cc..cc.."];
        const FB_BOSS=["..y......y..","..ymmmmmmy..","...meemme...","...mmmmmm...",".ddmmmmmmdd.","dddmmmmmmddd",".ddmmmmmmdd.","...mmmmmm...","..mmm..mmm..","..mm....mm.."];
        function processSheet(img,count){
          const w=img.naturalWidth||img.width,h=img.naturalHeight||img.height,c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d",{willReadFrequently:true});x.drawImage(img,0,0);const id=x.getImageData(0,0,w,h),d=id.data;
          const corner=(px,py)=>{const i=(py*w+px)*4;return[d[i],d[i+1],d[i+2]]};
          const bg=corner(0,0),isBg=(r,g,b)=>{const dist=Math.abs(r-bg[0])+Math.abs(g-bg[1])+Math.abs(b-bg[2]);if(bg[0]>140&&bg[2]>140&&bg[1]<120)return(r>130&&b>130&&g<130&&dist<260);return dist<90};
          for(let i=0;i<d.length;i+=4)if(d[i+3]>0&&isBg(d[i],d[i+1],d[i+2]))d[i+3]=0;
          x.putImageData(id,0,0);
          const colCount=new Array(w).fill(0);for(let py=0;py<h;py++)for(let px=0;px<w;px++)if(d[(py*w+px)*4+3]>40)colCount[px]++;
          const minCol=Math.max(3,Math.floor(h*.02)),occ=colCount.map(v=>v>=minCol);let clusters=[],start=-1;
          for(let px=0;px<=w;px++){const on=px<w&&occ[px];if(on&&start<0)start=px;if(!on&&start>=0){clusters.push([start,px-1]);start=-1}}
          const mergeGap=Math.max(4,Math.floor(w*.012)),merged=[];for(const cl of clusters){if(merged.length&&cl[0]-merged[merged.length-1][1]<=mergeGap)merged[merged.length-1][1]=cl[1];else merged.push([...cl])}
          clusters=merged;if(clusters.length!==count){clusters=[];for(let i=0;i<count;i++)clusters.push([Math.floor(i*w/count),Math.floor((i+1)*w/count)-1])}
          return clusters.map(([x0,x1])=>{let minY=h,maxY=0,minX=x1,maxX=x0;for(let py=0;py<h;py++)for(let px=x0;px<=x1;px++)if(d[(py*w+px)*4+3]>40){if(py<minY)minY=py;if(py>maxY)maxY=py;if(px<minX)minX=px;if(px>maxX)maxX=px}if(maxY<minY){minY=0;maxY=h-1;minX=x0;maxX=x1}return{cx:minX,cy:minY,cw:maxX-minX+1,ch:maxY-minY+1,src:c}})
        }
        function spriteFromBox(box,pixelHeight){const th=U.clamp(pixelHeight||48,16,160),tw=Math.max(4,Math.round(box.cw*(th/box.ch))),c=document.createElement("canvas");c.width=tw;c.height=th;const x=c.getContext("2d");x.imageSmoothingEnabled=true;x.imageSmoothingQuality="high";x.drawImage(box.src,box.cx,box.cy,box.cw,box.ch,0,0,tw,th);return wrapSprite(c,true)}
        const imgCache={};function loadImage(src){if(imgCache[src])return imgCache[src];imgCache[src]=new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>rej(new Error("img "+src));im.src=src});return imgCache[src]}
        const spriteCache={};
        T.getSprite=function(def,kind){
          const key=kind+":"+def.id;if(spriteCache[key])return spriteCache[key];let out;
          if(def.sprite?.rows)out=[buildSprite(def.sprite.rows,def.sprite.palette||{})];
          else if(def.sprite?.frames)out=def.sprite.frames.map(r=>buildSprite(r,def.sprite.palette||{}));
          else{const col=def.color||"#8fa2cc",pal={h:U.shade(col,35),f:"#ffd9a8",a:col,b:U.shade(col,-55),w:"#f2f6ff",c:col,e:"#101322",m:col,d:U.shade(col,-60),y:"#ffd866"};out=[buildSprite(kind==="hero"?FB_HERO:(def.boss?FB_BOSS:FB_MOB),pal)]}
          spriteCache[key]=out;const sp=def.sprite;
          if(sp?.src){const count=Math.max(1,sp.count||1),index=U.clamp(sp.index||0,0,count-1);loadImage(sp.src).then(img=>{const boxes=processSheet(img,count);spriteCache[key]=[spriteFromBox(boxes[index],sp.pixelHeight)];E.emit("sprites",{id:def.id})}).catch(()=>{})}
          return out
        };

        const KEY="tbh_idle_equipment_v1";
        function freshHeroes(){const h={};for(const d of C.heroes){const free=(d.recruitCost||0)<=0,eq={};for(const s of Object.keys(C.slots))eq[s]=null;h[d.id]={lvl:free?1:0,rec:free,equip:eq}}return h}
        function defaults(){return{v:2,gold:BAL.startGold||0,gems:0,wave:1,maxWave:1,heroes:freshHeroes(),inventory:[],equipped:{},nextUid:1,lazaretLvl:0,mineLvl:0,settings:{speed:1,muted:false,auto:true,autoSell:"off"},prestiges:0,victory:false,hint:true,lastSeen:Date.now(),stats:{kills:0,bosses:0,gold:0,play:0,drops:0}}}
        let S=defaults(),hadSave=false;
        function validateItem(it){const def=C.items.find(x=>x.id===it.defId);if(!def||!C.slots[def.slot]||!it.stats)return null;const rar=C.rarities.find(r=>r.id===it.rarity)||C.rarities[0];return{uid:String(it.uid||("i"+S.nextUid++)),defId:def.id,slot:def.slot,rarity:rar.id,ilvl:Math.max(1,it.ilvl|0||1),stats:it.stats,value:Math.max(1,it.value|0||1)}}
        T.load=function(){S=defaults();try{const raw=localStorage.getItem(KEY);if(raw){const d=JSON.parse(raw);hadSave=true;S=Object.assign(defaults(),d);S.settings=Object.assign(defaults().settings,d.settings||{});S.stats=Object.assign(defaults().stats,d.stats||{});S.lazaretLvl=Math.max(0,(d.lazaretLvl??d.wallLvl??0)|0);const fresh=freshHeroes();for(const id in fresh){const old=(d.heroes||{})[id];if(old){fresh[id].lvl=Math.max(0,old.lvl|0);fresh[id].rec=!!old.rec||fresh[id].lvl>0;fresh[id].equip=Object.assign(fresh[id].equip,old.equip||{})}}const pal=(d.heroes||{}).paladin;if(pal?.rec&&fresh.healer){fresh.healer.rec=true;fresh.healer.lvl=Math.max(1,pal.lvl|0||1);fresh.healer.equip=Object.assign(fresh.healer.equip,pal.equip||{})}S.heroes=fresh;S.inventory=(d.inventory||[]).map(validateItem).filter(Boolean);S.equipped={};for(const uid in(d.equipped||{})){const it=validateItem(d.equipped[uid]);if(it)S.equipped[it.uid]=it}for(const hid in S.heroes){const h=S.heroes[hid];for(const slot in h.equip){const uid=h.equip[slot];if(uid&&(!S.equipped[uid]||S.equipped[uid].slot!==slot))h.equip[slot]=null}}const used=new Set();for(const hid in S.heroes)for(const s in S.heroes[hid].equip){const u=S.heroes[hid].equip[s];if(u)used.add(u)}for(const uid in S.equipped)if(!used.has(uid)){S.inventory.push(S.equipped[uid]);delete S.equipped[uid]}S.wave=U.clamp(S.wave|0||1,1,999999);S.maxWave=Math.max(S.maxWave|0||1,S.wave)}}catch(e){console.warn("load failed",e)}T.S=S;return{state:S,hadSave}};
        T.save=function(){S.lastSeen=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S));E.emit("saved")}catch(e){}};
        T.hadSave=()=>hadSave;

        const totalWaves=()=>C.levels.reduce((s,z)=>s+(z.waves||10),0)||1;
        const WU=T.waves={
          total:totalWaves,victoryWave(){return C.levelRules.victoryWave||totalWaves()},isBoss(w){return w%C.levelRules.bossEvery===0},
          zoneFor(w){const total=totalWaves(),tier=C.levelRules.loop?Math.floor((w-1)/total):0,idx=(w-1)%total;let acc=0,zone=C.levels[0];for(const z of C.levels){if(idx<acc+(z.waves||10)){zone=z;break}acc+=z.waves||10}return{zone,tier,hpMult:(zone.hpMult||1)*Math.pow(C.levelRules.loopHpMult||1,tier),goldMult:(zone.goldMult||1)*Math.pow(C.levelRules.loopGoldMult||1,tier)}},
          mobPool(w){const z=WU.zoneFor(w).zone,pool=(z.monsters||[]).map(id=>C.monsters[id]).filter(Boolean);return pool.length?pool:[Object.values(C.monsters).find(m=>!m.boss)||Object.values(C.monsters)[0]]},
          bossDef(w){const z=WU.zoneFor(w).zone;return C.monsters[z.boss]||Object.values(C.monsters).find(m=>m.boss)||Object.values(C.monsters)[0]},
          enemyHp(w,boss,def){const zi=WU.zoneFor(w),b=boss?(BAL.boss.hpMult*(w===WU.victoryWave()?BAL.boss.finalMult:1)):1;return Math.ceil(BAL.enemy.hpBase*Math.pow(BAL.enemy.hpGrowth,w-1)*zi.hpMult*(def.hpMult||1)*b)},
          enemyGold(w,boss,def){const zi=WU.zoneFor(w);return Math.ceil(BAL.enemy.goldBase*Math.pow(BAL.enemy.goldGrowth,w-1)*zi.goldMult*(def.goldMult||1)*(boss?BAL.boss.goldMult:1))},
          count(w){return WU.isBoss(w)?1:Math.min(BAL.enemy.countMax,BAL.enemy.countBase+Math.ceil(w*BAL.enemy.countPerWave))},
          spawnInt(w){return Math.max(BAL.enemy.spawnMin,BAL.enemy.spawnBase-w*.02)},
          retreatWave(w){return Math.floor((w-1)/C.levelRules.bossEvery)*C.levelRules.bossEvery+1}
        };

        const heroDef=id=>C.heroes.find(h=>h.id===id),rarityOf=it=>C.rarities.find(r=>r.id===it.rarity)||C.rarities[0],itemDef=it=>C.items.find(i=>i.id===it.defId),sumStat=(items,k)=>items.reduce((s,it)=>s+(+it.stats[k]||0),0),equippedItems=hid=>{const h=S.heroes[hid];return h?Object.values(h.equip).map(uid=>S.equipped[uid]).filter(Boolean):[]},allEquipped=()=>Object.values(S.equipped),relicMult=()=>1+S.gems*BAL.prestige.gemBonus;
        const D=T.derived={heroDef,rarityOf,itemDef,equippedItems,relicMult,
          heroStats(id,itemsOverride){const def=heroDef(id),h=S.heroes[id];if(!def||!h)return{lvl:0,dmg:0,speed:0,crit:0,critDmg:0,dps:0,hps:0,maxHp:0,defPct:0,regen:0,isHealer:false};const lvl=Math.max(1,h.lvl||1),items=itemsOverride||equippedItems(id),isHealer=def.role==="healer";let power=def.baseDmg*lvl*Math.pow(BAL.hero.dmgGrowth,lvl-1)*Math.pow(BAL.hero.milestoneMult,Math.floor(lvl/BAL.hero.milestoneEvery))*relicMult();power*=1+sumStat(items,"dmgPct")/100;const speed=def.atkSpeed*(1+sumStat(items,"atkSpd")/100),crit=U.clamp(BAL.crit.baseChance+sumStat(items,"crit"),0,75),critDmg=BAL.crit.baseDamage+sumStat(items,"critDmg"),expected=power*speed*(1+crit/100*(critDmg/100-1)),baseHp=(def.baseHp||100)+(def.hpPerLevel||0)*(lvl-1),maxHp=Math.ceil(baseHp*(1+S.lazaretLvl*BAL.party.hpBonusPerLvl)+sumStat(items,"hpFlat")),defPct=Math.min(BAL.combat.defCap,sumStat(items,"defPct")),regen=(def.baseRegen??.6)+sumStat(items,"regen");return{lvl,dmg:power,speed,crit,critDmg,dps:isHealer?0:expected,hps:isHealer?expected:0,maxHp,defPct,regen,isHealer}},
          totalDps(){return C.heroes.reduce((s,h)=>S.heroes[h.id]?.rec?s+D.heroStats(h.id).dps:s,0)},
          totalHps(){return C.heroes.reduce((s,h)=>S.heroes[h.id]?.rec?s+D.heroStats(h.id).hps:s,0)},
          globalGear(){return{goldPct:sumStat(allEquipped(),"goldPct")}},
          goldMult(){return(1+S.mineLvl*BAL.economy.goldPerMineLevel)*relicMult()*(1+D.globalGear().goldPct/100)}
        };

        function overflow(){if(S.inventory.length<BAL.drops.inventoryCap)return;let worst=S.inventory[0],wi=0;for(let i=1;i<S.inventory.length;i++)if(IT.power(S.inventory[i])<IT.power(worst)){worst=S.inventory[i];wi=i}if(worst){S.inventory.splice(wi,1);S.gold+=worst.value;S.stats.gold+=worst.value;E.emit("gold",{amount:worst.value,x:null,y:null,raw:true});E.emit("log",{msg:"Инвентарь полон — продан худший предмет: "+itemDef(worst).name,type:"gold"})}}
        function addRawGold(n,x,y){n=Math.ceil(n);S.gold+=n;S.stats.gold+=n;E.emit("gold",{amount:n,x,y,raw:true})}
        const IT=T.items={
          power(it){let p=0;for(const k in it.stats)p+=it.stats[k]*(C.statMeta[k]?.weight||1);return p},
          statLines(it){return Object.keys(it.stats).map(k=>{const m=C.statMeta[k]||{label:k,suffix:"",icon:"•"};return`${m.icon} +${U.round1(it.stats[k])}${m.suffix} ${m.label}`})},
          roll(wave,boss){const rar=U.weighted(C.rarities,boss?"bossWeight":"weight"),def=U.pick(C.items),ilvl=Math.max(1,wave+U.irand(-1,1)+(boss?2:0)),stats={};for(const k in def.stats)stats[k]=U.round1(def.stats[k]*(1+(ilvl-1)*BAL.drops.itemLevelScale)*rar.mult*U.rand(.9,1.1));const value=Math.ceil((BAL.drops.sellBase+ilvl*BAL.drops.sellPerLevel)*rar.mult*rar.mult*(boss?1.5:1));return{uid:"i"+(S.nextUid++),defId:def.id,slot:def.slot,rarity:rar.id,ilvl,stats,value}},
          handleDrop(item,x,y,source){const r=D.rarityOf(item),def=itemDef(item),idx=C.rarities.findIndex(q=>q.id===r.id),th=S.settings.autoSell,thIdx=th==="off"?-1:C.rarities.findIndex(q=>q.id===th);S.stats.drops++;if(thIdx>=0&&idx<=thIdx){addRawGold(item.value,x,y);E.emit("drop",{item,x,y,autoSold:true,source});E.emit("log",{msg:`Автопродажа: ${def.name} +${U.fmt(item.value)}🪙`,type:"gold"});return}overflow();S.inventory.push(item);E.emit("inv");E.emit("drop",{item,x,y,autoSold:false,source});E.emit("log",{msg:`🎁 ${r.name}: ${def.name} (ур.${item.ilvl})`,type:"drop",color:r.color});if(idx>=3)E.emit("toast",{msg:`${def.icon} ${r.name} дроп: ${def.name}!`,type:"drop"})},
          maybeDrop(wave,boss,x,y,source){let n=0;if(Math.random()<(boss?BAL.drops.bossChance:BAL.drops.chance))n++;if(boss&&Math.random()<BAL.drops.bossExtraChance)n++;for(let i=0;i<n;i++)IT.handleDrop(IT.roll(wave,boss),x,y,source)},
          equip(uid,heroId){const idx=S.inventory.findIndex(i=>i.uid===uid),h=S.heroes[heroId];if(idx<0||!h||!h.rec)return false;const it=S.inventory[idx],slot=it.slot,oldUid=h.equip[slot];if(oldUid&&S.equipped[oldUid]){overflow();S.inventory.push(S.equipped[oldUid]);delete S.equipped[oldUid]}S.inventory.splice(idx,1);S.equipped[uid]=it;h.equip[slot]=uid;E.emit("inv");E.emit("heroes");E.emit("log",{msg:`${itemDef(it).icon} ${itemDef(it).name} → ${heroDef(heroId).name}`,type:"success"});E.emit("sfx","equip");T.save();return true},
          unequip(heroId,slot){const h=S.heroes[heroId];if(!h)return false;const uid=h.equip[slot];if(!uid||!S.equipped[uid])return false;const it=S.equipped[uid];overflow();S.inventory.push(it);delete S.equipped[uid];h.equip[slot]=null;E.emit("inv");E.emit("heroes");E.emit("log",{msg:`Снято: ${itemDef(it).name}`,type:"info"});E.emit("sfx","sell");T.save();return true},
          sell(uid){const idx=S.inventory.findIndex(i=>i.uid===uid);if(idx<0)return false;const it=S.inventory[idx];S.inventory.splice(idx,1);addRawGold(it.value);E.emit("inv");E.emit("log",{msg:`Продано: ${itemDef(it).name} +${U.fmt(it.value)}🪙`,type:"gold"});E.emit("sfx","sell");T.save();return true},
          sellCommon(){let total=0,n=0;for(let i=S.inventory.length-1;i>=0;i--)if(S.inventory[i].rarity==="common"){total+=S.inventory[i].value;S.inventory.splice(i,1);n++}if(n){addRawGold(total);E.emit("inv");E.emit("toast",{msg:`Продано ${n} обычных предметов за ${U.fmt(total)}🪙`,type:"gold"});E.emit("sfx","chest");T.save()}else E.emit("toast",{msg:"Обычных предметов нет",type:"info"});return n},
          autoEquipPreview(){const heroes=C.heroes.filter(h=>S.heroes[h.id]?.rec),slots=Object.keys(C.slots),all=[...S.inventory,...Object.values(S.equipped)],byUid={};all.forEach(i=>byUid[i.uid]=i);const powerOf=h=>{const st=D.heroStats(h.id,[]);return st.dps+st.hps*.9},order=[...heroes].sort((a,b)=>powerOf(b)-powerOf(a)),assign={};for(const h of C.heroes){assign[h.id]={};for(const s of slots)assign[h.id][s]=null}const score=(it,slot)=>{const s=it.stats;if(slot==="armor")return(s.defPct||0)*4+(s.hpFlat||0)*.12+(s.regen||0)*10+(s.goldPct||0)*.6;return(s.dmgPct||0)*3+(s.atkSpd||0)*3+(s.crit||0)*4+(s.critDmg||0)*1.2+(s.goldPct||0)*.6};for(const slot of slots){const pool=all.filter(i=>i.slot===slot).sort((a,b)=>score(b,slot)-score(a,slot));for(let i=0;i<Math.min(pool.length,order.length);i++)assign[order[i].id][slot]=pool[i].uid}const itemsFor=hid=>slots.map(s=>assign[hid][s]).filter(Boolean).map(u=>byUid[u]).filter(Boolean);let dpsAfter=0;for(const h of heroes)dpsAfter+=D.heroStats(h.id,itemsFor(h.id)).dps;const dpsBefore=D.totalDps();let changes=0;for(const h of heroes)for(const s of slots)if((S.heroes[h.id].equip[s]||null)!==(assign[h.id][s]||null))changes++;const util=items=>{const sum=k=>items.reduce((a,i)=>a+(+i.stats[k]||0),0);return{gold:sum("goldPct"),def:Math.min(BAL.combat.defCap,sum("defPct")),hp:sum("hpFlat"),regen:sum("regen")}},afterUids=[];for(const h of C.heroes)for(const s of slots){const u=assign[h.id][s];if(u)afterUids.push(u)}const utilBefore=util(Object.values(S.equipped)),utilAfter=util(afterUids.map(u=>byUid[u]).filter(Boolean)),dpsGain=dpsBefore>0?(dpsAfter/dpsBefore-1)*100:0,improved=changes>0&&(dpsAfter>dpsBefore*1.0001||utilAfter.gold>utilBefore.gold||utilAfter.def>utilBefore.def||utilAfter.hp>utilBefore.hp||utilAfter.regen>utilBefore.regen);return{heroes,slots,all,byUid,assign,changes,dpsBefore,dpsAfter,dpsGain,improved,utilBefore,utilAfter}},
          autoEquip(){const p=IT.autoEquipPreview();if(!p.heroes.length){E.emit("toast",{msg:"Нет нанятых героев",type:"danger"});return p}if(!p.changes){E.emit("toast",{msg:"✓ Уже надета лучшая экипировка",type:"success"});E.emit("sfx","click");return p}const assigned=new Set(),newEquipped={};for(const h of C.heroes)for(const s of p.slots){const uid=p.assign[h.id]?.[s]||null;S.heroes[h.id].equip[s]=uid;if(uid){assigned.add(uid);newEquipped[uid]=p.byUid[uid]}}S.equipped=newEquipped;S.inventory=p.all.filter(i=>!assigned.has(i.uid));E.emit("inv");E.emit("heroes");E.emit("sfx","equip");const gainTxt=p.dpsGain>.05?` · +${p.dpsGain.toFixed(1)}% ДПС`:"";E.emit("toast",{msg:`✨ Автоэкипировка: слотов обновлено ${p.changes}${gainTxt}`,type:"success"});E.emit("log",{msg:`✨ Автоэкипировка: слотов обновлено ${p.changes}${gainTxt}`,type:"success"});T.save();return p}
        };

        const costSum=(base,r,lvl,n)=>base*Math.pow(r,lvl)*(Math.pow(r,n)-1)/(r-1),maxBuy=(base,r,lvl,gold)=>gold<=0?0:Math.min(500,Math.floor(Math.log(gold*(r-1)/(base*Math.pow(r,lvl))+1)/Math.log(r)));
        const EC=T.econ={costSum,maxBuy,
          addGold(n,opt={}){const amount=Math.ceil(n*(opt.raw?1:D.goldMult()));S.gold+=amount;S.stats.gold+=amount;E.emit("gold",{amount,x:opt.x,y:opt.y,raw:!!opt.raw});return amount},
          heroCost(id,qty){const def=heroDef(id),h=S.heroes[id],n=qty==="max"?Math.max(1,maxBuy(def.costBase,BAL.hero.costGrowth,h.lvl,S.gold)):parseInt(qty,10),cost=costSum(def.costBase,BAL.hero.costGrowth,h.lvl,n);return{n,cost,affordable:S.gold>=cost&&(qty!=="max"||maxBuy(def.costBase,BAL.hero.costGrowth,h.lvl,S.gold)>=1)}},
          buyHero(id,qty){const def=heroDef(id),h=S.heroes[id];if(!h.rec){if(S.gold<(def.recruitCost||0))return false;S.gold-=def.recruitCost||0;h.rec=true;h.lvl=1;E.emit("heroes");E.emit("toast",{msg:`🎉 ${def.name} вступает в отряд!`,type:"success"});E.emit("sfx","recruit");T.save();return true}const q=EC.heroCost(id,qty);if(!q.affordable)return false;const oldM=Math.floor(h.lvl/BAL.hero.milestoneEvery);S.gold-=q.cost;h.lvl+=q.n;if(Math.floor(h.lvl/BAL.hero.milestoneEvery)>oldM)E.emit("toast",{msg:`⭐ ${def.name}: рубеж ×${BAL.hero.milestoneMult}!`,type:"gold"});E.emit("heroes");E.emit("sfx","lvl");T.save();return true},
          lazaretCost(){return Math.ceil(BAL.party.lazaretCostBase*Math.pow(BAL.party.lazaretCostGrowth,S.lazaretLvl))},
          upgradeLazaret(){const c=EC.lazaretCost();if(S.gold<c)return false;S.gold-=c;S.lazaretLvl++;E.emit("heroes");E.emit("sfx","lvl");T.save();return true},
          mineCost(){return Math.ceil(BAL.economy.mineCostBase*Math.pow(BAL.economy.mineCostGrowth,S.mineLvl))},
          upgradeMine(){const c=EC.mineCost();if(S.gold<c)return false;S.gold-=c;S.mineLvl++;E.emit("heroes");E.emit("sfx","lvl");T.save();return true},
          prestGain(){return S.maxWave<BAL.prestige.minWave?0:Math.max(1,Math.floor(Math.pow(S.maxWave/BAL.prestige.formulaDiv,BAL.prestige.formulaPow)))},
          doPrestige(){const gain=EC.prestGain();if(gain<1)return 0;const stats=S.stats,settings=S.settings,gems=S.gems+gain,prest=S.prestiges+1,victory=S.victory,hint=S.hint;S=Object.assign(defaults(),{gems,prestiges:prest,stats,settings,victory,hint});T.S=S;E.emit("heroes");E.emit("inv");E.emit("prestige");E.emit("toast",{msg:`💎 Перерождение! +${gain} кристаллов`,type:"success"});E.emit("sfx","bossdie");T.save();return gain}
        };
        T.log=(msg,type="info",color)=>E.emit("log",{msg,type,color});
        T.toast=(msg,type="info")=>E.emit("toast",{msg,type});
      })();
