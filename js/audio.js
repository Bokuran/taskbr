      (function(){
        const T=window.TBH,E=T.events;let AC=null,master=null,sfxG=null,musG=null,nextNote=0,step=0;const last={};
        const A=T.audio={
          init(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=T.S.settings.muted?0:.48;master.connect(AC.destination);sfxG=AC.createGain();sfxG.gain.value=.9;sfxG.connect(master);musG=AC.createGain();musG.gain.value=.34;musG.connect(master);nextNote=AC.currentTime+.1;setInterval(A.musicTick,110)}catch(e){}},
          resume(){if(AC&&AC.state==="suspended")AC.resume()},
          setMuted(m){if(master)master.gain.value=m?0:.48},
          tone(f,d,type="square",v=.1,slide=0,when=0,dest){if(!AC||T.S.settings.muted)return;const t=AC.currentTime+when,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(dest||sfxG);o.start(t);o.stop(t+d+.03)},
          noise(d,v,fq,when=0){if(!AC||T.S.settings.muted)return;const t=AC.currentTime+when,len=Math.max(1,(d*AC.sampleRate)|0),buf=AC.createBuffer(1,len,AC.sampleRate),ch=buf.getChannelData(0);for(let i=0;i<len;i++)ch[i]=(Math.random()*2-1)*(1-i/len);const src=AC.createBufferSource();src.buffer=buf;const f=AC.createBiquadFilter();f.type="lowpass";f.frequency.value=fq;const g=AC.createGain();g.gain.value=v;src.connect(f);f.connect(g);g.connect(sfxG);src.start(t)},
          throttle(key,ms,fn){const n=performance.now();if(n-(last[key]||0)>ms){last[key]=n;fn()}},
          play(name,arg){if(!AC)return;switch(name){
            case"hit":A.throttle("hit",70,()=>A.tone(150+Math.random()*70,.055,"square",.09,-40));break;
            case"arrow":A.throttle("arrow",80,()=>A.tone(880,.05,"triangle",.06,-330));break;
            case"fire":A.throttle("fire",100,()=>{A.noise(.11,.08,900);A.tone(210,.1,"sawtooth",.05,-100)});break;
            case"hammer":A.throttle("hammer",100,()=>A.tone(175,.09,"square",.08,-55));break;
            case"boom":A.throttle("boom",90,()=>{A.noise(.2,.16,500);A.tone(105,.18,"sawtooth",.1,-45)});break;
            case"coin":A.throttle("coin",90,()=>{A.tone(1046,.06,"sine",.09);A.tone(1568,.08,"sine",.08,0,.06)});break;
            case"drop":A.throttle("drop",120,()=>{const idx=T.config.rarities.findIndex(r=>r.id===arg?.rarity);[784,1046,1318].forEach((f,i)=>A.tone(f+(idx>2?200:0),.08,"sine",.08,0,i*.055))});break;
            case"boss":A.tone(78,.6,"sawtooth",.18,-28);A.noise(.35,.13,300);break;
            case"bossdie":[523,659,784,1046].forEach((f,i)=>A.tone(f,.13,"square",.1,0,i*.085));A.noise(.28,.13,700,.08);break;
            case"fail":[390,290,190].forEach((f,i)=>A.tone(f,.17,"sawtooth",.1,-25,i*.13));break;
            case"lvl":[523,659,784].forEach((f,i)=>A.tone(f,.09,"square",.07,0,i*.06));break;
            case"recruit":[392,523,659,784].forEach((f,i)=>A.tone(f,.11,"square",.08,0,i*.075));break;
            case"equip":A.tone(660,.07,"triangle",.08,200);A.tone(990,.08,"sine",.06,0,.06);break;
            case"sell":A.tone(880,.05,"sine",.06);A.tone(660,.07,"sine",.05,0,.05);break;
            case"chest":[1046,1318,1568].forEach((f,i)=>A.tone(f,.07,"sine",.08,0,i*.055));break;
            case"wave":A.throttle("wave",350,()=>[392,523,659].forEach((f,i)=>A.tone(f,.07,"triangle",.06,0,i*.055)));break;
            case"heroHit":A.throttle("heroHit",120,()=>{A.tone(95,.07,"square",.1,-20);A.noise(.05,.06,300)});break;
            case"heal":A.throttle("heal",150,()=>{A.tone(660,.09,"sine",.07,180);A.tone(990,.1,"sine",.05,120,.05)});break;
            case"death":A.tone(220,.25,"sawtooth",.12,-120);A.tone(110,.3,"sawtooth",.1,-60,.1);break;
            case"click":A.tone(700,.03,"square",.035);break;
          }},
          musicTick(){if(!AC||T.S.settings.muted||document.hidden||T.ui?.isPaused())return;const spb=.24,root=T.waves.zoneFor(T.S.wave).zone.musicRoot||110,scale=[0,3,5,7,10,12],pat=[0,2,4,2,5,4,2,1,0,2,4,5,4,2,1,2];while(nextNote<AC.currentTime+.3){const st=step%16,when=Math.max(0,nextNote-AC.currentTime),f=root*Math.pow(2,scale[pat[st]%scale.length]/12)*2;A.tone(f,.17,"square",.022,0,when,musG);if(st%8===0)A.tone(root/2,.38,"triangle",.045,0,when,musG);if(st%4===2)A.noise(.025,.01,6000,when);nextNote+=spb;step++}}
        };
        E.on("sfx",d=>A.play(typeof d==="string"?d:d.name,d.arg));
      })();
