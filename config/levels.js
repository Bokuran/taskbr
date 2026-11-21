(function(){
  window.TBH = window.TBH || {};
  TBH.config = TBH.config || {};
  const X = "assets/expansion.png";
  const BG = "assets/bg_atlas.png";
  // 8 равных полос атласа фонов (сверху вниз): лес, пустошь, пещеры, пики, замок, кристаллы, вулкан, проклятый лес
  const band = i => [0, i * 0.125 + 0.008, 1, 0.109];
  const FB_CRY = {src:X, region:[0.01,0.51,0.46,0.11]}, FB_VOL = {src:X, region:[0.01,0.665,0.46,0.11]}, FB_FOR = {src:X, region:[0.01,0.82,0.46,0.11]};
  TBH.config.levelRules = { bossEvery:5, loop:true, loopHpMult:3.2, loopGoldMult:2, victoryWave:null };
  TBH.config.levels = [
    {id:"forest",name:"Изумрудный лес",icon:"🌲",waves:10,hpMult:1,goldMult:1,monsters:["shadow_wraith"],boss:"shadow_king",colors:{sky1:"#0e2a3f",sky2:"#123a2e",hill1:"#0c2f26",hill2:"#0a241d",ground:"#123524"},stars:false,musicRoot:110,bg:{src:BG,region:band(0),fb:FB_FOR}},
    {id:"waste",name:"Ржавая пустошь",icon:"🏜",waves:10,hpMult:1.08,goldMult:1.05,monsters:["flame_demon"],boss:"flame_lord",colors:{sky1:"#3a1d12",sky2:"#5a2a10",hill1:"#2a160c",hill2:"#1f1008",ground:"#33200f"},stars:false,musicRoot:98,bg:{src:BG,region:band(1),fb:FB_VOL}},
    {id:"caves",name:"Сумрачные пещеры",icon:"🕯",waves:10,hpMult:1.16,goldMult:1.12,monsters:["crystal_golem"],boss:"crystal_titan",colors:{sky1:"#141031",sky2:"#241245",hill1:"#1a0f33",hill2:"#120a26",ground:"#1c1236"},stars:true,musicRoot:87.3,bg:{src:BG,region:band(2),fb:FB_CRY}},
    {id:"peaks",name:"Ледяные пики",icon:"🏔",waves:10,hpMult:1.25,goldMult:1.2,monsters:["crystal_golem","shadow_wraith"],boss:"crystal_titan",colors:{sky1:"#0c2438",sky2:"#1a3a52",hill1:"#16324a",hill2:"#0e2236",ground:"#1d3c55"},stars:true,musicRoot:130.8,bg:{src:BG,region:band(3),fb:FB_CRY}},
    {id:"castle",name:"Багровый замок",icon:"🏰",waves:10,hpMult:1.38,goldMult:1.3,monsters:["flame_demon","shadow_wraith"],boss:"flame_lord",colors:{sky1:"#2a0a1c",sky2:"#45102a",hill1:"#33081f",hill2:"#220614",ground:"#3a0c24"},stars:true,musicRoot:103.8,bg:{src:BG,region:band(4),fb:FB_VOL}},
    {id:"crystal",name:"Кристальные пещеры",icon:"💎",waves:10,hpMult:1.5,goldMult:1.4,monsters:["crystal_golem"],boss:"crystal_titan",colors:{sky1:"#141031",sky2:"#241245",hill1:"#1a0f33",hill2:"#120a26",ground:"#1c1236"},stars:true,musicRoot:87.3,bg:{src:BG,region:band(5),fb:FB_CRY}},
    {id:"volcano",name:"Вулканическая пустошь",icon:"🌋",waves:10,hpMult:1.65,goldMult:1.55,monsters:["flame_demon"],boss:"flame_lord",colors:{sky1:"#2a0a08",sky2:"#451408",hill1:"#330c06",hill2:"#220804",ground:"#3a1008"},stars:false,musicRoot:82,bg:{src:BG,region:band(6),fb:FB_VOL}},
    {id:"cursed",name:"Проклятый лес",icon:"🌲",waves:10,hpMult:1.85,goldMult:1.75,monsters:["shadow_wraith"],boss:"shadow_king",colors:{sky1:"#0e2a1f",sky2:"#123a2e",hill1:"#0c2f26",hill2:"#0a241d",ground:"#123524"},stars:false,musicRoot:92,bg:{src:BG,region:band(7),fb:FB_FOR}}
  ];
})();