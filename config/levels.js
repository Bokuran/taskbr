      window.TBH = window.TBH || {};
      TBH.config = TBH.config || {};
      TBH.config.levelRules = { bossEvery:5, loop:true, loopHpMult:3.2, loopGoldMult:2, victoryWave:null };
      TBH.config.levels = [
        {id:"forest",name:"Изумрудный лес",icon:"🌲",waves:10,hpMult:1,goldMult:1,monsters:["slime","bat"],boss:"slime_king",colors:{sky1:"#0e2a3f",sky2:"#123a2e",hill1:"#0c2f26",hill2:"#0a241d",ground:"#123524"},stars:false,musicRoot:110},
        {id:"waste",name:"Ржавая пустошь",icon:"🏜",waves:10,hpMult:1.08,goldMult:1.05,monsters:["goblin","skel"],boss:"bone_lord",colors:{sky1:"#3a1d12",sky2:"#5a2a10",hill1:"#2a160c",hill2:"#1f1008",ground:"#33200f"},stars:false,musicRoot:98},
        {id:"caves",name:"Сумрачные пещеры",icon:"🕯",waves:10,hpMult:1.16,goldMult:1.12,monsters:["imp","golem"],boss:"ogre",colors:{sky1:"#141031",sky2:"#241245",hill1:"#1a0f33",hill2:"#120a26",ground:"#1c1236"},stars:true,musicRoot:87.3},
        {id:"peaks",name:"Ледяные пики",icon:"🏔",waves:10,hpMult:1.25,goldMult:1.2,monsters:["wraith","bat"],boss:"ice_giant",colors:{sky1:"#0c2438",sky2:"#1a3a52",hill1:"#16324a",hill2:"#0e2236",ground:"#1d3c55"},stars:true,musicRoot:130.8},
        {id:"castle",name:"Багровый замок",icon:"🏰",waves:10,hpMult:1.38,goldMult:1.3,monsters:["skel","imp","wraith"],boss:"demon",colors:{sky1:"#2a0a1c",sky2:"#45102a",hill1:"#33081f",hill2:"#220614",ground:"#3a0c24"},stars:true,musicRoot:103.8}
      ];
